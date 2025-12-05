'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Header } from '@/components/shared/Header';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { Loader2, User as UserIcon, Save, Edit, Shield, Mail, Phone, MapPin } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(1, 'الاسم الأول مطلوب'),
  lastName: z.string().min(1, 'اسم العائلة مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().optional(),
  shippingAddress: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'كلمة المرور الحالية مطلوبة لتغيير كلمة المرور',
  path: ['currentPassword'],
}).refine((data) => {
  if (data.newPassword && data.newPassword.length < 6) {
    return false;
  }
  return true;
}, {
  message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
  path: ['newPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfileContent() {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading, refetch } = useQuery<User>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/users/me');
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profile ? {
      firstName: profile.FirstName,
      lastName: profile.LastName,
      email: profile.Email,
      phone: profile.Phone || '',
      shippingAddress: profile.ShippingAddress || '',
      currentPassword: '',
      newPassword: '',
    } : undefined,
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await api.put('/users/me', data);
      return response.data;
    },
    onSuccess: (data) => {
      updateUser(data.user);
      showToast('تم تحديث الملف الشخصي بنجاح!', 'success');
      setIsEditing(false);
      refetch();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'فشل تحديث الملف الشخصي', 'error');
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">جاري تحميل معلومات الحساب...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <UserIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-xl text-muted-foreground">الملف الشخصي غير موجود</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 hover:shadow-xl transition-all duration-300 animate-fade-in">
        <CardHeader className="saudi-gradient-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <UserIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">{profile.FirstName} {profile.LastName}</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <span>@{profile.Username}</span>
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90">
                <Edit className="mr-2 h-4 w-4" />
                تعديل
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-primary" />
                    الاسم الأول
                  </Label>
                  <Input id="firstName" placeholder="أحمد" {...register('firstName')} className="border-primary/30 focus:border-primary" />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-primary" />
                    اسم العائلة
                  </Label>
                  <Input id="lastName" placeholder="المالكي" {...register('lastName')} className="border-primary/30 focus:border-primary" />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  البريد الإلكتروني
                </Label>
                <Input id="email" type="email" placeholder="ahmed@example.com" {...register('email')} className="border-primary/30 focus:border-primary" />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  رقم الجوال
                </Label>
                <Input id="phone" placeholder="05xxxxxxxx" {...register('phone')} className="border-primary/30 focus:border-primary" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shippingAddress" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  عنوان الشحن
                </Label>
                <Input id="shippingAddress" placeholder="الرياض، حي النخيل، شارع الملك فهد" {...register('shippingAddress')} className="border-primary/30 focus:border-primary" />
              </div>

              <hr className="my-6 border-primary/20" />
              
              <h3 className="font-semibold">Change Password (Optional)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" {...register('currentPassword')} />
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" {...register('newPassword')} />
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-primary" />
                    البريد الإلكتروني
                  </p>
                  <p className="font-medium">{profile.Email}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-primary" />
                    رقم الجوال
                  </p>
                  <p className="font-medium">{profile.Phone || 'غير محدد'}</p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/30">
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-secondary" />
                    الدور
                  </p>
                  <p className="font-medium capitalize">{profile.Role}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                    <UserIcon className="h-4 w-4 text-primary" />
                    عضو منذ
                  </p>
                  <p className="font-medium">
                    {profile.CreatedAt 
                      ? new Date(profile.CreatedAt).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'غير متوفر'}
                  </p>
                </div>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  عنوان الشحن
                </p>
                <p className="font-medium">{profile.ShippingAddress || 'غير محدد'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen pattern-bg">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center saudi-gradient-text animate-fade-in">
            الملف الشخصي
          </h1>
          <ProfileContent />
        </main>
      </div>
    </ProtectedRoute>
  );
}
