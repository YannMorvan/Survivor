import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/theme-provider";
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Survivor App",
  description: "Coach app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          {/*<ThemeProvider>*/}
          <Navbar />
          {children}
          {/*</ThemeProvider>*/}
      </body>
    </html>
  );
}
