import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";

// ✅ Local Inter font
// const inter = localFont({
//   src: [
//     {
//       path: "../public/fonts/Inter/Inter-Regular.woff2",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/Inter/Inter-Medium.woff2",
//       weight: "500",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/Inter/Inter-SemiBold.woff2",
//       weight: "600",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/Inter/Inter-Bold.woff2",
//       weight: "700",
//       style: "normal",
//     },
//   ],
//   variable: "--font-inter",
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "Eke e-commerce",
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
