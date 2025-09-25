"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { Store } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, ShoppingCart, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { state, dispatch } = useContext(Store);
  const { cart, mode, userInfo } = state;

  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.clear();
    window.location.href = "/sign_in";
  };

  return (
    <header className="w-full">
      {/* TOP BAR */}
      <div className="w-full bg-[#131921] text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold tracking-wide whitespace-nowrap"
        >
          Ekezona
        </Link>

        {/* Middle: Search */}
        <div className="hidden sm:flex flex-1 items-center justify-center px-4 ">
          <form className="flex w-full max-w-2xl border border-yellow-400 bg-white overflow-hidden rounded-lg">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 rounded-l-full focus:outline-none text-black"
            />
            <Button
              type="submit"
              className="h-full py-3 bg-[#febd69] hover:bg-[#f3a847] text-black font-semibold px-6"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Right: Account + Cart */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <ThemeToggle
            mode={mode}
            onToggle={() => dispatch({ type: "SWITCH_MODE" })}
          />

          {/* User dropdown */}
          {userInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 text-white hover:bg-[#232f3e]"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Hello, {userInfo.name}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white text-black rounded-md shadow-lg w-48"
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/order_history">Order History</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signoutHandler}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/sign_in">
              <Button
                variant="ghost"
                className="hover:bg-[#232f3e] text-white font-semibold"
              >
                Sign In
              </Button>
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative flex items-center gap-1">
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            {cart.cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 rounded-full bg-[#f08804] text-black text-xs font-bold px-2 py-0.5">
                {cart.cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* SUB-HEADER */}
      <div className="w-full bg-[#232f3e] text-white px-4 sm:px-6 py-2 flex items-center gap-6 overflow-x-auto">
        <button className="flex items-center gap-1 font-medium hover:underline whitespace-nowrap">
          <Menu className="h-5 w-5" />
          All
        </button>
        <Link href="/" className="hover:underline whitespace-nowrap">
          Today&apos;s Deals
        </Link>
        <Link href="/" className="hover:underline whitespace-nowrap">
          Customer Service
        </Link>
        <Link href="/" className="hover:underline whitespace-nowrap">
          Registry
        </Link>
        <Link href="/" className="hover:underline whitespace-nowrap">
          Gift Cards
        </Link>
        <Link href="/" className="hover:underline whitespace-nowrap">
          Sell
        </Link>
      </div>

      {/* Mobile search bar (shown below top bar) */}
      <div className="sm:hidden bg-[#131921] px-4 pb-3">
        <form className="flex w-full border border-yellow-400 bg-white overflow-hidden rounded-lg">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 py-2 rounded-l-full focus:outline-none text-black"
          />
          <Button
            type="submit"
            className="h-full py-3 bg-[#febd69] hover:bg-[#f3a847] text-black font-semibold px-6"
          >
            Search
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Navbar;
