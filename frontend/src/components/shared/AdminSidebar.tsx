'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Package,
  Truck,
  Users,
  BarChart3,
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم', exact: true },
  { href: '/admin/books', icon: BookOpen, label: 'الكتب' },
  { href: '/admin/publishers', icon: Users, label: 'الناشرين' },
  { href: '/admin/publisher-orders', icon: Truck, label: 'طلبات الناشرين' },
  { href: '/admin/orders', icon: Package, label: 'طلبات العملاء' },
  { href: '/admin/reports', icon: BarChart3, label: 'التقارير' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r-2 border-primary/20 bg-gradient-to-b from-white to-primary/5 hidden lg:block">
      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-xl font-bold px-2 py-4 saudi-gradient-text">لوحة الإدارة</h2>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:shadow-md",
                isActive(item.href, item.exact)
                  ? "saudi-gradient text-white shadow-lg"
                  : "text-gray-600 hover:bg-primary/10"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
