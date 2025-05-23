import React from "react";

export interface Label {
  label: string;
  value: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  status: string;
}

export interface DashboardData {
  trackingId: string;
  product: string;
  customer: string;
  date: string;
  amount: string;
  paymentMethod: string;
  status: string;
}

export interface Status {
  value: string;
  label: string;
}

export interface DataOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DataTableToolbarProps {
  data: object[];
  setFilteredData: (data: object[]) => void;
  statuses?: string[];
  priorities?: string[];
  search?: string[];
}

export interface DataPaginationProps {
  data: object[];
  setFilteredData: (data: object[]) => void;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  status: string;
  discount: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
}
