"use client";

import { Inter } from "next/font/google";
import Navbar from "./components/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendPostRequest } from "./utils/utils";
import { usePathname } from "next/navigation";
import path from "path";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendPostRequest(
          "http://localhost/check_session.php",
          {}
        );

        const data = JSON.parse(response);

        if (data.status === true) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error during the request: ", error);
      }
    };

    fetchData();
  }, [router]);

  return (
    <body className="font-inter bg-[#F3F6FB] text-[#384B65]">
      {!isLoading && <Navbar />}
      {children}
    </body>
  );
}
