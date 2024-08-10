"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/utils/api";
import toast from "react-hot-toast";

const AdminProducts: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };

    if (user && user.is_admin) {
      fetchProducts();
    }
  }, [user]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = newProduct.image;
      if (imageFile) {
        // Upload image and get URL
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || "Image upload failed");
        }

        imageUrl = uploadResult.url;
      }

      const productToCreate = {
        ...newProduct,
        image: imageUrl, // Use the uploaded image URL
        price: Number(newProduct.price), // Ensure price is a number
      };

      const createdProduct = await createProduct(productToCreate);
      setProducts([...products, createdProduct]);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        image: "",
        category: "",
      });
      toast.success("Product created successfully");
    } catch (error) {
      toast.error(`Failed to create product: ${error.message}`);
    }
  };
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) {
      toast.error("No product selected for update");
      return;
    }
    try {
      const updatedProduct = await updateProduct(
        editingProduct.id,
        editingProduct
      );
      setProducts(
        products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setEditingProduct(null);
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter((p) => p.id !== productId));
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  if (loading || !user || !user.is_admin) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

        {/* Form for creating new product */}
        <form onSubmit={handleCreateProduct} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: parseFloat(e.target.value),
                })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="file"
              onChange={(e) =>
                setImageFile(e.target.files ? e.target.files[0] : null)
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              className="border p-2 rounded md:col-span-2"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Product
          </button>
        </form>

        {/* List of existing products */}
        <h2 className="text-2xl font-bold mb-4">Existing Products</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <h3 className="text-xl font-bold">{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
              <div className="mt-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form for editing product */}
        {editingProduct && (
          <form onSubmit={handleUpdateProduct} className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Name"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: parseFloat(e.target.value),
                  })
                }
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={editingProduct.image}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    image: e.target.value,
                  })
                }
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
                className="border p-2 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
                className="border p-2 rounded md:col-span-2"
                required
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
              >
                Update Product
              </button>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default AdminProducts;
