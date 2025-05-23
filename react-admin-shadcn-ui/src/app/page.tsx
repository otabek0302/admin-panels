import DashboardBody from "@/components/sections/dashboard-body";
import DashboardBottom from "@/components/sections/dashboard-bottom";
import DashboardTop from "@/components/sections/dashboard-top";

export default function App() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <DashboardTop />
      <DashboardBody />
      <DashboardBottom />
    </div>
  );
}
