'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, BookOpen, LogOut, Menu, X, UserCircle, Package, LayoutDashboard, Info } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b glass-effect shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-700 to-green-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">مكتبة المملكة</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/books"
              className={`text-sm font-medium transition-all hover:text-green-700 flex items-center gap-2 ${
                isActive('/books') ? 'text-green-700 font-bold' : 'text-gray-600'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              المكتبة
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-all hover:text-green-700 flex items-center gap-2 ${
                isActive('/about') ? 'text-green-700 font-bold' : 'text-gray-600'
              }`}
            >
              <Info className="h-4 w-4" />
              من نحن
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/cart"
                  className={`text-sm font-medium transition-all hover:text-green-700 flex items-center gap-2 ${
                    isActive('/cart') ? 'text-green-700 font-bold' : 'text-gray-600'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  السلة
                </Link>
                <Link
                  href="/orders"
                  className={`text-sm font-medium transition-all hover:text-green-700 flex items-center gap-2 ${
                    isActive('/orders') ? 'text-green-700 font-bold' : 'text-gray-600'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  طلباتي
                </Link>
              </>
            )}
            {isAuthenticated && user?.Role === 'Admin' && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-all hover:text-green-700 flex items-center gap-2 ${
                  pathname.startsWith('/admin') ? 'text-green-700 font-bold' : 'text-gray-600'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                لوحة الإدارة
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-green-50 transition-colors">
                  <UserCircle className="h-5 w-5 text-green-700" />
                  <span className="font-medium text-gray-700">{user?.FirstName}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-green-700 hover:bg-green-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  خروج
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-700 hover:bg-green-50">تسجيل دخول</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 shadow-md">إنشاء حساب</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-green-700" /> : <Menu className="h-6 w-6 text-green-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-in">
            <nav className="flex flex-col gap-4">
              <Link
                href="/books"
                className="text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4 text-green-700" />
                <span>المكتبة</span>
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Info className="h-4 w-4 text-green-700" />
                <span>من نحن</span>
              </Link>
              {isAuthenticated && user?.Role === 'Customer' && (
                <>
                  <Link
                    href="/cart"
                    className="text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4 text-green-700" />
                    <span>السلة</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="h-4 w-4 text-green-700" />
                    <span>طلباتي</span>
                  </Link>
                </>
              )}
              {isAuthenticated && user?.Role === 'Admin' && (
                <Link
                  href="/admin"
                  className="text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 text-green-700" />
                  <span>لوحة الإدارة</span>
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCircle className="h-4 w-4 text-green-700" />
                    <span>{user?.FirstName}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4 text-green-700" />
                    <span>خروج</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">تسجيل دخول</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-green-700 to-green-600">إنشاء حساب</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
