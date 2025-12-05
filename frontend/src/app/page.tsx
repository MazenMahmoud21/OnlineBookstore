'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { BookOpen, ShoppingCart, Truck, Shield } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-100 via-blue-50 to-transparent py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Discover Your Next <span className="text-blue-600">Great Read</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Explore our vast collection of books across Science, Art, Religion, History, and Geography. 
                Find knowledge, adventure, and inspiration in every page.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/books">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Browse Books
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="lg">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Wide Selection</h3>
                  <p className="text-sm text-gray-600">
                    Thousands of books across multiple categories to choose from.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Easy Shopping</h3>
                  <p className="text-sm text-gray-600">
                    Simple and intuitive shopping experience with secure checkout.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Quick shipping to get your books delivered on time.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Secure Payment</h3>
                  <p className="text-sm text-gray-600">
                    Your payment information is always safe and secure.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['Science', 'Art', 'Religion', 'History', 'Geography'].map((category) => (
                <Link 
                  key={category} 
                  href={`/books?category=${category}`}
                  className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-3">
                    {category === 'Science' && '🔬'}
                    {category === 'Art' && '🎨'}
                    {category === 'Religion' && '🙏'}
                    {category === 'History' && '📜'}
                    {category === 'Geography' && '🌍'}
                  </div>
                  <h3 className="font-medium">{category}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Reading?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of book lovers who have found their perfect reads with us.
            </p>
            <Link href="/signup">
              <Button variant="secondary" size="lg">
                Get Started Today
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">BookStore</span>
              </div>
              <p className="text-sm text-gray-600">
                © 2024 Online Bookstore. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
