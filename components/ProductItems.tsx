import { Product } from "@/types/Product";
import Image from "next/image";
import Link from "next/link";
import Rating from "./Rating";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useContext } from "react";
import { Store } from "@/store/cart-store";
import { CartItem } from "@/types/Cart";
import { convertProductToCartItem } from "@/lib/utils";
import { toast } from "react-toastify";

const ProductItems = ({ product }: { product: Product }) => {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = (item: CartItem) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      toast.warn("Sorry, Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
    toast.success("Product added to the cart");
  };

  return (
    <Card className="flex flex-col justify-between shadow-md hover:shadow-lg w-full transition rounded-2xl">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="mt-[-25px]">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-58 object-cover rounded-t-2xl"
        />
      </Link>

      {/* Content */}
      <CardContent className="p-4 flex flex-col gap-2">
        <Link href={`/product/${product.slug}`}>
          <CardTitle className="text-lg font-semibold hover:text-blue-600 transition">
            {product.name}
          </CardTitle>
        </Link>

        <Rating rating={product.rating} numReviews={product.numReviews} />

        <span className="text-xl font-bold">${product.price}</span>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0 ">
        {product.countInStock === 0 ? (
          <Button
            variant="secondary"
            className="w-full bg-gray-300 dark:bg-gray-600"
            disabled
          >
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(convertProductToCartItem(product))}
            className="w-full bg-blue-700 text-white hover:bg-blue-500 cursor-pointer"
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductItems;
