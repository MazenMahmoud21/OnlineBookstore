'use client';

import { useState, useEffect } from 'react';
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

export default function BooksPage() {
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
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
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Books</h1>
        
        {/* Search and Filters */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by title or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Categories' },
              ...(categories?.map((c) => ({ value: c.CategoryName, label: c.CategoryName })) || []),
            ]}
            className="w-full md:w-48"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Search
          </Button>
        </form>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : booksData?.books?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {page} of {booksData.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= booksData.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No books found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </>
  );
}
