// src/types/paypal.d.ts
import "@paypal/react-paypal-js";
import type {
  ReactPayPalScriptOptions,
  SCRIPT_LOADING_STATE,
} from "@paypal/react-paypal-js";

declare module "@paypal/react-paypal-js" {
  export type CustomDispatchAction =
    | { type: "resetOptions"; value: ReactPayPalScriptOptions }
    | { type: "setLoadingStatus"; value: SCRIPT_LOADING_STATE };

  // override the dispatch type
  export function usePayPalScriptReducer(): [
    { isInitial: boolean; isRejected: boolean },
    (action: CustomDispatchAction) => void
  ];
}
