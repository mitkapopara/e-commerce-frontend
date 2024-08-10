"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { getProductById } from "@/utils/api";
import { Product } from "@/types";

// Function to ensure the image src is valid
const getImageSrc = (src: string) => {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  // If it's a relative path, ensure it starts with a slash
  return src.startsWith("/") ? src : `/${src}`;
};

const ProductPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await getProductById(parseInt(id));
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({ ...product, quantity });
      toast.success(
        `Added ${quantity} ${quantity > 1 ? "items" : "item"} to cart`
      );
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">Loading...</div>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">{error}</div>
      </Layout>
    );
  if (!product)
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">Product not found</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image
              src={getImageSrc(product.image)}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl font-semibold mb-4">
              ${Number(product.price).toFixed(2)}
            </p>

            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-2">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border rounded px-2 py-1 w-16"
              />
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
