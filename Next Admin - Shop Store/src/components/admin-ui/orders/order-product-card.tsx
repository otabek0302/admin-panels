
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/utils/getImageUrl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product } from "@/interfaces/products";

export const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => (
  <Card className="p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20 active:scale-[0.98]" onClick={onClick}>
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-muted">
        <Image src={getImageUrl(product.image)} alt={product.name} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base truncate">{product.name}</p>
        <p className="text-sm text-muted-foreground mt-1">{product.price.toFixed(2).toLocaleString()}</p>
      </div>
      <Button size="icon" variant="ghost" className="group rounded-full cursor-pointer hover:bg-primary/20">
        <Plus className="w-5 h-5 group-hover:text-primary" />
      </Button>
    </div>
  </Card>
);
