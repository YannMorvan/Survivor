"use client";
import React, { useEffect, useState } from "react";
import ExpandableTable from "../components/expandable-table";
import { sendPostRequest } from "../utils/utils";

interface Tip {
  title: string;
  content: string;
}

const initialData: Tip[] = [
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
];

export default function TipsPage() {
  const [data, setData] = useState<Tip[]>([]);

  useEffect(() => {
    setData(initialData);
  }, []);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await sendPostRequest(
          "http://localhost/tips_data.php",
          {}
        );

        try {
            console.log(response);
          const parsedData: Tip[] = JSON.parse(response);
          const shuffledData = parsedData.sort(() => Math.random() - 0.5);
          const selectedTips = shuffledData.slice(0, 5);
          setData(selectedTips);
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
