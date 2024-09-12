"use client";
import React, { useEffect, useState } from "react";
import { sendPostRequest } from "../utils/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingScreen from "../components/loading";

interface Tip {
  title: string;
  tip: string;
}

export default function TipsPage() {
  const [data, setData] = useState<Tip[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
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
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error during the request: ", error);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await sendPostRequest(
          `http://localhost/tips_data.php`,
          {}
        );

        try {
          const parsedData: { status: boolean; data: Tip[] } =
            JSON.parse(response);
          if (parsedData.status === true) {
            setData(parsedData.data);
          }
        } catch (error) {
          console.error("Error parsing tips data: ", error);
        }
      } catch (error) {
        console.error("Error fetching tips", error);
      }
    };
    fetchTips();
  }, [!isLoading]);

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="mx-6 flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-row">
        <h1 className="text-3xl font-semibold text-[#384B65]">Conseils</h1>
      </div>
      <div className="flex flex-col justify-center">
        <table className="table-auto w-full border-collapse bg-white">
          <tbody>
            {data.map((item, index) => (
              <React.Fragment key={index}>
                <tr
                  onClick={() => toggleRow(index)}
                  className={`cursor-pointer ${expandedRow === index}`}
                >
                  <td className="flex border px-4 py-2 font-medium text-lg flex-row justify-between">
                    {item.title}
                    {expandedRow === index ? (
                      <ChevronUp></ChevronUp>
                    ) : (
                      <ChevronDown></ChevronDown>
                    )}
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    <td colSpan={2} className="border px-4 py-2 text-md">
                      {item.tip}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
