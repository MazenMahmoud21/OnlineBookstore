'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { Book, Publisher, Category, Author, Pagination } from '@/types';
import { Plus, Edit, Trash2, Loader2, Search } from 'lucide-react';

const bookSchema = z.object({
  isbn: z.string().min(1, 'ISBN is required'),
  title: z.string().min(1, 'Title is required'),
  publisherId: z.string().min(1, 'Publisher is required'),
  publicationYear: z.string().optional(),
  sellingPrice: z.string().min(1, 'Price is required'),
  categoryId: z.string().min(1, 'Category is required'),
  quantityInStock: z.string(),
  reorderThreshold: z.string(),
  authorIds: z.array(z.string()).optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

export default function AdminBooksPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const limit = 10;

  // Fetch books
  const { data: booksData, isLoading: isLoadingBooks } = useQuery<{ books: Book[]; pagination: Pagination }>({
    queryKey: ['admin-books', page, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      const response = await api.get(`/books?${params.toString()}`);
      return response.data;
    },
  });

  // Fetch publishers
  const { data: publishers } = useQuery<Publisher[]>({
    queryKey: ['publishers'],
    queryFn: async () => {
      const response = await api.get('/publishers');
      return response.data;
    },
  });

  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });

  // Fetch authors
  const { data: authors } = useQuery<Author[]>({
    queryKey: ['authors'],
    queryFn: async () => {
      const response = await api.get('/authors');
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      isbn: '',
      title: '',
      publisherId: '',
      publicationYear: '',
      sellingPrice: '',
      categoryId: '',
      quantityInStock: '0',
      reorderThreshold: '10',
      authorIds: [],
    },
  });

  // Create book mutation
  const createBook = useMutation({
    mutationFn: async (data: BookFormData) => {
      const payload = {
        isbn: data.isbn,
        title: data.title,
        publisherId: parseInt(data.publisherId),
        publicationYear: data.publicationYear ? parseInt(data.publicationYear) : undefined,
        sellingPrice: parseFloat(data.sellingPrice),
        categoryId: parseInt(data.categoryId),
        quantityInStock: parseInt(data.quantityInStock) || 0,
        reorderThreshold: parseInt(data.reorderThreshold) || 10,
        authorIds: data.authorIds?.map(id => parseInt(id)) || [],
      };
      await api.post('/books', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      showToast('تمت إضافة الكتاب بنجاح!', 'success');
      handleCloseModal();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'فشل إضافة الكتاب', 'error');
    },
  });

  // Update book mutation
  const updateBook = useMutation({
    mutationFn: async ({ isbn, data }: { isbn: string; data: BookFormData }) => {
      const payload = {
        title: data.title,
        publisherId: parseInt(data.publisherId),
        publicationYear: data.publicationYear ? parseInt(data.publicationYear) : undefined,
        sellingPrice: parseFloat(data.sellingPrice),
        categoryId: parseInt(data.categoryId),
        quantityInStock: parseInt(data.quantityInStock) || 0,
        reorderThreshold: parseInt(data.reorderThreshold) || 10,
        authorIds: data.authorIds?.map(id => parseInt(id)) || [],
      };
      await api.put(`/books/${isbn}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      showToast('تم تحديث الكتاب بنجاح!', 'success');
      handleCloseModal();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'Failed to update book', 'error');
    },
  });

  // Delete book mutation
  const deleteBook = useMutation({
    mutationFn: async (isbn: string) => {
      await api.delete(`/books/${isbn}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      showToast('Book deleted successfully!', 'success');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'Failed to delete book', 'error');
    },
  });

  const handleOpenModal = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setValue('isbn', book.ISBN);
      setValue('title', book.Title);
      setValue('publisherId', book.PublisherID.toString());
      setValue('publicationYear', book.PublicationYear?.toString() || '');
      setValue('sellingPrice', book.SellingPrice.toString());
      setValue('categoryId', book.CategoryID.toString());
      setValue('quantityInStock', book.QuantityInStock.toString());
      setValue('reorderThreshold', book.ReorderThreshold.toString());
    } else {
      setEditingBook(null);
      reset();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBook(null);
    reset();
  };

  const onSubmit = (data: BookFormData) => {
    if (editingBook) {
      updateBook.mutate({ isbn: editingBook.ISBN, data });
    } else {
      createBook.mutate(data);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold saudi-gradient-text">إدارة الكتب</h1>
        <Button onClick={() => handleOpenModal()} className="saudi-gradient hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          إضافة كتاب
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        <Input
          type="text"
          placeholder="ابحث عن الكتب..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-10 border-primary/30 focus:border-primary"
        />
      </div>

      {/* Books Table */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-0">
          {isLoadingBooks ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">جاري تحميل الكتب...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary/5 border-b-2 border-primary/20">
                  <tr>
                    <th className="text-left p-4 font-semibold text-primary">ISBN</th>
                    <th className="text-left p-4 font-semibold text-primary">العنوان</th>
                    <th className="text-left p-4 font-semibold text-primary">التصنيف</th>
                    <th className="text-left p-4 font-semibold text-primary">السعر</th>
                    <th className="text-left p-4 font-semibold text-primary">المخزون</th>
                    <th className="text-left p-4 font-semibold text-primary">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {booksData?.books.map((book) => (
                    <tr key={book.ISBN} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-sm">{book.ISBN}</td>
                      <td className="p-4">
                        <p className="font-medium line-clamp-1">{book.Title}</p>
                        <p className="text-sm text-gray-600">
                          {typeof book.Authors === 'string' 
                            ? book.Authors 
                            : Array.isArray(book.Authors) 
                              ? book.Authors.map(a => a.Name).join(', ')
                              : '-'}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{book.CategoryName}</Badge>
                      </td>
                      <td className="p-4">${book.SellingPrice.toFixed(2)}</td>
                      <td className="p-4">
                        <Badge variant={book.QuantityInStock < book.ReorderThreshold ? 'destructive' : 'success'}>
                          {book.QuantityInStock}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(book)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this book?')) {
                                deleteBook.mutate(book.ISBN);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
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
      {booksData?.pagination && booksData.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingBook ? 'Edit Book' : 'Add New Book'}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" {...register('isbn')} disabled={!!editingBook} />
              {errors.isbn && <p className="text-sm text-red-500">{errors.isbn.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publisherId">Publisher</Label>
              <Select
                {...register('publisherId')}
                options={publishers?.map(p => ({ value: p.PublisherID.toString(), label: p.Name })) || []}
                placeholder="Select publisher"
              />
              {errors.publisherId && <p className="text-sm text-red-500">{errors.publisherId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                {...register('categoryId')}
                options={categories?.map(c => ({ value: c.CategoryID.toString(), label: c.CategoryName })) || []}
                placeholder="Select category"
              />
              {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Price ($)</Label>
              <Input id="sellingPrice" type="number" step="0.01" {...register('sellingPrice')} />
              {errors.sellingPrice && <p className="text-sm text-red-500">{errors.sellingPrice.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantityInStock">Stock</Label>
              <Input id="quantityInStock" type="number" {...register('quantityInStock')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorderThreshold">Reorder Threshold</Label>
              <Input id="reorderThreshold" type="number" {...register('reorderThreshold')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publicationYear">Publication Year</Label>
            <Input id="publicationYear" type="number" {...register('publicationYear')} />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createBook.isPending || updateBook.isPending}
            >
              {(createBook.isPending || updateBook.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingBook ? 'Update Book' : 'Add Book'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
