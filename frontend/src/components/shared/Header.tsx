'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, BookOpen, LogOut, Menu, X, UserCircle, Package, LayoutDashboard, Info, Sparkles, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-green-100' 
        : 'bg-white/80 backdrop-blur-md shadow-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between py-3">
          {/* Logo with enhanced design */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient">مكتبة المملكة</span>
              <span className="text-xs text-gray-500 font-medium -mt-0.5">المكتبة الرقمية</span>
            </div>
          </Link>

          {/* Desktop Navigation with enhanced styling */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/books', icon: BookOpen, label: 'المكتبة' },
              { href: '/about', icon: Info, label: 'من نحن' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 group ${
                  isActive(item.href) 
                    ? 'text-green-700 bg-green-50' 
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50/50'
                }`}
              >
                <item.icon className={`h-4 w-4 transition-transform duration-300 ${isActive(item.href) ? 'text-green-600' : 'group-hover:scale-110'}`} />
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></span>
                )}
              </Link>
            ))}
            
            {isAuthenticated && (
              <>
                <Link
                  href="/cart"
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 group ${
                    isActive('/cart') 
                      ? 'text-green-700 bg-green-50' 
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-50/50'
                  }`}
                >
                  <div className="relative">
                    <ShoppingCart className={`h-4 w-4 transition-transform duration-300 ${isActive('/cart') ? 'text-green-600' : 'group-hover:scale-110'}`} />
                  </div>
                  السلة
                  {isActive('/cart') && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></span>
                  )}
                </Link>
                <Link
                  href="/orders"
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 group ${
                    isActive('/orders') 
                      ? 'text-green-700 bg-green-50' 
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-50/50'
                  }`}
                >
                  <Package className={`h-4 w-4 transition-transform duration-300 ${isActive('/orders') ? 'text-green-600' : 'group-hover:scale-110'}`} />
                  طلباتي
                  {isActive('/orders') && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></span>
                  )}
                </Link>
              </>
            )}
            {isAuthenticated && user?.Role === 'Admin' && (
              <Link
                href="/admin"
                className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 group ${
                  pathname.startsWith('/admin') 
                    ? 'text-green-700 bg-green-50' 
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50/50'
                }`}
              >
                <LayoutDashboard className={`h-4 w-4 transition-transform duration-300 ${pathname.startsWith('/admin') ? 'text-green-600' : 'group-hover:scale-110'}`} />
                لوحة الإدارة
                {pathname.startsWith('/admin') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></span>
                )}
              </Link>
            )}
          </nav>

          {/* Auth Buttons with enhanced design */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl hover:bg-green-50 transition-all duration-300 group">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <UserCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">{user?.FirstName}</span>
                    <span className="text-xs text-gray-500">{user?.Role === 'Admin' ? 'مدير' : 'عميل'}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl">
                  <LogOut className="h-4 w-4 mr-2" />
                  خروج
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl font-semibold">تسجيل دخول</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="shadow-lg hover:shadow-xl rounded-xl">
                    <Sparkles className="h-4 w-4 mr-2" />
                    إنشاء حساب
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button with animation */}
          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-green-50 transition-all duration-300 relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="relative w-6 h-6">
              <Menu className={`h-6 w-6 text-green-700 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
              <X className={`h-6 w-6 text-green-700 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu with enhanced animation */}
        <div 
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="py-4 border-t border-green-100">
            <nav className="flex flex-col gap-2" role="navigation" aria-label="القائمة الرئيسية">
              {[
                { href: '/books', icon: BookOpen, label: 'المكتبة' },
                { href: '/about', icon: Info, label: 'من نحن' },
              ].map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.href) ? 'bg-green-50 text-green-700' : 'hover:bg-green-50/50 text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <item.icon className="h-5 w-5 text-green-600" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {isAuthenticated && user?.Role === 'Customer' && (
                <>
                  <Link
                    href="/cart"
                    className="text-sm font-semibold flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    <span>السلة</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="text-sm font-semibold flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="h-5 w-5 text-green-600" />
                    <span>طلباتي</span>
                  </Link>
                </>
              )}
              {isAuthenticated && user?.Role === 'Admin' && (
                <Link
                  href="/admin"
                  className="text-sm font-semibold flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5 text-green-600" />
                  <span>لوحة الإدارة</span>
                </Link>
              )}
              
              <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-2"></div>
              
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="text-sm font-semibold flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-white" />
                    </div>
                    <span>{user?.FirstName}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-semibold flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-300 text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>خروج</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">تسجيل دخول</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      إنشاء حساب
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
