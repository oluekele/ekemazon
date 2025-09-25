"use client";

import CheckoutSteps from "@/components/CheckoutSteps";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import { useCreateOrderMutation } from "@/hook/orderHooks";
import { getError } from "@/lib/error";
import { Store } from "@/store/cart-store";
import { ApiError } from "next/dist/server/api-utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProtectedRoute from "@/components/ProtectedRoute";

const PlaceOrderPage = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100;

  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const { mutateAsync: createOrder, isPending } = useCreateOrderMutation();

  const placeOrderHandler = async () => {
    try {
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      });
      dispatch({ type: "CART_CLEAR" });
      localStorage.removeItem("cartItem");
      router.push(`/order/${data.order._id}`);
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      router.push("/payment_method");
    }
  }, [cart, router]);
  return (
    <ProtectedRoute>
      <div className="p-4 space-y-6">
        <CheckoutSteps step1 step2 step3 step4 />
        <h1 className="text-2xl font-bold">Preview Order</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="md:col-span-2 space-y-4">
            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Name:</strong> {cart.shippingAddress.fullName}
                </p>
                <p>
                  <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                  {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
                  , {cart.shippingAddress.country}
                </p>
                <Link
                  href="/shipping_address"
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Method:</strong> {cart.paymentMethod}
                </p>
                <Link
                  href="/payment_method"
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-4 border-b pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="rounded-md"
                        width={80}
                        height={80}
                      />
                      <Link
                        href={item.slug}
                        className="text-sm font-medium hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <span>{item.quantity}x</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <Link href="/cart" className="text-blue-600 hover:underline">
                  Edit
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Items</span>
                  <strong>${cart.itemsPrice.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <strong>${cart.shippingPrice.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <strong>${cart.taxPrice.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Order Total</span>
                  <strong>${cart.totalPrice.toFixed(2)}</strong>
                </div>
                <Separator />
                <Button
                  type="button"
                  onClick={placeOrderHandler}
                  disabled={cart.cartItems.length === 0 || isPending}
                  className="w-full"
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PlaceOrderPage;
