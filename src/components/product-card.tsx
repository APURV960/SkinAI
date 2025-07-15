"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { useSavedProducts } from "@/hooks/use-saved-products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { isSaved, toggleSave } = useSavedProducts();
  const saved = isSaved(product.id);

  return (
    <Card className={cn("flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg", className)}>
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className="object-cover" 
            data-ai-hint={product.aiHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="mt-2 text-sm">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <p className="font-bold text-lg text-primary">{product.price}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleSave(product.id, product.name)}
          aria-label={saved ? "Unsave product" : "Save product"}
        >
          <Heart className={cn("w-6 h-6 transition-colors", saved ? "fill-primary text-primary" : "text-muted-foreground")} />
        </Button>
      </CardFooter>
    </Card>
  );
}
