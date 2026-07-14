import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "electromart_cart";

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistCart = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const initialState = {
  items: loadCart(), // { id, title, image, brand, price, originalPrice, quantity, stock }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity < (product.stock ?? Infinity)) {
          existing.quantity += 1;
        }
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          image: product.images?.[0] || product.image,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice,
          stock: product.stock,
          quantity: 1,
        });
      }
      persistCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persistCart(state.items);
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity < (item.stock ?? Infinity)) item.quantity += 1;
      persistCart(state.items);
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      persistCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persistCart(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
