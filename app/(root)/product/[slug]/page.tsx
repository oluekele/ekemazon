"use client";

import Rating from "@/components/Rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetProductBySlug } from "@/hook/useProducts";
import { convertProductToCartItem } from "@/lib/utils";
import { Store } from "@/store/cart-store";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "react-toastify";

const ProductPage = () => {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const router = useRouter();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      toast.warn("Sorry, Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...convertProductToCartItem(product!), quantity },
    });
    toast.success("Product added to the cart");
    router.push("/cart");
  };

  const { data: product, isLoading, error } = useGetProductBySlug(slug);

  if (!slug) return <p>No slug provided</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Responsive grid: image | details | purchase card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left - Product Image */}
        <div className="md:col-span-2 flex justify-center items-start">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-xl object-contain shadow-md"
          />
        </div>

        {/* Middle - Product Info */}
        <div className="md:col-span-1">
          <ul className="space-y-4">
            <li>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
            </li>
            <li>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </li>
            <li className="text-lg font-medium">Price: ${product.price}</li>
            <li>
              <p className="dark:text-gray-400">{product.description}</p>
            </li>
          </ul>
        </div>

        {/* Right - Card with Price + Stock + Add to Cart */}
        <div className="md:col-span-1">
          <Card className="shadow-md rounded-2xl">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Price</span>
                <span className="text-lg font-semibold">${product.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                {product.countInStock > 0 ? (
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-red-500">
                    Unavailable
                  </Badge>
                )}
              </div>
              {product.countInStock > 0 && (
                <Button
                  onClick={addToCartHandler}
                  className="w-full cursor-pointer"
                >
                  Add to Cart
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
