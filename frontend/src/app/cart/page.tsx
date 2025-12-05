'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Header } from '@/components/shared/Header';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { Cart, CartItem } from '@/types';
import { Trash2, Minus, Plus, ShoppingCart, Loader2, CreditCard, BookOpen, PackageCheck } from 'lucide-react';

function CartContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');

  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await api.get('/cart');
      return response.data;
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      await api.put(`/cart/items/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'Failed to update cart', 'error');
    },
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: number) => {
      await api.delete(`/cart/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showToast('Item removed from cart', 'success');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'Failed to remove item', 'error');
    },
  });

  const checkout = useMutation({
    mutationFn: async () => {
      const response = await api.post('/cart/checkout', {
        cardNumber,
        expiry: cardExpiry,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showToast('Order placed successfully!', 'success');
      setShowCheckout(false);
      router.push(`/orders`);
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'Checkout failed', 'error');
    },
  });

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry) {
      showToast('Please fill in all card details', 'warning');
      return;
    }
    checkout.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
        <p className="text-gray-600">جاري تحميل السلة...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20 animate-scale-in">
        <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <ShoppingCart className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">سلة التسوق فارغة</h2>
        <p className="text-gray-600 mb-6">ابدأ بإضافة كتب إلى سلتك</p>
        <Button onClick={() => router.push('/books')} className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 shadow-lg">
          <BookOpen className="mr-2 h-5 w-5" />
          تصفح المكتبة
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item: CartItem) => (
            <Card key={item.CartItemID} className="hover-lift border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-24 h-32 bg-gradient-to-br from-green-100 via-yellow-50 to-green-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <BookOpen className="h-12 w-12 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{item.Title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.Authors}</p>
                    <p className="text-green-700 font-bold text-xl mb-4">{item.SellingPrice.toFixed(2)} ر.س</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity.mutate({ itemId: item.CartItemID, quantity: item.Quantity - 1 })}
                          disabled={item.Quantity <= 1 || updateQuantity.isPending}
                          className="h-9 w-9 border-green-600 text-green-700 hover:bg-green-50"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-bold text-lg">{item.Quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity.mutate({ itemId: item.CartItemID, quantity: item.Quantity + 1 })}
                          disabled={item.Quantity >= item.QuantityInStock || updateQuantity.isPending}
                          className="h-9 w-9 border-green-600 text-green-700 hover:bg-green-50"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="font-bold text-xl text-green-700">{item.Subtotal.toFixed(2)} ر.س</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem.mutate(item.CartItemID)}
                          disabled={removeItem.isPending}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24 border-none shadow-2xl">
            <CardHeader className="bg-gradient-to-br from-green-50 to-yellow-50 border-b">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <PackageCheck className="h-6 w-6" />
                ملخص الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">العناصر ({cart.itemCount})</span>
                <span className="font-semibold">{cart.total} ر.س</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">الشحن</span>
                <span className="text-green-600 font-semibold">مجاني</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-xl font-bold">
                <span className="text-gray-800">الإجمالي</span>
                <span className="text-green-700">{cart.total} ر.س</span>
              </div>
              <Button
                className="w-full h-12 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 shadow-lg text-lg"
                onClick={() => setShowCheckout(true)}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                إتمام الطلب
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="إتمام الطلب"
      >
        <form onSubmit={handleCheckout} className="space-y-5">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-yellow-800">
            <strong>ملاحظة:</strong> هذا نظام محاكاة للدفع. لن يتم معالجة أي دفع حقيقي.
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="text-gray-700 font-medium">رقم البطاقة</Label>
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
              className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardExpiry" className="text-gray-700 font-medium">تاريخ الانتهاء</Label>
            <Input
              id="cardExpiry"
              type="date"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div className="flex justify-between items-center pt-6 border-t">
            <span className="text-xl font-bold text-gray-800">الإجمالي: {cart.total} ر.س</span>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 shadow-lg h-11 px-8"
              disabled={checkout.isPending}
            >
              {checkout.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  تأكيد الطلب
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="container mx-auto px-4 py-8 pattern-bg min-h-screen">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent mb-3">سلة التسوق</h1>
          <p className="text-gray-600 text-lg">راجع مشترياتك وأتمم طلبك</p>
        </div>
        <CartContent />
      </main>
    </ProtectedRoute>
  );
}
    <ProtectedRoute requiredRole="Customer">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <CartContent />
      </main>
    </ProtectedRoute>
  );
}
