"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "@/hook/orderHooks";
import { getError } from "@/lib/error";
import { Store } from "@/store/cart-store";
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";

const OrderPage = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data: order,
    isPending,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId!);

  const { mutateAsync: payOrder, isPending: loadingPay } =
    usePayOrderMutation();

  // const testPayHandler = async () => {
  //   await payOrder({ orderId: order!._id });
  //   refetch();
  //   toast.success("Order is paid");
  // };

  const testPayHandler = async () => {
    if (!order) {
      toast.error("No order found to pay");
      return;
    }

    try {
      // Simulate a payment result
      const fakePaymentResult = {
        id: "TEST_PAYMENT_ID_12345",
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        email_address: userInfo?.email || "test@example.com",
      };

      await payOrder({
        orderId: order._id,
        ...fakePaymentResult,
      });

      refetch();
      toast.success("Order marked as paid (test)");
    } catch (err) {
      toast.error(getError(err as Error));
    }
  };

  const [{ isInitial, isRejected }, paypalDispatch] = usePayPalScriptReducer();

  const { data: paypalConfig } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (paypalConfig && paypalConfig.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId: paypalConfig.clientId || "sb",
            currency: "USD",
          },
        });

        paypalDispatch({
          type: "setLoadingStatus",
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };

      loadPaypalScript();
    }
  }, [paypalConfig, paypalDispatch]);

  const paypalButtonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: "vertical" },
    createOrder(data, actions) {
      return actions.order
        .create({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: order!.totalPrice.toString(),
              },
            },
          ],
        })
        .then((orderID) => orderID);
    },

    onApprove(data, actions) {
      return actions.order!.capture().then(async (details) => {
        try {
          await payOrder({ orderId: orderId!, ...details });
          refetch();
          toast.success("Order is paid sucessfully");
        } catch (err) {
          toast.error(getError(err as Error));
        }
      });
    },
    onError(err) {
      toast.error(getError(err));
    },
  };
  return (
    <div>
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : error ? (
        <div className="text-red-500">{getError(error as Error)}</div>
      ) : !order ? (
        <div className="text-red-500">No order found</div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Order {order._id}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEFT SIDE */}
            <div className="md:col-span-2 space-y-4">
              {/* Shipping */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Name:</strong> {order.shippingAddress.fullName}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </p>
                  {order.isDelivered ? (
                    <div className="text-green-500">
                      Delivered at {order.deliveredAt}
                    </div>
                  ) : (
                    <div className="text-yellow-500">Not Delivered</div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <strong>Method:</strong> {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <div className="text-green-500">Paid at {order.paidAt}</div>
                  ) : (
                    <div className="text-yellow-500">Not Paid</div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between gap-4 border-b pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="rounded-md"
                          width={80}
                          height={80}
                        />
                        <Link
                          href={item.slug}
                          className="text-sm font-medium hover:underline"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <span>{item.quantity}x</span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            {/* RIGHT SIDE */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Items</span>
                    <strong>${order.itemsPrice.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <strong>${order.shippingPrice.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <strong>${order.taxPrice.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Total</span>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>

                  <div className="w-full">
                    {!order.isPaid && (
                      <div>
                        {isPending ? (
                          <Button className="w-full btn-primary btn-disabled">
                            <Loader2 className="animate-spin mr-2"></Loader2>
                            Loading ...
                          </Button>
                        ) : isRejected ? (
                          <div className="text-red-500">
                            Failed to load PayPal script
                          </div>
                        ) : (
                          <div className="w-full">
                            <PayPalButtons
                              {...paypalButtonTransactionProps}
                              className="w-full"
                            />
                            {/* <Button
                              className="btn bg-blue-500 text-white w-24"
                              onClick={testPayHandler}
                              disabled={loadingPay}
                            >
                              Test Pay
                            </Button> */}
                            <Button
                              className="btn bg-blue-500 text-white w-24"
                              onClick={testPayHandler}
                              disabled={loadingPay || order?.isPaid}
                            >
                              Test Pay
                            </Button>
                          </div>
                        )}
                        {loadingPay && (
                          <Loader2 className="animate-spin ml-2" />
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
