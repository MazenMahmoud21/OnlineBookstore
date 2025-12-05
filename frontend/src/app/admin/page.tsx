'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardStats, CustomerOrder, Book } from '@/types';
import { BookOpen, Users, Package, DollarSign, AlertTriangle, Truck, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<{
    stats: DashboardStats;
    recentOrders: CustomerOrder[];
    lowStockBooks: Book[];
  }>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/reports/dashboard');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">فشل تحميل لوحة التحكم</p>
      </div>
    );
  }

  const { stats, recentOrders, lowStockBooks } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-4xl font-bold saudi-gradient-text">لوحة التحكم</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-all border-2 hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الكتب</CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.TotalBooks}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all border-2 hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.TotalCustomers}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all border-2 hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <Package className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.TotalOrders}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all border-2 hover:border-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{stats.TotalRevenue.toFixed(2)} ر.س</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all border-2 hover:border-orange-500/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">طلبات ناشرين معلقة</CardTitle>
            <Truck className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.PendingPublisherOrders}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all border-2 hover:border-red-500/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">كتب مخزون منخفض</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.LowStockBooks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              الطلبات الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order: CustomerOrder) => (
                  <div key={order.CustOrderID} className="flex justify-between items-center p-3 rounded-lg hover:bg-primary/5 transition-colors">
                    <div>
                      <p className="font-semibold">طلب رقم #{order.CustOrderID}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.FirstName} {order.LastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{order.TotalAmount.toFixed(2)} ر.س</p>
                      <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100 mt-1">
                        {order.Status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">لا توجد طلبات حديثة</p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="border-2 border-red-500/20">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              تنبيه مخزون منخفض
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {lowStockBooks.length > 0 ? (
              <div className="space-y-4">
                {lowStockBooks.map((book: Book) => (
                  <div key={book.ISBN} className="flex justify-between items-center p-3 rounded-lg hover:bg-red-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold line-clamp-1">{book.Title}</p>
                      <p className="text-sm text-muted-foreground">{book.PublisherName}</p>
                    </div>
                    <div className="text-right ml-4">
                      <Badge variant="destructive" className="mb-1">
                        {book.QuantityInStock} متبقي
                      </Badge>
                      <p className="text-xs text-muted-foreground">الحد: {book.ReorderThreshold}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">جميع الكتب متوفرة بشكل جيد</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
