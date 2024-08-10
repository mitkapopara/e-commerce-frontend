"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUsers, updateUserAdminStatus } from "@/utils/api";
import AdminRoute from "@/components/AdminRoute";
import toast from "react-hot-toast";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(page, limit, search);
      setUsers(data.users);
      setTotal(data.total);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminStatusChange = async (userId: number, isAdmin: boolean) => {
    try {
      await updateUserAdminStatus(userId, isAdmin);
      toast.success(`User admin status updated`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user admin status");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <Layout>
      <AdminRoute>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">User Management</h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <table className="w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Admin</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id}>
                      <td className="border p-2">{user.id}</td>
                      <td className="border p-2">{user.name}</td>
                      <td className="border p-2">{user.email}</td>
                      <td className="border p-2">
                        {user.is_admin ? "Yes" : "No"}
                      </td>
                      <td className="border p-2">
                        <button
                          onClick={() =>
                            handleAdminStatusChange(user.id, !user.is_admin)
                          }
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          {user.is_admin ? "Remove Admin" : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <span>Total: {total}</span>
                </div>
                <div>
                  <button
                    onClick={() => setPage(page > 1 ? page - 1 : 1)}
                    disabled={page === 1}
                    className="bg-gray-300 px-3 py-1 rounded mr-2"
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {Math.ceil(total / limit)}
                  </span>
                  <button
                    onClick={() =>
                      setPage(page < Math.ceil(total / limit) ? page + 1 : page)
                    }
                    disabled={page === Math.ceil(total / limit)}
                    className="bg-gray-300 px-3 py-1 rounded ml-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </AdminRoute>
    </Layout>
  );
};

export default UserManagement;
