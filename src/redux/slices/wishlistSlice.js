import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "electromart_wishlist";

const loadWishlist = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistWishlist = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const initialState = {
  items: loadWishlist(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);
      if (exists) {
        state.items = state.items.filter((item) => item.id !== product.id);
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          image: product.images?.[0] || product.image,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice,
          rating: product.rating,
        });
      }
      persistWishlist(state.items);
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persistWishlist(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      persistWishlist(state.items);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsWishlisted = (id) => (state) =>
  state.wishlist.items.some((item) => item.id === id);
