import { EllipsisVertical } from "lucide-react";
import CircularProgressbar from "./circular-progressbar";

const TotalRevenue = () => {
  return (
    <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Total Revenue</span>
        <EllipsisVertical className="w-4 h-4" />
      </div>
      <div className="py-6 space-y-6">
        <div className="flex items-center justify-center">
          <CircularProgressbar value={75} size={350} strokeWidth={20} progressColor="#1B5FFE" textSize={58} />
        </div>
        <div className="space-y-2 flex flex-col items-center justify-center">
          <p className="py-4 text-4xl font-medium">$45,231.89</p>
          <p className="text-base text-muted-foreground">Total Revenue</p>
          <p className="text-base text-muted-foreground space-x-2">
            <span className="text-green-500">+20.1%</span>
            <span className="text-muted-foreground">vs last month</span>
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center">
            <p className="text-base font-medium">$45,231.89</p>
            <p className="text-sm text-muted-foreground">Target</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-base font-medium">$45,231.89</p>
            <p className="text-sm text-muted-foreground">Last Week</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-base font-medium">$45,231.89</p>
            <p className="text-sm text-muted-foreground">Last Month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalRevenue;
