'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/AuthContext';
import { Book } from '@/types';
import { ShoppingCart, Loader2, ArrowLeft, Minus, Plus, BookMarked, Star, CheckCircle, XCircle, Package } from 'lucide-react';

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
      showToast('يرجى تسجيل الدخول لإضافة العناصر للسلة', 'warning');
      router.push('/login');
      return;
    }
    if (user?.Role !== 'Customer') {
      showToast('العملاء فقط يمكنهم الإضافة للسلة', 'warning');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await api.post('/cart/items', { isbn, quantity });
      showToast('تمت الإضافة للسلة بنجاح!', 'success');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'فشل الإضافة للسلة', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pattern-bg">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-3" />
            <p className="text-muted-foreground">جاري تحميل تفاصيل الكتاب...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen pattern-bg">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <BookMarked className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">الكتاب غير موجود</h1>
            <p className="text-muted-foreground mb-6">عذراً، لم نتمكن من العثور على هذا الكتاب</p>
            <Button onClick={() => router.back()} className="saudi-gradient">
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const authors = Array.isArray(book.Authors) 
    ? book.Authors.map(a => a.Name).join(', ')
    : book.Authors || 'Unknown Author';

  return (
    <div className="min-h-screen pattern-bg">
      <Header />
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-primary/10">
          <ArrowLeft className="h-4 w-4 mr-2" />
          العودة للمكتبة
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Book Image */}
          <div className="aspect-[3/4] saudi-gradient-soft rounded-2xl flex items-center justify-center shadow-xl border-2 border-primary/20">
            <BookMarked className="h-32 w-32 text-primary" />
          </div>

          {/* Book Details */}
          <div>
            <Badge variant="secondary" className="mb-4 bg-secondary/20 text-secondary border-secondary/30">
              {book.CategoryName}
            </Badge>
            <h1 className="text-4xl font-bold mb-4 text-foreground">{book.Title}</h1>
            <p className="text-lg text-muted-foreground mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-secondary fill-secondary" />
              {authors}
            </p>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-bold saudi-gradient-text">{book.SellingPrice.toFixed(2)} ر.س</span>
              {book.QuantityInStock > 0 ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  متوفر ({book.QuantityInStock})
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  غير متوفر
                </Badge>
              )}
            </div>

            {/* Add to Cart */}
            {(user?.Role === 'Customer' || !isAuthenticated) && (
              <Card className="mb-6 border-2 border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-semibold text-muted-foreground">الكمية:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-primary/30 hover:bg-primary/10 hover:border-primary"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-primary/30 hover:bg-primary/10 hover:border-primary"
                        onClick={() => setQuantity(q => Math.min(book.QuantityInStock, q + 1))}
                        disabled={quantity >= book.QuantityInStock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="w-full saudi-gradient hover:opacity-90 text-lg py-6"
                    onClick={handleAddToCart}
                    disabled={book.QuantityInStock <= 0 || isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        جاري الإضافة...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        أضف للسلة
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Book Info */}
            <Card className="border-2 border-primary/10">
              <CardHeader className="bg-primary/5">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  تفاصيل الكتاب
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <dl className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-primary/10">
                    <dt className="text-muted-foreground font-medium">رقم ISBN</dt>
                    <dd className="font-semibold">{book.ISBN}</dd>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-primary/10">
                    <dt className="text-muted-foreground font-medium">الناشر</dt>
                    <dd className="font-semibold">{book.PublisherName}</dd>
                  </div>
                  {book.PublicationYear && (
                    <div className="flex justify-between items-center pb-3 border-b border-primary/10">
                      <dt className="text-muted-foreground font-medium">سنة النشر</dt>
                      <dd className="font-semibold">{book.PublicationYear}</dd>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground font-medium">التصنيف</dt>
                    <dd>
                      <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                        {book.CategoryName}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
