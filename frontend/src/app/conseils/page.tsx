"use client";
import React, { useEffect, useState } from "react";
import ExpandableTable from "../components/expandable-table";
import { sendPostRequest } from "../utils/utils";

interface Tip {
  title: string;
  tip: string;
}

export default function TipsPage() {
  const [data, setData] = useState<Tip[]>([]);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await sendPostRequest(
          `http://${process.env.NEXT_PUBLIC_PHP_HOST}/tips_data.php`,
          {}
        );

        try {
          const parsedData: { status: boolean; data: Tip[]} = JSON.parse(response);
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
  }, []);

  return (
    <div>
      <div>
        <h1
          style={{
            fontSize: "48px",
            color: "black",
            textAlign: "left",
            marginLeft: "2%",
          }}
        >
          Conseils pour coachs
        </h1>
      </div>
      <div>
        <ExpandableTable data={data} />
      </div>
    </div>
  );
}
