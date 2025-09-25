"use client";

import CheckoutSteps from "@/components/CheckoutSteps";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Store } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const PaymentMethodPage = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || "PayPal"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shpping_address");
    }
  }, [router, shippingAddress]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "SAVE_PAYMENT_METHOD",
      payload: paymentMethodName,
    });
    localStorage.setItem("paymentMethod", paymentMethodName);
    router.push("/place_order");
  };
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-md space-y-6 p-4">
        <CheckoutSteps step1 step2 step3 />
        <div className="container small-container">
          <h1 className="my-3">Payment Method</h1>
          <form onSubmit={submitHandler} className="space-y-4">
            <RadioGroup
              value={paymentMethodName}
              onValueChange={(value) => setPaymentMethodName(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="paypal" value="PayPal" />
                <Label htmlFor="paypal">PayPal</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem id="stripe" value="Stripe" />
                <Label htmlFor="stripe">Stripe</Label>
              </div>
            </RadioGroup>

            <Button type="submit" className="w-full cursor-pointer">
              Continue
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PaymentMethodPage;
