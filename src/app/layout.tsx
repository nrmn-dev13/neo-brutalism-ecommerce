import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neo Ecommerce",
  description:
    "A simple ecommerce app built with Next.js, Zustand, and shadcn/ui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="bottom-right"
          closeButton
          expand={false}
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
