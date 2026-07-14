import api from "./api";

// Users log in against /users, admins against /admins.
// JSON Server has no real auth, so we query by email then verify the password client-side.
// This is intentionally simple: it is a temporary backend for development only.

const findByEmail = async (resource, email) => {
  const { data } = await api.get(`/${resource}`, { params: { email } });
  return data[0] || null;
};

export const loginUser = async (email, password) => {
  const account = await findByEmail("users", email);
  if (!account) throw new Error("No account found with this email.");
  if (account.password !== password) throw new Error("Incorrect password.");
  const { password: _pw, ...safeAccount } = account;
  return { ...safeAccount, role: "user" };
};

export const registerUser = async ({ name, email, password, phone }) => {
  const existing = await findByEmail("users", email);
  if (existing) throw new Error("An account with this email already exists.");
  const payload = {
    name,
    email,
    password,
    phone,
    role: "user",
    addresses: [],
    createdAt: new Date().toISOString(),
  };
  const { data } = await api.post("/users", payload);
  const { password: _pw, ...safeAccount } = data;
  return { ...safeAccount, role: "user" };
};

export const loginAdmin = async (email, password) => {
  const account = await findByEmail("admins", email);
  if (!account) throw new Error("No admin account found with this email.");
  if (account.password !== password) throw new Error("Incorrect password.");
  const { password: _pw, ...safeAccount } = account;
  return { ...safeAccount, role: "admin" };
};

export const registerAdmin = async ({ name, email, password }) => {
  const existing = await findByEmail("admins", email);
  if (existing) throw new Error("An admin account with this email already exists.");
  const payload = {
    name,
    email,
    password,
    role: "admin",
  };
  const { data } = await api.post("/admins", payload);
  const { password: _pw, ...safeAccount } = data;
  return { ...safeAccount, role: "admin" };
};

export const updateUserProfile = async (userId, updates) => {
  const { data } = await api.patch(`/users/${userId}`, updates);
  const { password: _pw, ...safeAccount } = data;
  return safeAccount;
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  const { data: account } = await api.get(`/users/${userId}`);
  if (account.password !== currentPassword) throw new Error("Current password is incorrect.");
  await api.patch(`/users/${userId}`, { password: newPassword });
  return true;
};

export const changeAdminPassword = async (adminId, currentPassword, newPassword) => {
  const { data: account } = await api.get(`/admins/${adminId}`);
  if (account.password !== currentPassword) throw new Error("Current password is incorrect.");
  await api.patch(`/admins/${adminId}`, { password: newPassword });
  return true;
};
