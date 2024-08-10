import React from "react";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/ProductGrid";

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to E-Shop</h1>
        <ProductGrid />
      </div>
    </Layout>
  );
};

export default HomePage;
