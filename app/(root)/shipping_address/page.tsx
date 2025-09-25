"use client";

import CheckoutSteps from "@/components/CheckoutSteps";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const ShippingAddress = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!userInfo) {
      router.push("/sign_in");
    }
  }, [userInfo, router]);

  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    router.push("/payment_method");
  };
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-md space-y-6 p-4">
        {/* Checkout Steps */}
        <CheckoutSteps step1 step2 />

        <div>
          <h1 className="mb-4 text-2xl font-semibold">Shipping Address</h1>
          <form onSubmit={submitHandler} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />

            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ShippingAddress;
