'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Header } from '@/components/shared/Header';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { CustomerOrder, OrderItem, Pagination } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Loader2, ChevronRight, CalendarDays, CreditCard, MapPin, CheckCircle } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
        <p className="text-gray-600">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  if (!data || data.orders.length === 0) {
    return (
      <div className="text-center py-20 animate-scale-in">
        <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Package className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">لا توجد طلبات بعد</h2>
        <p className="text-gray-600">ابدأ التسوق لترى طلباتك هنا</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5 animate-fade-in">
        {data.orders.map((order) => (
          <Card key={order.CustOrderID} className="cursor-pointer hover-lift border-none shadow-lg transition-all" onClick={() => setSelectedOrder(order)}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center shadow-md">
                    <Package className="h-7 w-7 text-green-700" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-800">طلب رقم #{order.CustOrderID}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(order.OrderDate).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {user?.Role === 'Admin' && order.Username && (
                      <p className="text-sm text-gray-500 mt-1">العميل: {order.FirstName} {order.LastName}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <Badge variant="success" className="bg-green-100 text-green-700 mb-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {order.Status}
                    </Badge>
                    <p className="font-bold text-2xl text-green-700">{order.TotalAmount.toFixed(2)} ر.س</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-green-600 text-green-700 hover:bg-green-50"
          >
            السابق
          </Button>
          <span className="flex items-center px-4 py-2 bg-green-50 rounded-lg font-medium text-green-800">
            صفحة {page} من {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= data.pagination.totalPages}
            className="border-green-600 text-green-700 hover:bg-green-50"
          >
            التالي
          </Button>
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`تفاصيل الطلب #${selectedOrder?.CustOrderID}`}
        className="max-w-3xl"
      >
        {isLoadingDetails ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : orderDetails ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 text-sm bg-green-50 p-5 rounded-xl">
              <div>
                <p className="text-gray-600 mb-1 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  تاريخ الطلب
                </p>
                <p className="font-bold text-gray-800">
                  {new Date(orderDetails.OrderDate).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  الحالة
                </p>
                <Badge variant="success" className="bg-green-100 text-green-700">{orderDetails.Status}</Badge>
              </div>
              {orderDetails.CreditCardLast4 && (
                <div>
                  <p className="text-gray-600 mb-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    طريقة الدفع
                  </p>
                  <p className="font-medium text-gray-800">بطاقة تنتهي بـ {orderDetails.CreditCardLast4}</p>
                </div>
              )}
              {orderDetails.ShippingAddress && (
                <div>
                  <p className="text-gray-600 mb-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    عنوان التوصيل
                  </p>
                  <p className="font-medium text-gray-800">{orderDetails.ShippingAddress}</p>
                </div>
              )}
            </div>

            <hr className="border-gray-200" />

            <div>
              <h4 className="font-bold text-lg mb-4 text-gray-800">محتويات الطلب</h4>
              <div className="space-y-4">
                {orderDetails.items?.map((item: OrderItem) => (
                  <div key={item.CustOrderItemID} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-800">{item.Title}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.UnitPrice.toFixed(2)} ر.س × {item.Quantity}
                      </p>
                    </div>
                    <p className="font-bold text-xl text-green-700">{item.Subtotal.toFixed(2)} ر.س</p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="flex justify-between items-center text-2xl font-bold bg-green-50 p-5 rounded-xl">
              <span className="text-gray-800">المجموع الكلي</span>
              <span className="text-green-700">{orderDetails.TotalAmount.toFixed(2)} ر.س</span>
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
      <main className="container mx-auto px-4 py-8 pattern-bg min-h-screen">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent mb-3">طلباتي</h1>
          <p className="text-gray-600 text-lg">تتبع وراجع جميع طلباتك</p>
        </div>
        <OrdersContent />
      </main>
    </ProtectedRoute>
  );
}
