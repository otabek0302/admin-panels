'use client';

import Link from 'next/link';
import Image from 'next/image';

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { logo } from '@/assets';
import { Calendar, Inbox, Search, Users, User, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Aside = () => {
  const { t } = useTranslation();
  const { setOpenMobile } = useSidebar();

  const handleNavigation = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" className="h-full w-64 p-4">
      <SidebarHeader className="overflow-hidden rounded-t-lg p-0">
        <SidebarMenu className="p-0">
          <SidebarMenuItem className="flex items-center justify-center border-b p-0">
            <Link href="/" className="relative flex h-10 w-full items-center justify-center gap-2" onClick={handleNavigation}>
              <Image src={logo} alt="logo" fill className="object-contain" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden rounded-b-lg p-0 py-2">
        <SidebarMenu>
          <SidebarMenuItem className="p-0">
            <SidebarMenuButton asChild size="sm" className="py-5 pl-4">
              <Link href="/admin" onClick={handleNavigation}>
                <Home className="h-9 w-9 text-primary" />
                <span className="text-sm font-semibold">{t('components.sidebar.home')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="p-0">
            <SidebarMenuButton asChild size="sm" className="py-5 pl-4">
              <Link href="/admin/products" onClick={handleNavigation}>
                <Inbox className="h-9 w-9 text-primary" />
                <span className="text-sm font-semibold">{t('components.sidebar.products')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="p-0">
            <SidebarMenuButton asChild size="sm" className="py-5 pl-4">
              <Link href="/admin/orders" onClick={handleNavigation}>
                <Calendar className="h-9 w-9 text-primary" />
                <span className="text-sm font-semibold">{t('components.sidebar.orders')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="p-0">
            <SidebarMenuButton asChild size="sm" className="py-5 pl-4">
              <Link href="/admin/categories" onClick={handleNavigation}>
                <Search className="h-9 w-9 text-primary" />
                <span className="text-sm font-semibold">{t('components.sidebar.categories')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="p-0">
            <SidebarMenuButton asChild size="sm" className="py-5 pl-4">
              <Link href="/admin/users" onClick={handleNavigation}>
                <Users className="h-9 w-9 text-primary" />
                <span className="text-sm font-semibold">{t('components.sidebar.users')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="p-0">
            <SidebarMenuButton asChild size="sm" className="py-5 pl-4">
              <Link href="/admin/profile" onClick={handleNavigation}>
                <User className="h-9 w-9 text-primary" />
                <span className="text-sm font-semibold">{t('components.sidebar.profile')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default Aside;
