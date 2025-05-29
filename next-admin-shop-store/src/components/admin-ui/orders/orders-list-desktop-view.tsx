'use client';

import Image from 'next/image';
import SelectOrdersStatus from './select-orders-status';

import { Order, OrderItem } from '@/interfaces/order';
import { useOrdersStore } from '@/stores/orders.store';
import { OrderDesktopViewSkeleton } from './orders-skeleton';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow, format } from 'date-fns';
import { Clock, Calendar, Pencil, Trash, Printer } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const OrdersListDesktopView = ({ orders, loading }: { orders: Order[]; loading: boolean }) => {
  const { t } = useTranslation();
  const { setOpenDialog, setEditData, setDeleteData, setOpenDeleteDialog } = useOrdersStore();

  const router = useRouter();

  const handleEdit = (order: Order) => {
    setEditData(order);
    setOpenDialog(true);
  };

  const handleDelete = (order: Order) => {
    setDeleteData(order);
    setOpenDeleteDialog(true);
  };

  const handlePrint = (order: Order) => {
    router.push(`/admin/orders/${order.id}`);
  };

  return (
    <div className="hidden md:block">
      <Table className="h-full border-collapse overflow-hidden rounded-lg border-gray-200 dark:border-gray-700">
        <TableHeader className="sticky top-0 bg-background">
          <TableRow className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <TableHead className="px-2 text-sm font-bold text-gray-700 dark:text-gray-300 md:px-6">{t('components.admin-ui.orders.orders-list.table-header.id')}</TableHead>
            <TableHead className="px-2 text-sm font-bold text-gray-700 dark:text-gray-300 md:px-6">{t('components.admin-ui.orders.orders-list.table-header.total')}</TableHead>
            <TableHead className="px-2 text-sm font-bold text-gray-700 dark:text-gray-300 md:px-6">{t('components.admin-ui.orders.orders-list.table-header.status')}</TableHead>
            <TableHead className="px-2 text-sm font-bold text-gray-700 dark:text-gray-300 md:px-6">{t('components.admin-ui.orders.orders-list.table-header.items')}</TableHead>
            <TableHead className="px-2 text-sm font-bold text-gray-700 dark:text-gray-300 md:px-6">{t('components.admin-ui.orders.orders-list.table-header.created')}</TableHead>
            <TableHead className="flex items-center justify-center px-2 text-sm font-bold text-gray-700 dark:text-gray-300 md:px-6">{t('components.admin-ui.orders.orders-list.table-header.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-full">
          {loading && [1, 2, 3, 4, 5].map((_, index) => <OrderDesktopViewSkeleton key={index} />)}

          {!loading && orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                  <span className="text-lg font-semibold">{t('components.admin-ui.orders.orders-list.messages.no-orders')}</span>
                  <p className="mt-1 text-sm">{t('components.admin-ui.orders.orders-list.messages.try-adjusting-filters')}</p>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            orders.length > 0 &&
            orders.map((order) => (
              <TableRow key={order.id} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <TableCell className="px-2 text-sm font-normal text-muted-foreground md:px-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="font-mono">#{order.id?.slice(-6)}</span>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs font-medium text-white">
                        <p>Order ID: {order.id}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="px-2 text-sm font-normal text-muted-foreground md:px-6">
                  <div className="flex items-center gap-1">{formatCurrency(order.total)}</div>
                </TableCell>
                <TableCell className="px-2 text-sm font-normal text-muted-foreground md:px-6">
                  <SelectOrdersStatus order={order} />
                </TableCell>
                <TableCell className="px-2 text-sm font-normal text-muted-foreground md:px-6">
                  <div className="flex max-w-[120px] gap-2 overflow-y-auto">
                    {order?.orderItems?.map((item: OrderItem) => (
                      <TooltipProvider key={item.id}>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="group relative p-2">
                              <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                {item.product?.image?.url ? <Image src={item.product.image.url} alt={item.product?.name || 'N/A'} fill sizes="(max-width: 768px) 100vw" priority className="object-cover object-center" /> : <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">No Image</div>}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                  <span className="text-xs font-medium text-white">{item.quantity}×</span>
                                </div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex flex-col gap-1">
                              <p className="text-xs font-medium text-white">{item.product?.name || 'N/A'}</p>
                              <p className="text-xs text-white">
                                {item.quantity} × {item.price} - {order.discount} = {order.total}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-2 text-sm font-normal text-muted-foreground md:px-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {order.createdAt ? formatDistanceToNow(new Date(order.createdAt), { addSuffix: true }) : 'N/A'}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="flex flex-col gap-1">
                          <p className="flex items-center gap-1 text-xs font-medium text-white">
                            <Calendar className="h-4 w-4" />
                            {order.createdAt ? format(new Date(order.createdAt), 'PPpp') : 'N/A'}
                          </p>
                          <p className="text-xs text-white">Order ID: {order.id}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="flex items-center justify-center gap-2 px-2 text-sm font-normal text-muted-foreground md:px-6">
                  <Button variant="outline" size="icon" className="cursor-pointer shadow-none" onClick={() => handleEdit(order)}>
                    <Pencil className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <Button variant="outline" size="icon" className="cursor-pointer shadow-none" onClick={() => handleDelete(order)}>
                    <Trash className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <Button variant="outline" size="icon" className="cursor-pointer shadow-none" onClick={() => handlePrint(order)}>
                    <Printer className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersListDesktopView;
