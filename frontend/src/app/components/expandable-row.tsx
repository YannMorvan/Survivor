"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableRow {
  data: { title: string; content: string };
}

const ExpandableRow: React.FC<ExpandableRow> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, []);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        border: "1px solid gray",
        padding: "10px",
        margin: "10px 0",
        cursor: "pointer",
        width: "calc(100% - 40px)",
        marginLeft: "20px",
        marginRight: "20px",
        backgroundColor: isExpanded ? "#f0f0f0" : "#fff",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{data.title}</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {isExpanded && (
        <>
          <hr style={{ width: "100%", color: "black" }} />
          <div style={{ marginTop: "10px", color: "gray" }}>{data.content}</div>
        </>
      )}
    </div>
  );
};

export default ExpandableRow;
