import Image from "next/image";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OrderItem } from "@/interfaces/orders";
import { getImageUrl } from "@/utils/getImageUrl";
import { Badge } from "@/components/ui/badge";

interface OrderItemCardProps {
  item: OrderItem;
  index: number;
  updateOrderItem: (index: number, field: keyof OrderItem, value: string | number) => void;
  removeOrderItem: (index: number) => void;
  availableStock: number;
}

export const OrderItemCard = memo(({ item, index, updateOrderItem, removeOrderItem, availableStock }: OrderItemCardProps) => {
  const handleQuantityChange = (value: number) => {
    if (value <= 0) {
      removeOrderItem(index);
    } else if (value <= availableStock) {
      updateOrderItem(index, "quantity", value);
    }
  };

  return (
    <Card className="p-4 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-muted">
          <Image 
            src={getImageUrl(item.product.image)} 
            alt={item.product.name} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">{item.product.name}</p>
          <p className="text-sm text-muted-foreground mt-1">₹{item.price.toFixed(2)}</p>
          <Badge variant="outline" className="mt-1">
            In Stock: {availableStock}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Button 
          size="icon" 
          variant="outline" 
          onClick={() => handleQuantityChange(item.quantity - 1)} 
          className="h-9 w-9 rounded-full"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Input 
          type="number" 
          min="1" 
          max={availableStock}
          value={item.quantity} 
          onChange={(e) => {
            const value = parseInt(e.target.value) || 1;
            handleQuantityChange(Math.min(value, availableStock));
          }} 
          className="w-16 text-center h-9" 
          aria-label="Item quantity"
        />
        <Button 
          size="icon" 
          variant="outline" 
          onClick={() => handleQuantityChange(item.quantity + 1)} 
          className="h-9 w-9 rounded-full"
          disabled={item.quantity >= availableStock}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="mt-3 text-right text-sm font-medium text-primary">
        Total: ₹{item.total.toFixed(2)}
      </div>
    </Card>
  );
});

OrderItemCard.displayName = "OrderItemCard";
