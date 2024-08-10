import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 sm:h-64">
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300 hover:opacity-75"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>
          <p className="text-xl font-bold text-blue-600">
            $
            {typeof product.price === "number"
              ? product.price.toFixed(2)
              : Number(product.price).toFixed(2)}
          </p>
          <div className="mt-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
