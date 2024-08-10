"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { getProducts, getAllOrders } from "@/utils/api";
import { Product, Order } from "@/types";

import Link from "next/link";

const AdminDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          getProducts(),
          getAllOrders(),
        ]);
        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user && user.is_admin) {
      fetchData();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!user.is_admin) {
    router.push("/");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <p className="mb-4">Total Products: {products.length}</p>
            <Link
              href="/admin/products"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Manage Products
            </Link>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <p className="mb-4">Total Orders: {orders.length}</p>
            <Link
              href="/admin/orders"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Manage Orders
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
