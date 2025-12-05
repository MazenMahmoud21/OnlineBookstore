import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/types';
import { ShoppingCart, BookOpen, Star, CheckCircle, XCircle, Sparkles, Eye } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onAddToCart?: (isbn: string) => void;
  showAddToCart?: boolean;
}

export function BookCard({ book, onAddToCart, showAddToCart = true }: BookCardProps) {
  return (
    <Card className="h-full flex flex-col hover-lift border-none shadow-xl overflow-hidden group relative bg-white">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-[100%] opacity-60"></div>
      
      <CardContent className="flex-1 p-5 relative">
        {/* Book cover placeholder with enhanced design */}
        <div className="aspect-[3/4] bg-gradient-to-br from-indigo-50 via-slate-50 to-orange-50 rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden shadow-inner group-hover:shadow-lg transition-all duration-500">
          {/* Decorative patterns */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-indigo-300 rounded-lg rotate-12"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-orange-400 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-indigo-200 rounded-full opacity-50"></div>
          </div>
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 via-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          {/* Book icon */}
          <div className="relative z-10 flex flex-col items-center">
            <BookOpen className="h-16 w-16 text-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-500" />
            <Sparkles className="h-5 w-5 text-orange-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
          
          {/* Quick view button - visible on hover but accessible via focus */}
          <Link 
            href={`/books/${book.ISBN}`}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100 transition-all duration-500"
            aria-label={`عرض تفاصيل كتاب ${book.Title}`}
          >
            <span className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-white hover:shadow-xl transition-all">
              <Eye className="h-4 w-4" />
              عرض التفاصيل
            </span>
          </Link>
          
          {/* Stock badge */}
          <div className="absolute top-3 left-3">
            {book.QuantityInStock > 0 ? (
              <Badge className="bg-indigo-600 text-white shadow-md border-0 px-3 py-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                متوفر
              </Badge>
            ) : (
              <Badge variant="destructive" className="shadow-md border-0 px-3 py-1">
                <XCircle className="h-3 w-3 mr-1" />
                غير متوفر
              </Badge>
            )}
          </div>
        </div>
        
        {/* Book info */}
        <Link href={`/books/${book.ISBN}`} className="block group/title">
          <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-800 group-hover/title:text-indigo-700 transition-colors duration-300">{book.Title}</h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-3 text-gray-600">
          <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
          <span className="text-sm font-medium line-clamp-1">
            {typeof book.Authors === 'string' ? book.Authors : book.Authors?.map(a => a.Name).join(', ') || 'مؤلف غير معروف'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 border-0 font-medium">
            {book.CategoryName}
          </Badge>
        </div>
        
        {/* Price with enhanced styling */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">السعر</span>
            <span className="text-2xl font-bold text-gradient">{book.SellingPrice.toFixed(2)} <span className="text-base">ر.س</span></span>
          </div>
        </div>
      </CardContent>
      
      {showAddToCart && (
        <CardFooter className="p-5 pt-0">
          <Button
            className="w-full h-12 text-base shadow-lg hover:shadow-xl"
            onClick={() => onAddToCart?.(book.ISBN)}
            disabled={book.QuantityInStock <= 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            أضف للسلة
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
