"use client";
import DataPagination from "@/components/custom-ui/data-pagination";
import DataTable from "@/components/custom-ui/data-table";
import DataTableToolbar from "@/components/custom-ui/data-table-toolbar";

import { products_data, products_labels } from "@/data/data";
import { useState, useEffect } from "react";
import { Product } from "@/interfaces/interfaces";

const ProductsPage = () => {
  const [filteredData, setFilteredData] = useState<object[]>([])
  
  useEffect(() => {
    setFilteredData(products_data)
  }, [])
  
  return (
    <section className="p-4 space-y-4">
      <DataTableToolbar data={filteredData} setFilteredData={setFilteredData} statuses={["IN STOCK", "OUT OF STOCK"]} search={["name"]} />
      <DataTable data={filteredData as Product[]} labels={products_labels} />
      <DataPagination data={filteredData} setFilteredData={setFilteredData} />
    </section>
  );
};

export default ProductsPage;
