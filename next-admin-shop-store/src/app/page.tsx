'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Loading from './loading';

import { useSession } from 'next-auth/react';
import { ProductList } from '@/components/client-ui/product-list';
import { ProductToolbar } from '@/components/client-ui/product-toolbar';
import { Summary } from '@/components/client-ui/summary';

export default function Home() {
  const { status } = useSession();
  if (status === 'loading') return <Loading />;

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4">
        <Header />
      </div>

      <section className="flex-1 py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-full flex-col gap-4 lg:h-[calc(100vh-215px)] lg:flex-row">
            <div className="no-scrollbar h-full w-full flex-1 overflow-y-auto lg:max-w-full">
              <ProductToolbar />
              <ProductList />
            </div>
            <div className="no-scrollbar h-full w-full flex-1 overflow-y-auto lg:max-w-md">
              <Summary />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <Footer />
      </div>
    </main>
  );
}
