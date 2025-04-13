"use client";

import DataPagination from "@/components/custom-ui/data-pagination";
import DataTableToolbar from "@/components/custom-ui/data-table-toolbar";
import DataTable from "@/components/custom-ui/data-table";

import { users_data, users_labels } from "@/data/data";
import { useEffect, useState } from "react";
import { User } from "@/interfaces/interfaces";

const UsersPage = () => {
  const [filteredData, setFilteredData] = useState<object[]>([]);

  useEffect(() => {
    setFilteredData(users_data);
  }, []);

  return (
    <section className="p-4 space-y-4">
      <DataTableToolbar data={filteredData} setFilteredData={setFilteredData} statuses={["ACTIVE", "INACTIVE"]} search={["firstName", "lastName", "email"]}/>
      <DataTable data={filteredData as User[]} labels={users_labels} />
      <DataPagination data={filteredData} setFilteredData={setFilteredData} />
    </section>
  );
};

export default UsersPage;
