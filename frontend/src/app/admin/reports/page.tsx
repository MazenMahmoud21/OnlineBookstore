'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, Users, BookOpen, BarChart } from 'lucide-react';

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookIsbn, setBookIsbn] = useState('');

  // Previous month sales
  const { data: previousMonthSales, isLoading: loadingPreviousMonth } = useQuery({
    queryKey: ['sales-previous-month'],
    queryFn: async () => {
      const response = await api.get('/reports/sales/previous-month');
      return response.data;
    },
  });

  // Sales by date
  const { data: salesByDate, isLoading: loadingSalesByDate, refetch: refetchSalesByDate } = useQuery({
    queryKey: ['sales-by-date', selectedDate],
    queryFn: async () => {
      const response = await api.get(`/reports/sales/by-date?date=${selectedDate}`);
      return response.data;
    },
    enabled: !!selectedDate,
  });

  // Top customers
  const { data: topCustomers, isLoading: loadingTopCustomers } = useQuery({
    queryKey: ['top-customers'],
    queryFn: async () => {
      const response = await api.get('/reports/top-customers?months=3&top=5');
      return response.data;
    },
  });

  // Top books
  const { data: topBooks, isLoading: loadingTopBooks } = useQuery({
    queryKey: ['top-books'],
    queryFn: async () => {
      const response = await api.get('/reports/top-books?months=3&top=10');
      return response.data;
    },
  });

  // Book reorders
  const { data: bookReorders, isLoading: loadingReorders, refetch: refetchReorders } = useQuery({
    queryKey: ['book-reorders', bookIsbn],
    queryFn: async () => {
      const response = await api.get(`/reports/book-reorders/${bookIsbn}`);
      return response.data;
    },
    enabled: false,
  });

  const handleSearchReorders = () => {
    if (bookIsbn) {
      refetchReorders();
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>

      {/* Sales Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Previous Month Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Last Month Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPreviousMonth ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : previousMonthSales ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {monthNames[(previousMonthSales.Month || 1) - 1]} {previousMonthSales.Year}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ${(previousMonthSales.TotalSales || 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {previousMonthSales.NumberOfOrders || 0} orders
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Sales by Date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-600" />
              Sales by Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <Button onClick={() => refetchSalesByDate()}>Search</Button>
              </div>
              {loadingSalesByDate ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : salesByDate ? (
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-blue-600">
                    ${(salesByDate.TotalSales || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {salesByDate.NumberOfOrders || 0} orders
                  </p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Top 5 Customers (Last 3 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTopCustomers ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : topCustomers?.customers?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 font-medium">Rank</th>
                    <th className="text-left p-3 font-medium">Customer</th>
                    <th className="text-left p-3 font-medium">Email</th>
                    <th className="text-left p-3 font-medium">Orders</th>
                    <th className="text-left p-3 font-medium">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.customers.map((customer: {
                    UserID: number;
                    FirstName: string;
                    LastName: string;
                    Username: string;
                    Email: string;
                    OrderCount: number;
                    TotalPurchases: number;
                  }, index: number) => (
                    <tr key={customer.UserID} className="border-b">
                      <td className="p-3">
                        <Badge variant={index < 3 ? 'default' : 'secondary'}>#{index + 1}</Badge>
                      </td>
                      <td className="p-3">
                        <p className="font-medium">{customer.FirstName} {customer.LastName}</p>
                        <p className="text-sm text-gray-500">@{customer.Username}</p>
                      </td>
                      <td className="p-3 text-gray-600">{customer.Email}</td>
                      <td className="p-3">{customer.OrderCount}</td>
                      <td className="p-3 font-semibold text-green-600">
                        ${customer.TotalPurchases.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No customer data available</p>
          )}
        </CardContent>
      </Card>

      {/* Top Selling Books */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-600" />
            Top 10 Selling Books (Last 3 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTopBooks ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : topBooks?.books?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 font-medium">Rank</th>
                    <th className="text-left p-3 font-medium">Book</th>
                    <th className="text-left p-3 font-medium">Category</th>
                    <th className="text-left p-3 font-medium">Qty Sold</th>
                    <th className="text-left p-3 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topBooks.books.map((book: {
                    ISBN: string;
                    Title: string;
                    PublisherName: string;
                    CategoryName: string;
                    TotalQuantitySold: number;
                    TotalRevenue: number;
                  }, index: number) => (
                    <tr key={book.ISBN} className="border-b">
                      <td className="p-3">
                        <Badge variant={index < 3 ? 'default' : 'secondary'}>#{index + 1}</Badge>
                      </td>
                      <td className="p-3">
                        <p className="font-medium line-clamp-1">{book.Title}</p>
                        <p className="text-sm text-gray-500">{book.PublisherName}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">{book.CategoryName}</Badge>
                      </td>
                      <td className="p-3 font-semibold">{book.TotalQuantitySold}</td>
                      <td className="p-3 font-semibold text-green-600">
                        ${book.TotalRevenue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No sales data available</p>
          )}
        </CardContent>
      </Card>

      {/* Book Reorder Count */}
      <Card>
        <CardHeader>
          <CardTitle>Book Replenishment Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 max-w-md">
              <div className="flex-1">
                <Label htmlFor="bookIsbn" className="sr-only">ISBN</Label>
                <Input
                  id="bookIsbn"
                  placeholder="Enter book ISBN"
                  value={bookIsbn}
                  onChange={(e) => setBookIsbn(e.target.value)}
                />
              </div>
              <Button onClick={handleSearchReorders}>Search</Button>
            </div>
            {loadingReorders ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : bookReorders ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{bookReorders.Title}</p>
                <p className="text-sm text-gray-600 mb-2">ISBN: {bookReorders.ISBN}</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{bookReorders.TimesReordered || 0}</p>
                    <p className="text-sm text-gray-500">Times Reordered</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{bookReorders.TotalQuantityReordered || 0}</p>
                    <p className="text-sm text-gray-500">Total Qty Reordered</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
