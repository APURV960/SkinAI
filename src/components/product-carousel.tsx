"use client";

import { useMemo } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { products, type Product } from '@/lib/products';
import { ProductCard } from './product-card';

interface ProductCarouselProps {
  concerns: string[];
}

export function ProductCarousel({ concerns }: ProductCarouselProps) {
  const recommendedProducts = useMemo(() => {
    if (!concerns.length) {
      return products;
    }
    const lowerCaseConcerns = concerns.map(c => c.toLowerCase().replace(/\s+/g, '-'));
    
    const filtered = products.filter(product => 
      product.concerns.some(productConcern => 
        lowerCaseConcerns.includes(productConcern.toLowerCase().replace(/\s+/g, '-'))
      )
    );

    return filtered.length > 0 ? filtered : products.slice(0, 4);
  }, [concerns]);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Recommended Products</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {recommendedProducts.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
