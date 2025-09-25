import { CartItem, ShippingAddress } from "./Cart";
import { User } from "./User";

// export type Order = {
//   _id: string;
//   orderItems: CartItem[];
//   shiippingAddress: ShippingAddress;
//   paymentmethod: string;
//   user: User;
//   createAt: string;
//   isPaid: boolean;
//   paidAt: string;
//   deliveryAt: string;
//   isDelivered: boolean;
//   itemsPrice: number;
//   shippingPrice: number;
//   taxPrice: number;
//   totalPrice: number;
// };

export type Order = {
  _id: string;
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  user: User;
  createdAt: string;
  isPaid: boolean;
  paidAt?: string;
  deliveredAt?: string;
  isDelivered: boolean;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
};
