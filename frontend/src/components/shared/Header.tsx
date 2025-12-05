'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, BookOpen, LogOut, Menu, X } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">BookStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/books"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/books') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Browse Books
            </Link>
            {isAuthenticated && user?.Role === 'Customer' && (
              <>
                <Link
                  href="/cart"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/cart') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                </Link>
                <Link
                  href="/orders"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/orders') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  My Orders
                </Link>
              </>
            )}
            {isAuthenticated && user?.Role === 'Admin' && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 text-sm">
                  <User className="h-5 w-5" />
                  <span>{user?.FirstName}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link
                href="/books"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Books
              </Link>
              {isAuthenticated && user?.Role === 'Customer' && (
                <>
                  <Link
                    href="/cart"
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Shopping Cart
                  </Link>
                  <Link
                    href="/orders"
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                </>
              )}
              {isAuthenticated && user?.Role === 'Admin' && (
                <Link
                  href="/admin"
                  className="text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="text-sm font-medium text-left text-red-600"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
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
