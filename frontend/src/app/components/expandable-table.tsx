import React from "react";
import ExpandableRow from "./expandable-row";

interface ExpandableTableProps {
    data: { title: string; tip: string }[];
}

const ExpandableTable: React.FC<ExpandableTableProps> = ({ data }) => {
    return (
        <table style={{width : "100%" }}>
            <tbody>
                {data.map((item, index) => (
                    <ExpandableRow key={index} data={item} />
                ))}
            </tbody>
        </table>
    );
}

export default ExpandableTable;