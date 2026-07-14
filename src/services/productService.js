import api from "./api";

export const getAllProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const createProduct = async (product) => {
  const { data } = await api.post("/products", product);
  return data;
};

export const updateProduct = async (id, updates) => {
  const { data } = await api.patch(`/products/${id}`, updates);
  return data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
  return id;
};
