import api from "./api";

export const getAllOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const getOrdersByUser = async (userId) => {
  const { data } = await api.get("/orders", { params: { userId } });
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const createOrder = async (order) => {
  const { data } = await api.post("/orders", order);
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.patch(`/orders/${id}`, { status });
  return data;
};

export const deleteOrder = async (id) => {
  await api.delete(`/orders/${id}`);
  return id;
};
