'use client';

import { SidebarProvider } from '@/components/ui/sidebar';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
