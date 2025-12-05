'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { BookOpen, ShoppingCart, TruckIcon, Shield, Sparkles, Star, Award, Zap, FlaskConical, Palette, Building, Globe, BookMarked } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Header />
      <main className="pattern-bg">
        {/* Hero Section - Saudi-themed */}
        <section className="relative saudi-gradient-soft py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-yellow-50/50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-green-800">مكتبة المملكة الرقمية</span>
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-green-800 via-green-600 to-yellow-600 bg-clip-text text-transparent">
                اكتشف عالمًا من <span className="block mt-2">المعرفة والإلهام</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                استكشف مجموعتنا الواسعة من الكتب في العلوم والفنون والدين والتاريخ والجغرافيا
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/books">
                  <Button size="lg" className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <BookOpen className="mr-2 h-5 w-5" />
                    تصفح المكتبة
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="lg" className="border-2 border-green-700 text-green-700 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Award className="mr-2 h-5 w-5" />
                    إنشاء حساب
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-green-800">لماذا تختار مكتبتنا</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">نقدم لك تجربة قراءة استثنائية مع أفضل الكتب والخدمات</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover-lift border-none shadow-lg">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mb-4 mx-auto shadow-md">
                    <BookMarked className="h-8 w-8 text-green-700" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-green-800">مجموعة واسعة</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    آلاف الكتب في مختلف التصنيفات والمجالات
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-lift border-none shadow-lg">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-50 flex items-center justify-center mb-4 mx-auto shadow-md">
                    <ShoppingCart className="h-8 w-8 text-yellow-700" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-green-800">تسوق سهل</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    تجربة شراء بسيطة وآمنة مع دفع موثوق
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-lift border-none shadow-lg">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mb-4 mx-auto shadow-md">
                    <TruckIcon className="h-8 w-8 text-green-700" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-green-800">توصيل سريع</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    شحن سريع لتصلك كتبك في الوقت المناسب
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-lift border-none shadow-lg">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-50 flex items-center justify-center mb-4 mx-auto shadow-md">
                    <Shield className="h-8 w-8 text-yellow-700" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-green-800">دفع آمن</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    معلوماتك المالية محمية بأعلى معايير الأمان
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 lg:py-24 saudi-gradient-soft">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-green-800">تصفح حسب الفئة</h2>
            <p className="text-center text-gray-600 mb-12">اختر من بين تصنيفات متنوعة تغطي جميع اهتماماتك</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { name: 'Science', icon: FlaskConical, label: 'العلوم', color: 'from-blue-500 to-cyan-500' },
                { name: 'Art', icon: Palette, label: 'الفنون', color: 'from-purple-500 to-pink-500' },
                { name: 'Religion', icon: BookOpen, label: 'الدين', color: 'from-green-600 to-emerald-500' },
                { name: 'History', icon: Building, label: 'التاريخ', color: 'from-amber-600 to-orange-500' },
                { name: 'Geography', icon: Globe, label: 'الجغرافيا', color: 'from-teal-500 to-green-500' }
              ].map((category) => (
                <Link 
                  key={category.name} 
                  href={`/books?category=${category.name}`}
                  className="group bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">{category.label}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 saudi-gradient opacity-95"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <Zap className="h-16 w-16 text-yellow-300 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">هل أنت مستعد لبدء القراءة؟</h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                انضم إلى آلاف عشاق الكتب الذين وجدوا قراءاتهم المثالية معنا
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-110">
                  <Sparkles className="mr-2 h-5 w-5" />
                  ابدأ الآن
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-700 to-green-600 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">مكتبة المملكة</span>
              </div>
              <p className="text-sm text-gray-600">
                © 2024 مكتبة المملكة الرقمية. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
