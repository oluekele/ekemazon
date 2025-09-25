"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Store } from "@/store/cart-store";
import { CartItem } from "@/types/Cart";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { FaMinusCircle, FaPlusCircle, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const CartPage = () => {
  const router = useRouter();
  const {
    state: {
      mode,
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);

  const updateCartHandler = async (item: CartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warn("Sorry, Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item._id });
  };

  const checkoutHandler = () => {
    router.push("/shipping_address");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left side - Cart Items */}
        <div className="lg:col-span-3">
          {cartItems.length === 0 ? (
            <div className="p-4 border rounded-md text-center">
              Cart is empty.{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                Go Shopping
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item: CartItem) => (
                <li
                  key={item.slug}
                  className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4"
                >
                  {/* Product image + link */}
                  <div className="flex items-center gap-4 w-full sm:w-1/3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 w-full sm:w-1/3 justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateCartHandler(item, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      <FaMinusCircle />
                    </Button>
                    <span className="px-2">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateCartHandler(item, item.quantity + 1)}
                      disabled={item.quantity === item.countInStock}
                    >
                      <FaPlusCircle />
                    </Button>
                  </div>

                  {/* Price */}
                  <div className="w-full sm:w-1/6 text-center">
                    ${item.price}
                  </div>

                  {/* Remove */}
                  <div className="w-full sm:w-1/6 flex justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeItemHandler(item)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right side - Summary */}
        <div>
          <Card className="p-4 space-y-4">
            <h3 className="text-lg font-semibold">
              Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items):
              ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
            </h3>
            <Button
              className="w-full cursor-pointer"
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
