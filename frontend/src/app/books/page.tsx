'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Header } from '@/components/shared/Header';
import { BookCard } from '@/components/shared/BookCard';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/AuthContext';
import { Book, Category } from '@/types';
import { Search, Loader2 } from 'lucide-react';

function BooksContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  
  const [search, setSearch] = useState(searchParams?.get('q') || '');
  const [category, setCategory] = useState(searchParams?.get('category') || '');
  const [page, setPage] = useState(1);
  const limit = 12;

  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });

  // Fetch books
  const { data: booksData, isLoading, refetch } = useQuery({
    queryKey: ['books', search, category, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (category) params.append('category', category);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await api.get(`/books?${params.toString()}`);
      return response.data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleAddToCart = async (isbn: string) => {
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'warning');
      return;
    }
    if (user?.Role !== 'Customer') {
      showToast('Only customers can add items to cart', 'warning');
      return;
    }
    
    try {
      await api.post('/cart/items', { isbn, quantity: 1 });
      showToast('Item added to cart!', 'success');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'Failed to add to cart', 'error');
    }
  };

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category) params.set('category', category);
    window.history.replaceState({}, '', `/books${params.toString() ? `?${params}` : ''}`);
  }, [search, category]);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 pattern-bg min-h-screen">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent mb-3">مكتبتنا الرقمية</h1>
          <p className="text-gray-600 text-lg">استكشف آلاف الكتب في مختلف المجالات</p>
        </div>
        
        {/* Search and Filters */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-10 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
            <Input
              type="text"
              placeholder="ابحث بالعنوان أو رقم ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <Select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            options={[
              { value: '', label: 'جميع الفئات' },
              ...(categories?.map((c) => ({ value: c.CategoryName, label: c.CategoryName })) || []),
            ]}
            className="w-full md:w-48 h-12"
          />
          <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 shadow-lg">
            <Search className="mr-2 h-5 w-5" />
            بحث
          </Button>
        </form>

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
            <p className="text-gray-600">جاري تحميل الكتب...</p>
          </div>
        ) : booksData?.books?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
              {booksData.books.map((book: Book) => (
                <BookCard
                  key={book.ISBN}
                  book={book}
                  onAddToCart={handleAddToCart}
                  showAddToCart={user?.Role === 'Customer' || !isAuthenticated}
                />
              ))}
            </div>

            {/* Pagination */}
            {booksData.pagination && booksData.pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-green-600 text-green-700 hover:bg-green-50"
                >
                  السابق
                </Button>
                <span className="flex items-center px-4 py-2 bg-green-50 rounded-lg font-medium text-green-800">
                  صفحة {page} من {booksData.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= booksData.pagination.totalPages}
                  className="border-green-600 text-green-700 hover:bg-green-50"
                >
                  التالي
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 animate-scale-in">
            <Search className="h-20 w-20 mx-auto text-gray-300 mb-4" />
            <p className="text-xl font-semibold text-gray-700 mb-2">لم يتم العثور على كتب</p>
            <p className="text-gray-500">جرب تعديل البحث أو الفلاتر</p>
          </div>
        )}
      </main>
    </>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </main>
      </>
    }>
      <BooksContent />
    </Suspense>
  );
}
