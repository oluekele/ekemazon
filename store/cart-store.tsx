"use client";

import { Cart, CartItem, ShippingAddress } from "@/types/Cart";
import { UserInfo } from "@/types/UserInfo";
import React, { useEffect } from "react";

// ----------------------
// Types
// ----------------------
export type AppStore = {
  mode: "light" | "dark";
  cart: Cart;
  userInfo?: UserInfo | null;
};

type Action =
  | { type: "SWITCH_MODE" }
  | { type: "CART_ADD_ITEM"; payload: CartItem }
  | { type: "CART_REMOVE_ITEM"; payload: string }
  | { type: "CART_CLEAR" }
  | { type: "SAVE_SHIPPING_ADDRESS"; payload: ShippingAddress }
  | { type: "SAVE_PAYMENT_METHOD"; payload: string }
  | { type: "USER_SIGNIN"; payload: UserInfo }
  | { type: "USER_SIGNOUT" };

// ----------------------
// Initial state (SSR safe)
// ----------------------
const initialState: AppStore = {
  userInfo: null, // 🚀 Start null, hydrate later
  mode: "light",
  cart: {
    cartItems: [],
    shippingAddress: {
      fullName: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
    },
    paymentMethod: "PayPal",
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
};

// ----------------------
// Reducer
// ----------------------
export function reducer(state: AppStore, action: Action): AppStore {
  switch (action.type) {
    case "SWITCH_MODE": {
      const newMode = state.mode === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("mode", newMode);
        document.documentElement.classList.toggle("dark", newMode === "dark");
      }
      return { ...state, mode: newMode };
    }

    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find((x) => x._id === newItem._id);

      const cartItems = existItem
        ? state.cart.cartItems.map((x) =>
            x._id === existItem._id ? newItem : x
          )
        : [...state.cart.cartItems, newItem];

      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      }

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      }
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    // case "CART_CLEAR": {
    //   if (typeof window !== "undefined") {
    //     localStorage.removeItem("cartItems");
    //   }
    //   return { ...state, cart: { ...state.cart, cartItems: [] } };
    // }

    // case "SAVE_SHIPPING_ADDRESS": {
    //   if (typeof window !== "undefined") {
    //     localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
    //   }
    //   return {
    //     ...state,
    //     cart: { ...state.cart, shippingAddress: action.payload },
    //   };
    // }

    // case "SAVE_PAYMENT_METHOD": {
    //   if (typeof window !== "undefined") {
    //     localStorage.setItem("paymentMethod", action.payload);
    //   }
    //   return {
    //     ...state,
    //     cart: { ...state.cart, paymentMethod: action.payload },
    //   };
    // }

    case "USER_SIGNIN": {
      return { ...state, userInfo: action.payload };
    }
    case "CART_CLEAR": {
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }

    case "USER_SIGNOUT":
      return {
        mode:
          window.matchMedia &&
          window.matchMedia("(prefers-color-schem: dark)").matches
            ? "dark"
            : "light",
        cart: {
          cartItems: [],
          paymentMethod: "PayPal",
          shippingAddress: {
            fullName: "",
            address: "",
            postalCode: "",
            city: "",
            country: "",
          },
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      };

    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    default:
      return state;
  }
}

// ----------------------
// Context
// ----------------------
const defaultDispatch: React.Dispatch<Action> = () => undefined;

export const Store = React.createContext({
  state: initialState,
  dispatch: defaultDispatch,
});

// ----------------------
// Provider
// ----------------------
export function StoreProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // ✅ Hydrate state from localStorage after mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedUserInfo = localStorage.getItem("userInfo");
    const mode = (localStorage.getItem("mode") as "light" | "dark") || "light";
    const cartItems = localStorage.getItem("cartItems");
    const shippingAddress = localStorage.getItem("shippingAddress");
    const paymentMethod = localStorage.getItem("paymentMethod");

    if (savedUserInfo) {
      dispatch({
        type: "USER_SIGNIN",
        payload: JSON.parse(savedUserInfo),
      });
    }

    if (mode) {
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      }
      dispatch({ type: "SWITCH_MODE" });
    }

    if (cartItems) {
      JSON.parse(cartItems).forEach((item: CartItem) => {
        dispatch({ type: "CART_ADD_ITEM", payload: item });
      });
    }

    if (shippingAddress) {
      dispatch({
        type: "SAVE_SHIPPING_ADDRESS",
        payload: JSON.parse(shippingAddress),
      });
    }

    if (paymentMethod) {
      dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethod });
    }
  }, []);

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
}
