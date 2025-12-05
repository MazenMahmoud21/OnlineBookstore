import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/types';
import { ShoppingCart } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onAddToCart?: (isbn: string) => void;
  showAddToCart?: boolean;
}

export function BookCard({ book, onAddToCart, showAddToCart = true }: BookCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardContent className="flex-1 p-4">
        <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl">📚</span>
        </div>
        <Link href={`/books/${book.ISBN}`} className="hover:underline">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{book.Title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">
          {typeof book.Authors === 'string' ? book.Authors : book.Authors?.map(a => a.Name).join(', ') || 'Unknown Author'}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{book.CategoryName}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">${book.SellingPrice.toFixed(2)}</span>
          {book.QuantityInStock > 0 ? (
            <Badge variant="success">In Stock</Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      </CardContent>
      {showAddToCart && (
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={() => onAddToCart?.(book.ISBN)}
            disabled={book.QuantityInStock <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
