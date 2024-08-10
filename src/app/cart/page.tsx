"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";

const CartPage: React.FC = () => {
  const { items, removeItem, total } = useCart();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
        {items.length === 0 ? (
          <div
            className="bg-gray-100 border-l-4 border-purple-500 text-gray-700 p-4 mb-4"
            role="alert"
          >
            <p className="font-bold">Your cart is empty.</p>
            <p>Add some items to your cart and they will appear here.</p>
            <Link
              href="/"
              className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-200 p-4 hover:bg-gray-50 transition duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-gray-600">
                        ${Number(item.price).toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 transition duration-300"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-gray-800">
                  Total:
                </span>
                <span className="text-2xl font-bold text-purple-600">
                  ${Number(total).toFixed(2)}
                </span>
              </div>
              <Link
                href="/checkout"
                className="w-full block text-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
