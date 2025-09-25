"use client";

import Navbar from "@/components/Navbar";
import { StoreProvider } from "@/store/cart-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <StoreProvider>
        <PayPalScriptProvider options={{ clientId: "sb" }}>
          {/* <PayPalButtons style={{ layout: "horizontal" }} /> */}
          <ToastContainer position="bottom-center" limit={1} />
          <Navbar />
          <div className="pt-20 px-5">{children}</div>
        </PayPalScriptProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}
