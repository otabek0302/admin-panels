'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrdersStore } from '@/stores/orders.store';
import { Minus, Plus } from 'lucide-react';

interface CounterProps {
  productId: string;
  value: number;
  max: number;
  size?: 'sm' | 'default';
}

export default function Counter({ productId, value, max, size = 'default' }: CounterProps) {
  const { updateOrderItem, orderItems } = useOrdersStore();
  const itemIndex = orderItems.findIndex(item => item.productId === productId);

  const handleQuantityChange = (newValue: number) => {
    if (newValue <= 0) {
      // Remove item if quantity is 0 or less
      const items = orderItems.filter(item => item.productId !== productId);
      useOrdersStore.getState().setOrderItems(items);
    } else if (newValue <= max) {
      // Update quantity if within stock limits
      updateOrderItem(itemIndex, 'quantity', newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="outline"
        onClick={() => handleQuantityChange(value - 1)}
        className={`${size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'} cursor-pointer rounded-full`}
        aria-label="Decrease quantity"
      >
        <Minus className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
      </Button>
      <Input
        type="text"
        min="1"
        disabled={value >= max}
        max={max}
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value) || 1;
          handleQuantityChange(Math.min(newValue, max));
        }}
        className={`${size === 'sm' ? 'h-8 w-12' : 'h-10 w-16'} text-center`}
        aria-label="Item quantity"
      />
      <Button
        size="icon"
        variant="outline"
        onClick={() => handleQuantityChange(value + 1)}
        className={`${size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'} cursor-pointer rounded-full`}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
      </Button>
    </div>
  );
} 