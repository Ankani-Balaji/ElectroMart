import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  return await getAllProducts();
});

export const fetchCategories = createAsyncThunk("products/fetchCategories", async () => {
  return await getCategories();
});

export const addProduct = createAsyncThunk("products/add", async (product) => {
  return await createProduct(product);
});

export const editProduct = createAsyncThunk("products/edit", async ({ id, updates }) => {
  return await updateProduct(id, updates);
});

export const removeProduct = createAsyncThunk("products/remove", async (id) => {
  return await deleteProduct(id);
});

const initialState = {
  items: [],
  categories: [],
  status: "idle",
  error: null,
  filters: {
    search: "",
    category: "all",
    sort: "relevance", // relevance | price-asc | price-desc | rating | newest
    minPrice: 0,
    maxPrice: 200000,
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    setCategory: (state, action) => {
      state.filters.category = action.payload;
    },
    setSort: (state, action) => {
      state.filters.sort = action.payload;
    },
    setPriceRange: (state, action) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setSearch, setCategory, setSort, setPriceRange, resetFilters } =
  productSlice.actions;

export default productSlice.reducer;

// Selectors
export const selectFilteredProducts = (state) => {
  const { items, filters } = state.products;
  let result = [...items];

  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (filters.category !== "all") {
    result = result.filter((p) => p.category === filters.category);
  }

  result = result.filter(
    (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
  );

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      result.sort((a, b) => (b.id > a.id ? 1 : -1));
      break;
    default:
      break;
  }

  return result;
};
