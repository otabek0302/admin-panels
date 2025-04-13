"use client";
import DataPagination from "@/components/custom-ui/data-pagination";
import DataTable from "@/components/custom-ui/data-table";
import DataTableToolbar from "@/components/custom-ui/data-table-toolbar";

import { orders_data, orders_labels } from "@/data/data";
import { useState, useEffect } from "react";

const OrdersPage = () => {    
  const [filteredData, setFilteredData] = useState<object[]>([])
  
  useEffect(() => {
    setFilteredData(orders_data)
  }, [])
  
  return (
    <section className="p-4 space-y-4">
      <DataTableToolbar data={filteredData} setFilteredData={setFilteredData} statuses={["Shipped", "Delivered", "Processing", "Cancelled"]} search={["product", "customer"]} />
      <DataTable data={filteredData} labels={orders_labels} />
      <DataPagination data={filteredData} setFilteredData={setFilteredData} />
    </section>
  );
};

export default OrdersPage;