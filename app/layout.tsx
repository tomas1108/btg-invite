import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Suspense } from "react";

// const aptima = localFont({
//   src: [
//     // Regular (400)
//     {
//       path: "../public/fonts/UTMAptima.ttf",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/UTMAptimaItalic.ttf",
//       weight: "400",
//       style: "italic",
//     },
//     // Bold (700)
//     {
//       path: "../public/fonts/UTMAptimaBold.ttf",
//       weight: "700",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/UTMAptimaBold_Italic.ttf",
//       weight: "700",
//       style: "italic",
//     },
//   ],
//   variable: "--font-aptima",
//   display: "swap",
// });

const mjKedanty = localFont({
  src: [
    {
      path: "../public/fonts/MJ Kedanty.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/MJ Kedanty-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-mj-kedanty",
});
export const metadata: Metadata = {
  title: "Công Ty TNHH BTG",
  description: "Công Ty TNHH BTG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${mjKedanty.variable} antialiased`}>
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
