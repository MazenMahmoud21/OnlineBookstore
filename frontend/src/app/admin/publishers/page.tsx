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
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { Publisher } from '@/types';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

const publisherSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type PublisherFormData = z.infer<typeof publisherSchema>;

export default function PublishersPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);

  const { data: publishers, isLoading } = useQuery<Publisher[]>({
    queryKey: ['publishers'],
    queryFn: async () => {
      const response = await api.get('/publishers');
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PublisherFormData>({
    resolver: zodResolver(publisherSchema),
  });

  const createPublisher = useMutation({
    mutationFn: async (data: PublisherFormData) => {
      await api.post('/publishers', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishers'] });
      showToast('تمت إضافة الناشر بنجاح!', 'success');
      handleCloseModal();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'فشل إضافة الناشر', 'error');
    },
  });

  const updatePublisher = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PublisherFormData }) => {
      await api.put(`/publishers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishers'] });
      showToast('تم تحديث الناشر بنجاح!', 'success');
      handleCloseModal();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'فشل تحديث الناشر', 'error');
    },
  });

  const deletePublisher = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/publishers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishers'] });
      showToast('تم حذف الناشر بنجاح!', 'success');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'فشل حذف الناشر', 'error');
    },
  });

  const handleOpenModal = (publisher?: Publisher) => {
    if (publisher) {
      setEditingPublisher(publisher);
      setValue('name', publisher.Name);
      setValue('address', publisher.Address || '');
      setValue('phone', publisher.Phone || '');
    } else {
      setEditingPublisher(null);
      reset();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPublisher(null);
    reset();
  };

  const onSubmit = (data: PublisherFormData) => {
    if (editingPublisher) {
      updatePublisher.mutate({ id: editingPublisher.PublisherID, data });
    } else {
      createPublisher.mutate(data);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold saudi-gradient-text">إدارة الناشرين</h1>
        <Button onClick={() => handleOpenModal()} className="saudi-gradient hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          إضافة ناشر
        </Button>
      </div>

      <Card className="border-2 border-primary/20">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">جاري تحميل الناشرين...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary/5 border-b-2 border-primary/20">
                  <tr>
                    <th className="text-left p-4 font-semibold text-primary">الرقم</th>
                    <th className="text-left p-4 font-semibold text-primary">الاسم</th>
                    <th className="text-left p-4 font-semibold text-primary">العنوان</th>
                    <th className="text-left p-4 font-semibold text-primary">الهاتف</th>
                    <th className="text-left p-4 font-semibold text-primary">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {publishers?.map((publisher) => (
                    <tr key={publisher.PublisherID} className="border-b hover:bg-primary/5 transition-colors">
                      <td className="p-4 font-semibold">{publisher.PublisherID}</td>
                      <td className="p-4 font-medium">{publisher.Name}</td>
                      <td className="p-4 text-muted-foreground">{publisher.Address || '-'}</td>
                      <td className="p-4">{publisher.Phone || '-'}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(publisher)} className="hover:bg-primary/10">
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('هل أنت متأكد من حذف هذا الناشر؟')) {
                                deletePublisher.mutate(publisher.PublisherID);
                              }
                            }}
                            className="hover:bg-red-50"
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingPublisher ? 'Edit Publisher' : 'Add New Publisher'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createPublisher.isPending || updatePublisher.isPending}
            >
              {(createPublisher.isPending || updatePublisher.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingPublisher ? 'Update Publisher' : 'Add Publisher'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
