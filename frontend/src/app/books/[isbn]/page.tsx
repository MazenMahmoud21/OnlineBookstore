'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/AuthContext';
import { Book } from '@/types';
import { ShoppingCart, Loader2, ArrowLeft, Minus, Plus } from 'lucide-react';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isbn = params.isbn as string;
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { data: book, isLoading, error } = useQuery<Book>({
    queryKey: ['book', isbn],
    queryFn: async () => {
      const response = await api.get(`/books/${isbn}`);
      return response.data;
    },
  });

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'warning');
      router.push('/login');
      return;
    }
    if (user?.Role !== 'Customer') {
      showToast('Only customers can add items to cart', 'warning');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await api.post('/cart/items', { isbn, quantity });
      showToast('Item added to cart!', 'success');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'Failed to add to cart', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  if (error || !book) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Book not found</h1>
            <Button onClick={() => router.back()} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </>
    );
  }

  const authors = Array.isArray(book.Authors) 
    ? book.Authors.map(a => a.Name).join(', ')
    : book.Authors || 'Unknown Author';

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Book Image */}
          <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
            <span className="text-8xl">📚</span>
          </div>

          {/* Book Details */}
          <div>
            <Badge variant="secondary" className="mb-4">{book.CategoryName}</Badge>
            <h1 className="text-3xl font-bold mb-4">{book.Title}</h1>
            <p className="text-lg text-gray-600 mb-4">by {authors}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-blue-600">${book.SellingPrice.toFixed(2)}</span>
              {book.QuantityInStock > 0 ? (
                <Badge variant="success">In Stock ({book.QuantityInStock} available)</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Add to Cart */}
            {(user?.Role === 'Customer' || !isAuthenticated) && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(q => Math.min(book.QuantityInStock, q + 1))}
                        disabled={quantity >= book.QuantityInStock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleAddToCart}
                    disabled={book.QuantityInStock <= 0 || isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Book Info */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Book Details</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-gray-600">ISBN</dt>
                  <dd>{book.ISBN}</dd>
                  <dt className="text-gray-600">Publisher</dt>
                  <dd>{book.PublisherName}</dd>
                  {book.PublicationYear && (
                    <>
                      <dt className="text-gray-600">Publication Year</dt>
                      <dd>{book.PublicationYear}</dd>
                    </>
                  )}
                  <dt className="text-gray-600">Category</dt>
                  <dd>{book.CategoryName}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
