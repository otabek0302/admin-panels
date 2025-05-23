"use client";

import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface DashboardChartProps {
  data?: ChartData[];
  width?: number | string;
  height?: number | string;
}

const defaultData: ChartData[] = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 700 },
  { name: "Jul", value: 900 },
  { name: "Aug", value: 1000 },
  { name: "Sep", value: 1100 },
  { name: "Oct", value: 1200 },
  { name: "Nov", value: 1300 },
  { name: "Dec", value: 1400 },
];

const DashboardChart = ({ data = defaultData, width = "100%", height = "100%" }: DashboardChartProps) => {
  return (
    <div className="h-full p-6 border rounded-xl bg-card text-card-foreground shadow-sm">
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="value" stroke="#1B5FFE" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" tick={{ fill: "#666" }} />
          <YAxis tick={{ fill: "#666" }} />
          <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #ccc", borderRadius: "4px" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
