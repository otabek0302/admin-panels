'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Loading from './loading';
import Pagination from '@/components/ui/pagination';

import { ProductList } from '@/components/client-ui/product-list';
import { ProductToolbar } from '@/components/client-ui/product-toolbar';
import { Summary } from '@/components/client-ui/summary';
import { useSession } from 'next-auth/react';
import { useProductsStore } from '@/stores/product.store';
import { useEffect, useRef, useState } from 'react';
import { useOrdersStore } from '@/stores/orders.store';

// CartHydrator component to hydrate cart from localStorage and persist changes
function CartHydrator() {
  const setOrderItems = useOrdersStore((state) => state.setOrderItems);
  const orderItems = useOrdersStore((state) => state.orderItems);
  const setSubtotal = useOrdersStore((state) => state.setSubtotal);
  const calculateOrderSubtotal = useOrdersStore((state) => state.calculateOrderSubtotal);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('clientOrderItems');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setOrderItems(parsed);
          // Recalculate subtotal and total
          const subtotal = calculateOrderSubtotal(parsed);
          setSubtotal(subtotal);
        }
      } catch {}
    }
    setHydrated(true);
    // Only run once on mount
    // eslint-disable-next-line
  }, []);

  // Save to localStorage only after hydration
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('clientOrderItems', JSON.stringify(orderItems));
    }
  }, [orderItems, hydrated]);

  return null;
}

export default function Home() {
  const { status } = useSession();
  const { page, total, setPage } = useProductsStore();
  const fetchProducts = useProductsStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts({ page });
  }, [page]);
  
  if (status === 'loading') return <Loading />;

  return (
    <main className="flex min-h-screen flex-col">
      <CartHydrator />
      <div className="container mx-auto px-4">
        <Header />
      </div>

      <section className="flex-1 py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-full flex-col gap-4 lg:h-[calc(100vh-215px)] lg:flex-row">
            <div className="no-scrollbar h-full w-full flex-1 overflow-y-auto lg:max-w-full">
              <ProductToolbar />
              <ProductList />
              <Pagination page={page} setPage={setPage} total={total} perPage={15} /> 
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
