import Aside from '@/components/layout/aside';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

import { Providers } from './provider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full">
        <Aside />
        <section className="flex-1">
          <Header />
          {children}
          <Footer />
        </section>
      </main>
    </Providers>
  );
}
