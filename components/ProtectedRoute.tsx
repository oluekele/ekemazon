"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store } from "@/store/cart-store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    state: { userInfo },
  } = useContext(Store);
  const router = useRouter();

  useEffect(() => {
    if (!userInfo) {
      router.push("/sign_in"); // redirect to login if not authenticated
    }
  }, [userInfo, router]);

  if (!userInfo) {
    return null; // you could also show a spinner while redirecting
  }

  return <>{children}</>;
}
