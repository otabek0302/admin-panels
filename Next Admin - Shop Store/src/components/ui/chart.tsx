'use client';

import * as React from 'react';
import { Area, AreaChart as RechartsAreaChart, Bar, BarChart as RechartsBarChart, CartesianGrid, Cell, Legend, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';

import { cn } from '@/lib/utils';

export type ChartConfig = Record<
  string,
  {
    label: string;
    color?: string;
  }
>;

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
<<<<<<< HEAD
  children: React.ReactElement;
}

export function ChartContainer({ children, className, ...props }: ChartContainerProps) {
=======
  children: React.ReactElement
}

export function ChartContainer({
  children,
  className,
  ...props
}: ChartContainerProps) {
>>>>>>> 11be6d1df1680202ca1702d2138f0632fe44f73c
  return (
    <div className={cn('relative', className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

<<<<<<< HEAD
interface ChartTooltipProps extends Omit<TooltipProps<number, string>, 'content'> {
  content?: React.ReactElement;
  cursor?: boolean;
=======
interface ChartTooltipProps {
  content?: React.ReactElement
  cursor?: boolean
>>>>>>> 11be6d1df1680202ca1702d2138f0632fe44f73c
}

export function ChartTooltip({ content, cursor = true, ...props }: ChartTooltipProps) {
  return <Tooltip cursor={cursor} content={content} wrapperStyle={{ outline: 'none' }} {...props} />;
}

<<<<<<< HEAD
interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  labelFormatter?: (value: string) => string;
  indicator?: 'dot' | 'line';
}

export function ChartTooltipContent({ ...props }: ChartTooltipContentProps) {
  return <div className="bg-popover text-popover-foreground rounded-lg border p-3 shadow-sm" {...props} />;
=======
export function ChartTooltipContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="bg-popover text-popover-foreground rounded-lg border p-3 shadow-sm"
      {...props}
    />
  )
>>>>>>> 11be6d1df1680202ca1702d2138f0632fe44f73c
}

export const AreaChart = RechartsAreaChart;
export const BarChart = RechartsBarChart;
export const LineChart = RechartsLineChart;
export const PieChart = RechartsPieChart;

export { Area, Bar, CartesianGrid, Cell, Legend, Line, Pie, XAxis, YAxis };
