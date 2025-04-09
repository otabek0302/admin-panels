import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DashboardCardProps {
  title: string;
  percentage: number;
  value: string;
  description: string;
}

const DashboardCard = ({ title, percentage, value, description }: DashboardCardProps) => {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">{value}</CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <TrendingUp className="size-3" />
            {percentage}%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending {percentage > 0 ? "up" : "down"} this month {percentage > 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
        </div>
        <div className="text-muted-foreground">{description}</div>
      </CardFooter>
    </Card>
  );
};

export default DashboardCard;
