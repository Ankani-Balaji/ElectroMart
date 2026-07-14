import api from "./api";

export const getAllUsers = async () => {
  const { data } = await api.get("/users");
  return data.map(({ password, ...rest }) => rest);
};

export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
  return id;
};

export const getAllCategoriesAdmin = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const createCategory = async (category) => {
  const { data } = await api.post("/categories", category);
  return data;
};

export const updateCategory = async (id, updates) => {
  const { data } = await api.patch(`/categories/${id}`, updates);
  return data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/categories/${id}`);
  return id;
};
