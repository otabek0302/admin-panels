'use client';

import Image from 'next/image';
import Loading from './loading';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { PackageCheck, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartAreaInteractive } from '@/components/admin-ui/charts/chart-area-interactive';
import { useDashboardStore } from '@/stores/dashboard.store';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uz } from 'date-fns/locale';


export default function DashboardPage() {
  const { t } = useTranslation();

  const { data, isLoading, error, selectedMonth, selectedYear, fetchDashboardData, setSelectedMonth, setSelectedYear } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handlePreviousMonth = () => {
    const newMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const newYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const handleNextMonth = () => {
    const newMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
    const newYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const isAtCurrentMonth = () => {
    const now = new Date();
    return selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1;
  };

  if (isLoading) return <Loading />;
  if (!data?.data) return null;

  const dashboardData = data.data;
  const selectedDate = new Date(selectedYear, selectedMonth - 1);

  return (
    <section className="h-full space-y-4 p-4 xl:h-screen">
      <div className="mb-4 flex flex-col items-center justify-between md:flex-row">
        <h1 className="text-2xl font-bold">{t('components.dashboard.title')}</h1>
        <div className="mt-3 flex items-center gap-4 md:mt-0">
          <Button variant="outline" onClick={handlePreviousMonth} className="cursor-pointer shadow-none">
            {t('components.dashboard.previous-month')}
          </Button>
          <span className="text-center text-sm font-semibold md:text-base">{format(selectedDate, 'MMMM yyyy', { locale: uz })}</span>
          <Button variant="outline" onClick={handleNextMonth} disabled={isAtCurrentMonth()} className="cursor-pointer shadow-none">
            {t('components.dashboard.next-month')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {/* Orders Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {t('components.dashboard.card.orders')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold">{dashboardData.totalOrders}</p>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="default" className="w-full dark:text-white">
                {t('components.dashboard.content.completed-orders')}: {dashboardData.completedOrders}
              </Badge>
              <Badge variant="secondary" className="w-full dark:text-white">
                {t('components.dashboard.content.pending-orders')}: {dashboardData.pendingOrders}
              </Badge>
              <Badge variant="secondary" className="w-full dark:text-white">
                {t('components.dashboard.content.processing-orders')}: {dashboardData.processingOrders}
              </Badge>
              <Badge variant="destructive" className="w-full dark:text-white">
                {t('components.dashboard.content.cancelled-orders')}: {dashboardData.cancelledOrders}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('components.dashboard.card.revenue')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold">{formatCurrency(dashboardData.totalRevenue)}</p>
            <div className="flex flex-col gap-2">
              <Badge variant="outline">
                {t('components.dashboard.content.revenue-in-stock')}: {formatCurrency(dashboardData.totalRevenueOfProductsInStock)}
              </Badge>
              <Badge variant="outline">
                {t('components.dashboard.content.sold-products-gross-value')}: {formatCurrency(dashboardData.soldProductsGrossValue)}
              </Badge>
              <Badge variant="destructive">
                {t('components.dashboard.content.total-discount')}: {formatCurrency(dashboardData.totalDiscountGiven)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5" />
              {t('components.dashboard.card.products')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline" className="w-full dark:text-white">
                {t('components.dashboard.content.total-products')}: {dashboardData.totalProducts}
              </Badge>
              <Badge variant="outline" className="w-full dark:text-white">
                {t('components.dashboard.content.products-in-store')}: {dashboardData.productsInStore}
              </Badge>
              <Badge variant="outline" className="w-full dark:text-white">
                {t('components.dashboard.content.sold-products')}: {dashboardData.soldProducts}
              </Badge>
              <Badge variant="destructive" className="w-full dark:text-white">
                {t('components.dashboard.content.out-of-stock')}: {dashboardData.outOfStockProducts}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Out of Stock Products */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Chart Placeholder */}
        <div className="flex-1 h-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t('components.dashboard.chart.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-full items-center justify-center text-muted-foreground">{data && data.data.dailyStats.length > 0 ? <ChartAreaInteractive /> : <div className="flex h-full items-center justify-center text-muted-foreground">{t('components.dashboard.chart.placeholder')}</div>}</div>
            </CardContent>
          </Card>
        </div>

        {/* Out of Stock Products List */}
        <div className="flex-1 h-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                {t('components.dashboard.card.stock-status')}
                <Badge variant="destructive" className="ml-2">
                  {dashboardData.outOfStockProducts}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.outOfStockProductsList.length > 0 ? (
                <div className="space-y-1">
                  <div className="h-full space-y-2 overflow-y-auto">
                    {dashboardData.outOfStockProductsList.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <div className="relative h-10 w-10 overflow-hidden rounded border">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          </div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-sm text-muted-foreground">{p.category || t('components.dashboard.content.no-category')}</p>
                        </div>
                        <Badge variant="destructive">{formatCurrency(p.price)}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">{t('components.dashboard.content.no-out-of-stock')}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
