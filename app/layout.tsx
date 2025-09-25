import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./global.css";
// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"], // choose what you need
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "Ekemazon",
  description: "Next.js e-commerce app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
