"use client";

import { Inter } from "next/font/google";
import Navbar from "./components/navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <body className="font-inter bg-[#F3F6FB] text-[#384B65]">
      {pathname !== "/" && <Navbar />}
      {children}
    </body>
  );
}
