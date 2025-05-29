import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrderStatus } from '@prisma/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'bg-yellow-500/10 text-yellow-600';
    case OrderStatus.PROCESSING:
      return 'bg-blue-500/10 text-blue-600';
    case OrderStatus.COMPLETED:
      return 'bg-green-500/10 text-green-600';
    case OrderStatus.CANCELLED:
      return 'bg-red-500/10 text-red-600';
    default:
      return 'bg-gray-500/10 text-gray-600';
  }
};

export const getStockStatus = (stock: number) => {
  if (stock <= 0) return { message: 'Out of Stock', variant: 'destructive' as const };
  if (stock <= 5) return { message: `Low Stock: ${stock}`, variant: 'secondary' as const };
  return { message: `In Stock: ${stock}`, variant: 'outline' as const };
};