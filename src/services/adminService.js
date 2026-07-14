import api from "./api";

// Aggregates dashboard statistics from the individual json-server resources,
// since json-server has no native aggregation endpoints.
export const getDashboardStats = async () => {
  const [productsRes, ordersRes, usersRes, categoriesRes] = await Promise.all([
    api.get("/products"),
    api.get("/orders"),
    api.get("/users"),
    api.get("/categories"),
  ]);

  const products = productsRes.data;
  const orders = ordersRes.data;
  const users = usersRes.data;
  const categories = categoriesRes.data;

  const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  // Simple revenue-by-month breakdown for the chart.
  const revenueByMonth = {};
  orders.forEach((order) => {
    const month = new Date(order.createdAt).toLocaleString("en-US", { month: "short" });
    revenueByMonth[month] = (revenueByMonth[month] || 0) + order.totalAmount;
  });

  return {
    totals: {
      revenue,
      orders: orders.length,
      products: products.length,
      users: users.length,
      categories: categories.length,
    },
    recentOrders,
    revenueByMonth,
  };
};
