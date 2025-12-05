import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "مكتبة المملكة | Online Bookstore",
  description: "مكتبة المملكة الرقمية - اكتشف عالمًا من المعرفة والإلهام",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased min-h-screen font-arabic">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
