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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return <div>Failed to load dashboard</div>;
  }

  const { stats, recentOrders, lowStockBooks } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.TotalBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.TotalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.TotalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.TotalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Publisher Orders</CardTitle>
            <Truck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.PendingPublisherOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Books</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.LowStockBooks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order: CustomerOrder) => (
                  <div key={order.CustOrderID} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.CustOrderID}</p>
                      <p className="text-sm text-gray-600">
                        {order.FirstName} {order.LastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.TotalAmount.toFixed(2)}</p>
                      <Badge variant="success" className="text-xs">{order.Status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent orders</p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockBooks.length > 0 ? (
              <div className="space-y-4">
                {lowStockBooks.map((book: Book) => (
                  <div key={book.ISBN} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium line-clamp-1">{book.Title}</p>
                      <p className="text-sm text-gray-600">{book.PublisherName}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">{book.QuantityInStock} left</Badge>
                      <p className="text-xs text-gray-500">Threshold: {book.ReorderThreshold}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">All books are well stocked</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
