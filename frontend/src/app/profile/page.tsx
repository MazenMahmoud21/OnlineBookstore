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
import { Loader2, User as UserIcon, Save } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
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
  message: 'Current password is required to change password',
  path: ['currentPassword'],
}).refine((data) => {
  if (data.newPassword && data.newPassword.length < 6) {
    return false;
  }
  return true;
}, {
  message: 'New password must be at least 6 characters',
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
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
      refetch();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || 'Failed to update profile', 'error');
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle>{profile.FirstName} {profile.LastName}</CardTitle>
                <p className="text-sm text-gray-600">@{profile.Username}</p>
              </div>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register('firstName')} />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register('lastName')} />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Input id="shippingAddress" {...register('shippingAddress')} />
              </div>

              <hr className="my-6" />
              
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{profile.Email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{profile.Phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium">{profile.Role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {profile.CreatedAt 
                      ? new Date(profile.CreatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Shipping Address</p>
                <p className="font-medium">{profile.ShippingAddress || 'Not provided'}</p>
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
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <ProfileContent />
      </main>
    </ProtectedRoute>
  );
}
