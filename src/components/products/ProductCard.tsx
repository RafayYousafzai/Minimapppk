import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/ui/StarRating';
import AddToCartButton from '@/components/shared/AddToCartButton';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} passHref>
          <AspectRatio ratio={1 / 1}>
            <Image
              src={product.images[0]}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              data-ai-hint={`${product.category} product`}
            />
          </AspectRatio>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} passHref>
          <CardTitle className="text-lg font-semibold hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 h-10 overflow-hidden">
          {product.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
          {product.rating > 0 && (
             <div className="flex items-center gap-1">
                <StarRating rating={product.rating} size={16} />
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <AddToCartButton product={product} quantity={1} variant="outline" className="w-full">
          Add to Cart
        </AddToCartButton>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
