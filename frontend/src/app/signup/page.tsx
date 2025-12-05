'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookOpen, Loader2, UserPlus, Sparkles } from 'lucide-react';

const signupSchema = z.object({
  username: z.string().min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'الاسم الأول مطلوب'),
  lastName: z.string().min(1, 'اسم العائلة مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().optional(),
  shippingAddress: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...signupData } = data;
      await signup(signupData);
      showToast('تم إنشاء الحساب بنجاح!', 'success');
      router.push('/books');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'فشل إنشاء الحساب';
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pattern-bg py-12 px-4">
      <Card className="w-full max-w-2xl shadow-2xl border-none animate-scale-in">
        <CardHeader className="text-center space-y-4 pb-8">
          <Link href="/" className="flex items-center justify-center gap-2 mb-2">
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mx-auto">
            <Sparkles className="h-4 w-4 text-indigo-700" />
            <span className="text-sm font-medium text-indigo-800">انضم إلى مكتبة المملكة</span>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient">إنشاء حساب جديد</CardTitle>
          <CardDescription className="text-base">
            سجل الآن لتبدأ رحلة القراءة والمعرفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">الاسم الأول</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="أحمد"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">اسم العائلة</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="محمد"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                placeholder="أحمد_القارئ"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="ahmed@example.sa"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">رقم الجوال (اختياري)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="05xxxxxxxx"
                {...register('phone')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingAddress" className="text-sm font-medium text-gray-700">عنوان التوصيل (اختياري)</Label>
              <Input
                id="shippingAddress"
                type="text"
                placeholder="الرياض، حي النخيل، شارع الملك فهد"
                {...register('shippingAddress')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 shadow-lg hover:shadow-xl transition-all duration-300" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  إنشاء الحساب
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t pt-6">
          <p className="text-sm text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-indigo-700 hover:text-indigo-800 font-bold hover:underline transition-colors">
              تسجيل الدخول
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
