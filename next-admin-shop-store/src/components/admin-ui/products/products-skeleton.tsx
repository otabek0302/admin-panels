import { Skeleton } from '@/components/ui/skeleton';

export const ProductsListSkeleton = () => {
  return (
    <div className="w-full space-y-4 overflow-hidden rounded-xl border p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-32 w-32 rounded-md" />
          <div className="flex flex-col justify-center space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="space-y-2 rounded-lg border border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <hr />
        <div className="flex items-center justify-between gap-10">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-2 w-24" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
    </div>
  );
};

export const ProductsListMobileViewSkeleton = () => {
  return (
    <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-9" />
      </div>
      <div className="mt-2 space-y-1 text-xs text-gray-500">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
};
