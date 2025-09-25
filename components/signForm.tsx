// app/(root)/sign_in/SigninForm.tsx
"use client";

import { useSigninMutation } from "@/hook/userHooks";
import { Store } from "@/store/cart-store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getError } from "@/lib/error";
import Link from "next/link";

export default function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const { mutateAsync: signin, isPending } = useSigninMutation();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await signin({ email, password });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      router.push(redirect);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      router.push(redirect);
    }
  }, [router, redirect, userInfo]);

  return (
    <Card className="w-full max-w-md p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitHandler} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-sm text-center mt-2">
            New customer?{" "}
            <Link href={"/sign_up"} className="text-blue-700 hover:underline">
              Create your account
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
