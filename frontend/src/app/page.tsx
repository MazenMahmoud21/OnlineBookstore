'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { BookOpen, ShoppingCart, TruckIcon, Shield, Sparkles, Star, Zap, FlaskConical, Palette, Building, Globe, BookMarked, ArrowRight, Heart, Users, Clock, Gift } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        {/* Hero Section - Professional Design */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-orange-50"></div>
          <div className="absolute inset-0 pattern-bg"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-indigo-500 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <div className="animate-fade-in-down">
                <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl border border-indigo-100">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <span className="text-sm font-bold text-indigo-800">مكتبة المملكة الرقمية</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                  </div>
                </div>
              </div>
              
              {/* Main heading with gradient */}
              <h1 className="animate-fade-in-up text-5xl md:text-6xl lg:text-8xl font-black mb-8 leading-tight">
                <span className="text-gradient">اكتشف عالمًا</span>
                <br />
                <span className="text-gray-800">من المعرفة والإلهام</span>
              </h1>
              
              {/* Subheading */}
              <p className="animate-fade-in text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed" style={{ animationDelay: '0.3s' }}>
                استكشف مجموعتنا الواسعة من الكتب في العلوم والفنون والدين والتاريخ والجغرافيا
                <span className="block mt-2 text-indigo-700 font-semibold">أكثر من ١٠,٠٠٠ عنوان متاح الآن</span>
              </p>
              
              {/* CTA Buttons */}
              <div className="animate-fade-in flex flex-wrap gap-4 justify-center" style={{ animationDelay: '0.5s' }}>
                <Link href="/books">
                  <Button size="lg" className="h-14 px-8 text-lg shadow-2xl hover:shadow-indigo-500/25 group">
                    <BookOpen className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                    تصفح المكتبة
                    <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-2 shadow-xl group">
                    <Sparkles className="mr-3 h-6 w-6 text-orange-500 group-hover:rotate-12 transition-transform" />
                    إنشاء حساب مجاني
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="animate-fade-in mt-16 flex flex-wrap justify-center gap-8 text-gray-500" style={{ animationDelay: '0.7s' }}>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold">+١٠,٠٠٠ عميل سعيد</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold">توصيل خلال ٤٨ ساعة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold">شحن مجاني فوق ١٠٠ ر.س</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-indigo-600 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Features Section with enhanced cards */}
        <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-indigo-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-4">لماذا نحن مميزون</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">لماذا تختار مكتبتنا</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">نقدم لك تجربة قراءة استثنائية مع أفضل الكتب والخدمات</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: BookMarked, title: 'مجموعة واسعة', desc: 'آلاف الكتب في مختلف التصنيفات والمجالات', color: 'from-indigo-500 to-indigo-600', bgColor: 'from-indigo-100 to-indigo-50' },
                { icon: ShoppingCart, title: 'تسوق سهل', desc: 'تجربة شراء بسيطة وآمنة مع دفع موثوق', color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-100 to-orange-50' },
                { icon: TruckIcon, title: 'توصيل سريع', desc: 'شحن سريع لتصلك كتبك في الوقت المناسب', color: 'from-blue-500 to-cyan-600', bgColor: 'from-blue-100 to-blue-50' },
                { icon: Shield, title: 'دفع آمن', desc: 'معلوماتك المالية محمية بأعلى معايير الأمان', color: 'from-purple-500 to-violet-600', bgColor: 'from-purple-100 to-purple-50' },
              ].map((feature, index) => (
                <Card 
                  key={index} 
                  className="hover-lift border-none shadow-xl overflow-hidden group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-10 pb-8 text-center relative">
                    {/* Decorative corner */}
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${feature.bgColor} rounded-bl-[100%] opacity-60`}></div>
                    
                    <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section with visual cards */}
        <section className="py-24 lg:py-32 pattern-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-4">التصنيفات</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">تصفح حسب الفئة</h2>
              <p className="text-xl text-gray-600">اختر من بين تصنيفات متنوعة تغطي جميع اهتماماتك</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { name: 'Science', icon: FlaskConical, label: 'العلوم', color: 'from-blue-500 to-cyan-500', lightColor: 'from-blue-50 to-cyan-50' },
                { name: 'Art', icon: Palette, label: 'الفنون', color: 'from-purple-500 to-pink-500', lightColor: 'from-purple-50 to-pink-50' },
                { name: 'Religion', icon: BookOpen, label: 'الدين', color: 'from-indigo-600 to-indigo-500', lightColor: 'from-indigo-50 to-indigo-50' },
                { name: 'History', icon: Building, label: 'التاريخ', color: 'from-amber-600 to-orange-500', lightColor: 'from-amber-50 to-orange-50' },
                { name: 'Geography', icon: Globe, label: 'الجغرافيا', color: 'from-teal-500 to-cyan-500', lightColor: 'from-teal-50 to-cyan-50' }
              ].map((category, index) => (
                <Link 
                  key={category.name} 
                  href={`/books?category=${category.name}`}
                  className="group relative bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.lightColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Icon container */}
                  <div className="relative">
                    <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-5 mx-auto shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
                      <category.icon className="h-10 w-10 text-white" />
                    </div>
                    {/* Decorative ring */}
                    <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-2xl border-2 border-dashed ${category.color.includes('blue') ? 'border-blue-300' : category.color.includes('purple') ? 'border-purple-300' : category.color.includes('indigo') ? 'border-indigo-300' : category.color.includes('amber') ? 'border-amber-300' : 'border-teal-300'} opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500`}></div>
                  </div>
                  
                  <h3 className="relative font-bold text-lg text-gray-800 group-hover:text-indigo-700 transition-colors">{category.label}</h3>
                  <p className="relative text-sm text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">اضغط لتصفح الكتب</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-700 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '+١٠,٠٠٠', label: 'كتاب متاح', icon: BookOpen },
                { number: '+٥,٠٠٠', label: 'عميل سعيد', icon: Heart },
                { number: '+٥٠٠', label: 'مؤلف', icon: Users },
                { number: '٤.٩', label: 'تقييم العملاء', icon: Star },
              ].map((stat, index) => (
                <div key={index} className="text-center text-white">
                  <stat.icon className="h-10 w-10 mx-auto mb-4 opacity-80" />
                  <div className="text-4xl md:text-5xl font-black mb-2">{stat.number}</div>
                  <div className="text-indigo-200 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section with premium design */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 opacity-95"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)' }}></div>
          
          {/* Floating elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <Zap className="h-20 w-20 text-orange-400 mx-auto animate-pulse-glow" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight">
                هل أنت مستعد
                <span className="block text-orange-400">لبدء رحلة القراءة؟</span>
              </h2>
              <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                انضم إلى آلاف عشاق الكتب الذين وجدوا قراءاتهم المثالية معنا. سجل الآن واحصل على خصم ١٠٪ على طلبك الأول!
              </p>
              <Link href="/signup">
                <Button size="lg" className="h-16 px-12 text-xl bg-orange-500 hover:bg-orange-400 text-white shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 font-bold">
                  <Sparkles className="mr-3 h-6 w-6" />
                  ابدأ الآن مجاناً
                  <ArrowRight className="mr-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer with enhanced design */}
        <footer className="py-16 bg-gray-900 text-white relative overflow-hidden">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-orange-500 to-indigo-600"></div>
          
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              {/* Logo section */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gradient-orange">مكتبة المملكة</span>
                  <p className="text-gray-400 text-sm">المكتبة الرقمية الأولى في المملكة</p>
                </div>
              </div>
              
              {/* Links */}
              <div className="flex flex-wrap justify-center gap-6 text-gray-400">
                <Link href="/books" className="hover:text-white transition-colors">المكتبة</Link>
                <Link href="/about" className="hover:text-white transition-colors">من نحن</Link>
                <Link href="/login" className="hover:text-white transition-colors">تسجيل الدخول</Link>
                <Link href="/signup" className="hover:text-white transition-colors">إنشاء حساب</Link>
              </div>
              
              {/* Copyright */}
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} مكتبة المملكة الرقمية. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
