export type Product = {
  _id?: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  brand: string;
  rating: number; // must match your data (rename from rate)
  price: number;
  countInStock: number;
  description: string;
  numReviews: number;
};
