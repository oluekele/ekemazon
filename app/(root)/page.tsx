"use client";

import ProductItems from "@/components/ProductItems";
import { useProducts } from "@/hook/useProducts";

export default function Home() {
  const { data: products = [], isLoading, isError, error } = useProducts();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">{error.message}</p>;
  return (
    <div className="w-full flex flex-col container mx-auto gap-10 items-center py-10">
      <h1 className="text-4xl ">Eke e-commerce</h1>
      <ul className="w-full gap-10 lg:grid-cols-3  md:grid-cols-2 grid grid-cols-1 ">
        {products.map((product, index) => {
          return (
            <li
              key={index}
              className="w-full flex flex-col items-center mx-auto"
            >
              <ProductItems product={product} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
