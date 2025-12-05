'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { CustomerOrder, OrderItem, Pagination } from '@/types';
import { Loader2, Eye } from 'lucide-react';

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const limit = 10;

  const { data, isLoading } = useQuery<{ orders: CustomerOrder[]; pagination: Pagination }>({
    queryKey: ['admin-orders', page],
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customer Orders</h1>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : data?.orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Order ID</th>
                    <th className="text-left p-4 font-medium">Customer</th>
                    <th className="text-left p-4 font-medium">Order Date</th>
                    <th className="text-left p-4 font-medium">Total</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.orders.map((order) => (
                    <tr key={order.CustOrderID} className="border-b hover:bg-gray-50">
                      <td className="p-4">#{order.CustOrderID}</td>
                      <td className="p-4">
                        <p className="font-medium">{order.FirstName} {order.LastName}</p>
                        <p className="text-sm text-gray-500">@{order.Username}</p>
                      </td>
                      <td className="p-4">
                        {new Date(order.OrderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="p-4 font-semibold">${order.TotalAmount.toFixed(2)}</td>
                      <td className="p-4">
                        <Badge variant="success">{order.Status}</Badge>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
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
                <p className="text-gray-600">Customer</p>
                <p className="font-medium">{orderDetails.FirstName} {orderDetails.LastName}</p>
                <p className="text-sm text-gray-500">@{orderDetails.Username}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <Badge variant="success">{orderDetails.Status}</Badge>
              </div>
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
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{orderDetails.Email}</p>
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
    </div>
  );
}
