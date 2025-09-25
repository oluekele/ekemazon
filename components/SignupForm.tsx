// app/(root)/sign_up/SignupForm.tsx
"use client";

import { useSignupMutation } from "@/hook/userHooks";
import { Store } from "@/store/cart-store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getError } from "@/lib/error";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push(redirect);
    }
  }, [router, redirect, userInfo]);

  const { mutateAsync: signup, isPending } = useSignupMutation();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const data = await signup({ email, password, name });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      router.push(redirect);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Card className="w-full max-w-md p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitHandler} className="space-y-4">
          <Input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing up..." : "Sign Up"}
          </Button>

          <div className="text-sm text-center mt-2">
            Already have an account?{" "}
            <Link href={"/sign_in"} className="text-blue-700 hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
