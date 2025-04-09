import DashboardCard from "../custom-ui/dashboard-card";

const DashboardTop = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardCard title="Total Revenue" percentage={32} value="$1,250.00" description="Visitors for the last 6 months" />
      <DashboardCard title="New Customers" percentage={5} value="1.234" description="Visitors for the last 6 months" />
      <DashboardCard title="Active Accounts" percentage={4} value="50,800" description="Visitors for the last 6 months" />
      <DashboardCard title="Growth Rate" percentage={3} value="4,5" description="Visitors for the last 6 months" />
    </div>
  );
};

export default DashboardTop;
