import axios from "axios";
import { Product } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
});

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products");
  return response.data.map((product: any) => ({
    ...product,
    price: Number(product.price),
  }));
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

// Add this interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getUserOrders = async () => {
  const response = await api.get("/orders/user");
  return response.data;
};

// admin
export const getAllOrders = async () => {
  const response = await api.get("/admin/orders");
  return response.data;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await api.put(`/admin/orders/${orderId}/status`, { status });
  return response.data;
};

export const createProduct = async (productData: any) => {
  const response = await api.post("/admin/products", productData);
  return response.data;
};

export const updateProduct = async (productId: number, productData: any) => {
  const response = await api.put(`/admin/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId: number) => {
  await api.delete(`/admin/products/${productId}`);
};

export const getAllUsers = async (
  page: number,
  limit: number,
  search?: string
) => {
  const response = await api.get(`/admin/users`, {
    params: { page, limit, search },
  });
  return response.data;
};

export const updateUserAdminStatus = async (
  userId: number,
  isAdmin: boolean
) => {
  const response = await api.put(`/admin/users/${userId}/admin`, { isAdmin });
  return response.data;
};

// Add more API calls as needed
