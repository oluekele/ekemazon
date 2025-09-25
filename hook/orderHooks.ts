import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/api";
import { CartItem, ShippingAddress } from "../types/Cart";
import { Order } from "../types/Order";

export const useGetOrderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ["orders", id],
    queryFn: async () =>
      (await axiosInstance.get<Order>(`/api/orders/${id}`)).data,
  });

export const useGetPaypalClientIdQuery = () =>
  useQuery({
    queryKey: ["paypal", "clientId"],
    queryFn: async () =>
      (await axiosInstance.get<{ clientId: string }>(`/api/keys/paypal`)).data,
  });

export const usePayOrderMutation = () =>
  useMutation({
    mutationFn: async (details: { orderId: string }) =>
      (
        await axiosInstance.put<{ message: string; order: Order }>(
          `/api/orders/${details.orderId}/pay`,
          details
        )
      ).data,
  });

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: string;
      itemsPrice: number;
      shippingPrice: number;
      taxPrice: number;
      totalPrice: number;
    }) =>
      (
        await axiosInstance.post<{ message: string; order: Order }>(
          `/api/orders`,
          order
        )
      ).data,
  });

export const useOrderHistoryQuery = () =>
  useQuery({
    queryKey: ["orders-history"],
    queryFn: async () =>
      (await axiosInstance.get<Order[]>(`/api/orders/mine`)).data,
  });
