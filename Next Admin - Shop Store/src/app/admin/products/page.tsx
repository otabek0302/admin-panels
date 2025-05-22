'use client';

import ProductTableToolbar from '@/components/admin-ui/products/product-toolbar';
import Pagination from '@/components/ui/pagination';
import ProductList from '@/components/admin-ui/products/product-list';

import { useProductStore } from '@/store/product-store';
import { useEffect } from 'react';

const ProductsPage = () => {
  const { total, page, search, setPage, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [search, page, fetchProducts]);

  return (
    <section className="flex h-full flex-col justify-between space-y-4 p-4">
      <ProductTableToolbar />
      <ProductList />
      <Pagination page={page} setPage={setPage} total={total} perPage={10} />
    </section>
  );
};

export default ProductsPage;
