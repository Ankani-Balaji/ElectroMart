import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllOrders,
  getOrdersByUser,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "../../services/orderService";

export const fetchAllOrders = createAsyncThunk("orders/fetchAll", async () => {
  return await getAllOrders();
});

export const fetchUserOrders = createAsyncThunk("orders/fetchByUser", async (userId) => {
  return await getOrdersByUser(userId);
});

export const placeOrder = createAsyncThunk("orders/place", async (orderPayload) => {
  return await createOrder(orderPayload);
});

export const changeOrderStatus = createAsyncThunk(
  "orders/changeStatus",
  async ({ id, status }) => {
    return await updateOrderStatus(id, status);
  }
);

export const removeOrder = createAsyncThunk("orders/remove", async (id) => {
  return await deleteOrder(id);
});

const initialState = {
  items: [],
  status: "idle",
  error: null,
  lastPlacedOrder: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearLastPlacedOrder: (state) => {
      state.lastPlacedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.lastPlacedOrder = action.payload;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeOrder.fulfilled, (state, action) => {
        state.items = state.items.filter((o) => o.id !== action.payload);
      });
  },
});

export const { clearLastPlacedOrder } = orderSlice.actions;
export default orderSlice.reducer;
