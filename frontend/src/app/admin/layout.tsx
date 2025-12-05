'use client';

import { Header } from '@/components/shared/Header';
import { AdminSidebar } from '@/components/shared/AdminSidebar';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="Admin">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
