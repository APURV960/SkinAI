"use client";

import { useMemo } from "react";
import { useSavedProducts } from "@/hooks/use-saved-products";
import { products, type Product } from "@/lib/products";
import { ProductCard } from "./product-card";

export function SavedProducts() {
  const { savedProductIds } = useSavedProducts();

  const savedProducts = useMemo(() => {
    return products.filter((product) => savedProductIds.includes(product.id));
  }, [savedProductIds]);

  if (savedProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-12">
      <h2 className="text-2xl font-bold mb-4">Your Saved Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {savedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
