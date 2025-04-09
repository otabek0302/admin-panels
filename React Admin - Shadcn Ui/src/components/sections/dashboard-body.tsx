import TotalRevenue from "../custom-ui/total-revenue";
import DashboardChart from "../custom-ui/dashboard-chart";

const DashboardBody = () => {
  return (
    <div className="flex gap-4">
      <div className="flex-1 max-w-[520px]">
        <TotalRevenue />
      </div>
      <div className="flex-1">
        <DashboardChart width="100%" height="100%" />
      </div>
    </div>
  );
};

export default DashboardBody;
