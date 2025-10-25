import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";



export const metadata: Metadata = {
  title: "Soul Space",
  description: "Your personal sanctuary for mental wellness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className=""
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
