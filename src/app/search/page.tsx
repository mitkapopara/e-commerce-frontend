"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/ProductGrid";

// This is a mock function. In a real app, you'd fetch data from an API.
const searchProducts = (query: string) => {
  // Simulating an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Product 1", price: 19.99, image: "/product1.jpg" },
        { id: 2, name: "Product 2", price: 29.99, image: "/product2.jpg" },
        // Add more mock products...
      ]);
    }, 500);
  });
};

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const results = await searchProducts(query);
      setProducts(results);
      setLoading(false);
    };

    fetchProducts();
  }, [query]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Search Results for "{query}"
        </h1>
        {loading ? <p>Loading...</p> : <ProductGrid products={products} />}
      </div>
    </Layout>
  );
};

export default SearchPage;
