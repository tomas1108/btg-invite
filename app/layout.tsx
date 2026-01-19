import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Suspense } from "react";

const aptima = localFont({
  src: [
    // Regular (400)
    {
      path: "../public/fonts/UTMAptima.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/UTMAptimaItalic.ttf",
      weight: "400",
      style: "italic",
    },
    // Bold (700)
    {
      path: "../public/fonts/UTMAptimaBold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/UTMAptimaBold_Italic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-aptima",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Công ty TNHH công nghệ BTG",
  description: "Công ty TNHH công nghệ BTG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${aptima.variable} font-sans antialiased`}
      >
        <Suspense>
            {children}
        </Suspense>
      </body>
    </html>
  );
}
