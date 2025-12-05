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
import { BookOpen, Loader2, LogIn, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      showToast('تم تسجيل الدخول بنجاح!', 'success');
      
      // Get user from localStorage to check role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.Role === 'Admin') {
        router.push('/admin');
      } else {
        router.push('/books');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'فشل تسجيل الدخول';
      const axiosError = error as { response?: { data?: { error?: string } } };
      showToast(axiosError.response?.data?.error || errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pattern-bg py-12 px-4">
      <Card className="w-full max-w-md shadow-2xl border-none animate-scale-in">
        <CardHeader className="text-center space-y-4 pb-8">
          <Link href="/" className="flex items-center justify-center gap-2 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-700 to-green-600 flex items-center justify-center shadow-lg">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mx-auto">
            <Sparkles className="h-4 w-4 text-green-700" />
            <span className="text-sm font-medium text-green-800">مكتبة المملكة الرقمية</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">مرحبًا بعودتك</CardTitle>
          <CardDescription className="text-base">
            سجل دخولك للمتابعة وتصفح مكتبتنا
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                placeholder="أحمد_القارئ"
                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-sm text-red-500 flex items-center gap-1">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">{errors.password.message}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  تسجيل الدخول
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t pt-6">
          <p className="text-sm text-gray-600">
            ليس لديك حساب؟{' '}
            <Link href="/signup" className="text-green-700 hover:text-green-800 font-bold hover:underline transition-colors">
              إنشاء حساب جديد
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
