import { useQuery } from "@tanstack/react-query";

import { Product } from "@/types/Product";
import { axiosInstance } from "@/lib/api";

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/products");
      return data;
    },
  });
};

export const useGetProductBySlug = (slug?: string) => {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/products/slug/${slug}`);
      console.log("get data: ", data);
      return data;
    },
    enabled: !!slug, // don’t fetch until slug exists
  });
};
