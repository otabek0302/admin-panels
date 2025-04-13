"use client";

import DataPagination from "@/components/custom-ui/data-pagination";
import DataTableToolbar from "@/components/custom-ui/data-table-toolbar";
import DataTable from "@/components/custom-ui/data-table";

import { activity_data, activity_labels } from "@/data/data";
import { useEffect, useState } from "react";

const ActivityPage = () => {
  const [filteredData, setFilteredData] = useState<object[]>([]);

  useEffect(() => {
    const processedData = activity_data.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { icon, ...rest } = item;
      return rest;
    });

    setFilteredData(processedData);
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <DataTableToolbar data={filteredData} setFilteredData={setFilteredData} search={["title", "description", "time"]} />
      <DataTable data={filteredData} labels={activity_labels.filter((label) => label.value !== "icon")} />
      <DataPagination data={filteredData} setFilteredData={setFilteredData} />
    </div>
  );
};

export default ActivityPage;
