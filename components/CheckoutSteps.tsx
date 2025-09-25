"use client";

import React from "react";
import { cn } from "@/lib/utils";

const CheckoutSteps = (props: {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}) => {
  const steps = [
    { label: "Sign-in", active: props.step1 },
    { label: "Shipping", active: props.step2 },
    { label: "Payment", active: props.step3 },
    { label: "Place Order", active: props.step4 },
  ];

  return (
    <div className="grid grid-cols-4 text-center text-sm font-medium">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className={cn(
            "border-b-2 py-2 transition-colors",
            step.active
              ? "border-orange-500 text-orange-500"
              : "border-gray-300 text-gray-400"
          )}
        >
          {step.label}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
