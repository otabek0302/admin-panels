'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, TooltipProps, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';

interface ChartData {
  date: string;
  revenue: number;
  orders: number;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  const { t } = useTranslation();
  
  if (active && payload && payload.length) {
    const revenue = payload.find((item) => item.dataKey === 'revenue')?.value ?? 0;
    const orders = payload.find((item) => item.dataKey === 'orders')?.value ?? 0;

    return (
      <div className="bg-background rounded-lg border p-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[0.70rem] uppercase">{t('components.dashboard.chart.revenue')}</span>
            <span className="text-muted-foreground font-bold">{formatCurrency(revenue)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[0.70rem] uppercase">{t('components.dashboard.chart.orders')}</span>
            <span className="text-muted-foreground font-bold">{orders}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ChartAreaInteractive() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = React.useState('30d');
  const [data, setData] = React.useState<ChartData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 767);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/dashboard?timeRange=${timeRange}`);
        const dashboardData = await response.json();
        setData(dashboardData.dailyStats || []);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (loading) return null;

  return (
    <Card className="@container/card w-full h-full">
      <CardHeader className="relative">
        <CardTitle>{t('components.dashboard.chart.title')}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">{t('components.dashboard.chart.description')}</span>
          <span className="@[540px]/card:hidden">{t('components.dashboard.chart.descriptionShort')}</span>
        </CardDescription>
        <div className="absolute top-4 right-4">
          <ToggleGroup type="single" value={timeRange} onValueChange={setTimeRange} variant="outline" className="hidden @[767px]/card:flex">
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              {t('components.dashboard.chart.timeRange.3months')}
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              {t('components.dashboard.chart.timeRange.30days')}
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              {t('components.dashboard.chart.timeRange.7days')}
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="flex w-40 @[767px]/card:hidden" aria-label="Select time range">
              <SelectValue placeholder={t('components.dashboard.chart.timeRange.3months')} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                {t('components.dashboard.chart.timeRange.3months')}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t('components.dashboard.chart.timeRange.30days')}
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                {t('components.dashboard.chart.timeRange.7days')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-auto h-[250px] w-full">
          <BarChart data={data} barGap={8}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8} 
              tickFormatter={(value) => formatCurrency(value)} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="revenue" 
              fill="hsl(var(--chart-1))" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40} 
            />
            <Bar 
              dataKey="orders" 
              fill="hsl(var(--chart-2))" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40} 
            />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
}
