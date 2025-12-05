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
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/books', icon: BookOpen, label: 'Books' },
  { href: '/admin/publishers', icon: Users, label: 'Publishers' },
  { href: '/admin/publisher-orders', icon: Truck, label: 'Publisher Orders' },
  { href: '/admin/orders', icon: Package, label: 'Customer Orders' },
  { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
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
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-white hidden lg:block">
      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-lg font-semibold px-2 py-4">Admin Panel</h2>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100",
                isActive(item.href, item.exact)
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600"
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
