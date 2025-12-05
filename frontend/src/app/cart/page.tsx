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
import { Trash2, Minus, Plus, ShoppingCart, Loader2, CreditCard } from 'lucide-react';

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
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-4">Start shopping to add items to your cart</p>
        <Button onClick={() => router.push('/books')} className="bg-blue-600 hover:bg-blue-700">
          Browse Books
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
            <Card key={item.CartItemID}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-28 bg-gradient-to-br from-blue-100 to-blue-50 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">📚</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.Title}</h3>
                    <p className="text-sm text-gray-600">{item.Authors}</p>
                    <p className="text-blue-600 font-bold mt-1">${item.SellingPrice.toFixed(2)}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity.mutate({ itemId: item.CartItemID, quantity: item.Quantity - 1 })}
                          disabled={item.Quantity <= 1 || updateQuantity.isPending}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.Quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity.mutate({ itemId: item.CartItemID, quantity: item.Quantity + 1 })}
                          disabled={item.Quantity >= item.QuantityInStock || updateQuantity.isPending}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">${item.Subtotal.toFixed(2)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem.mutate(item.CartItemID)}
                          disabled={removeItem.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Items ({cart.itemCount})</span>
                <span>${cart.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${cart.total}</span>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowCheckout(true)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="Checkout"
      >
        <form onSubmit={handleCheckout} className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
            <strong>Note:</strong> This is a simulated checkout. No real payment will be processed.
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardExpiry">Expiry Date</Label>
            <Input
              id="cardExpiry"
              type="date"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <span className="text-lg font-bold">Total: ${cart.total}</span>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={checkout.isPending}
            >
              {checkout.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Place Order'
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
    <ProtectedRoute requiredRole="Customer">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <CartContent />
      </main>
    </ProtectedRoute>
  );
}
