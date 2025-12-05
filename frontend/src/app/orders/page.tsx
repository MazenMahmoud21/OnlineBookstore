'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Header } from '@/components/shared/Header';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { CustomerOrder, OrderItem, Pagination } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Loader2, ChevronRight } from 'lucide-react';

function OrdersContent() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const limit = 10;

  const { data, isLoading } = useQuery<{ orders: CustomerOrder[]; pagination: Pagination }>({
    queryKey: ['orders', page],
    queryFn: async () => {
      const response = await api.get(`/orders?page=${page}&limit=${limit}`);
      return response.data;
    },
  });

  const { data: orderDetails, isLoading: isLoadingDetails } = useQuery<CustomerOrder>({
    queryKey: ['order', selectedOrder?.CustOrderID],
    queryFn: async () => {
      const response = await api.get(`/orders/${selectedOrder?.CustOrderID}`);
      return response.data;
    },
    enabled: !!selectedOrder,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data || data.orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
        <p className="text-gray-600">Start shopping to see your orders here</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {data.orders.map((order) => (
          <Card key={order.CustOrderID} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedOrder(order)}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{order.CustOrderID}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.OrderDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {user?.Role === 'Admin' && order.Username && (
                    <p className="text-sm text-gray-500">Customer: {order.FirstName} {order.LastName}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge variant="success">{order.Status}</Badge>
                    <p className="font-bold text-lg mt-1">${order.TotalAmount.toFixed(2)}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= data.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.CustOrderID}`}
        className="max-w-2xl"
      >
        {isLoadingDetails ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : orderDetails ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order Date</p>
                <p className="font-medium">
                  {new Date(orderDetails.OrderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <Badge variant="success">{orderDetails.Status}</Badge>
              </div>
              {orderDetails.CreditCardLast4 && (
                <div>
                  <p className="text-gray-600">Payment</p>
                  <p className="font-medium">Card ending in {orderDetails.CreditCardLast4}</p>
                </div>
              )}
              {orderDetails.ShippingAddress && (
                <div>
                  <p className="text-gray-600">Shipping Address</p>
                  <p className="font-medium">{orderDetails.ShippingAddress}</p>
                </div>
              )}
            </div>

            <hr />

            <div>
              <h4 className="font-semibold mb-3">Order Items</h4>
              <div className="space-y-3">
                {orderDetails.items?.map((item: OrderItem) => (
                  <div key={item.CustOrderItemID} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.Title}</p>
                      <p className="text-sm text-gray-600">
                        ${item.UnitPrice.toFixed(2)} × {item.Quantity}
                      </p>
                    </div>
                    <p className="font-semibold">${item.Subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <hr />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-blue-600">${orderDetails.TotalAmount.toFixed(2)}</span>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <OrdersContent />
      </main>
    </ProtectedRoute>
  );
}
