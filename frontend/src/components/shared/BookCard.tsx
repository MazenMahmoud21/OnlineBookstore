import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/types';
import { ShoppingCart, BookOpen, Star, CheckCircle, XCircle } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onAddToCart?: (isbn: string) => void;
  showAddToCart?: boolean;
}

export function BookCard({ book, onAddToCart, showAddToCart = true }: BookCardProps) {
  return (
    <Card className="h-full flex flex-col hover-lift border-none shadow-lg overflow-hidden group">
      <CardContent className="flex-1 p-5">
        <div className="aspect-[3/4] bg-gradient-to-br from-green-100 via-yellow-50 to-green-50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-yellow-600/10 group-hover:from-green-600/20 group-hover:to-yellow-600/20 transition-all duration-300"></div>
          <BookOpen className="h-20 w-20 text-green-700 relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <Link href={`/books/${book.ISBN}`} className="hover:underline">
          <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-800 group-hover:text-green-700 transition-colors">{book.Title}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="font-medium">
            {typeof book.Authors === 'string' ? book.Authors : book.Authors?.map(a => a.Name).join(', ') || 'مؤلف غير معروف'}
          </span>
        </p>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">{book.CategoryName}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">{book.SellingPrice.toFixed(2)} ر.س</span>
          {book.QuantityInStock > 0 ? (
            <Badge variant="success" className="bg-green-100 text-green-700 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              متوفر
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              غير متوفر
            </Badge>
          )}
        </div>
      </CardContent>
      {showAddToCart && (
        <CardFooter className="p-5 pt-0">
          <Button
            className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => onAddToCart?.(book.ISBN)}
            disabled={book.QuantityInStock <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            أضف للسلة
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
