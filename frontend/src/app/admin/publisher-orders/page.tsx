'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { PublisherOrder, PublisherOrderItem, Pagination } from '@/types';
import { Loader2, Check, X, Eye } from 'lucide-react';

export default function PublisherOrdersPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PublisherOrder | null>(null);
  const limit = 10;

  const { data, isLoading } = useQuery<{ orders: PublisherOrder[]; pagination: Pagination }>({
    queryKey: ['publisher-orders', page, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      const response = await api.get(`/publisher-orders?${params.toString()}`);
      return response.data;
    },
  });

  const { data: orderDetails, isLoading: isLoadingDetails } = useQuery<PublisherOrder>({
    queryKey: ['publisher-order', selectedOrder?.PubOrderID],
    queryFn: async () => {
      const response = await api.get(`/publisher-orders/${selectedOrder?.PubOrderID}`);
      return response.data;
    },
    enabled: !!selectedOrder,
  });

  const confirmOrder = useMutation({
    mutationFn: async (orderId: number) => {
      await api.post(`/publisher-orders/${orderId}/confirm`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publisher-orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast('Order confirmed successfully!', 'success');
      setSelectedOrder(null);
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'Failed to confirm order', 'error');
    },
  });

  const cancelOrder = useMutation({
    mutationFn: async (orderId: number) => {
      await api.post(`/publisher-orders/${orderId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publisher-orders'] });
      showToast('Order cancelled', 'success');
      setSelectedOrder(null);
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'Failed to cancel order', 'error');
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Publisher Orders</h1>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === '' ? 'default' : 'outline'}
            onClick={() => {
              setStatusFilter('');
              setPage(1);
            }}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'Pending' ? 'default' : 'outline'}
            onClick={() => {
              setStatusFilter('Pending');
              setPage(1);
            }}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'Confirmed' ? 'default' : 'outline'}
            onClick={() => {
              setStatusFilter('Confirmed');
              setPage(1);
            }}
          >
            Confirmed
          </Button>
        </div>
      </div>

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
                    <th className="text-left p-4 font-medium">Publisher</th>
                    <th className="text-left p-4 font-medium">Order Date</th>
                    <th className="text-left p-4 font-medium">Total</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.orders.map((order) => (
                    <tr key={order.PubOrderID} className="border-b hover:bg-gray-50">
                      <td className="p-4">#{order.PubOrderID}</td>
                      <td className="p-4">
                        <p className="font-medium">{order.PublisherName}</p>
                      </td>
                      <td className="p-4">
                        {new Date(order.OrderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="p-4 font-semibold">${order.TotalAmount.toFixed(2)}</td>
                      <td className="p-4">{getStatusBadge(order.Status)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.Status === 'Pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => confirmOrder.mutate(order.PubOrderID)}
                                disabled={confirmOrder.isPending}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => cancelOrder.mutate(order.PubOrderID)}
                                disabled={cancelOrder.isPending}
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
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
        title={`Publisher Order #${selectedOrder?.PubOrderID}`}
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
                <p className="text-gray-600">Publisher</p>
                <p className="font-medium">{orderDetails.PublisherName}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                {getStatusBadge(orderDetails.Status)}
              </div>
              <div>
                <p className="text-gray-600">Order Date</p>
                <p className="font-medium">
                  {new Date(orderDetails.OrderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {orderDetails.PublisherPhone && (
                <div>
                  <p className="text-gray-600">Publisher Phone</p>
                  <p className="font-medium">{orderDetails.PublisherPhone}</p>
                </div>
              )}
            </div>

            <hr />

            <div>
              <h4 className="font-semibold mb-3">Order Items</h4>
              <div className="space-y-3">
                {orderDetails.items?.map((item: PublisherOrderItem) => (
                  <div key={item.PubOrderItemID} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.Title}</p>
                      <p className="text-sm text-gray-600">
                        ${item.UnitPrice.toFixed(2)} × {item.Quantity}
                      </p>
                      {item.QuantityInStock !== undefined && (
                        <p className="text-xs text-gray-500">
                          Current Stock: {item.QuantityInStock} (Threshold: {item.ReorderThreshold})
                        </p>
                      )}
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

            {orderDetails.Status === 'Pending' && (
              <div className="flex gap-4 pt-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => confirmOrder.mutate(orderDetails.PubOrderID)}
                  disabled={confirmOrder.isPending}
                >
                  {confirmOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Confirm Order
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => cancelOrder.mutate(orderDetails.PubOrderID)}
                  disabled={cancelOrder.isPending}
                >
                  {cancelOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancel Order
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
