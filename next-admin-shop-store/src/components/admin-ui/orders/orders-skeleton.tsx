import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

export const OrderDesktopViewSkeleton = () => (
  <TableRow>
    <TableCell className="px-6">
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell className="px-6">
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell className="px-6">
      <Skeleton className="h-6 w-24" />
    </TableCell>
    <TableCell className="px-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </TableCell>
    <TableCell className="px-6">
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell className="flex justify-center px-6">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>
    </TableCell>
  </TableRow>
);

export const OrderMobileViewSkeleton = () => (
    <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-9" />
      </div>
      <div className="mt-2 space-y-1 text-xs text-gray-500">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-24" />
      </div>
  </div>
);
