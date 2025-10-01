import type { Metadata } from "next";
import "./globals.css";

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
