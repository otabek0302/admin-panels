import { create } from 'zustand';
import { Product } from '@/interfaces/product';

// Types
type ProductsState = {
    products: Product[];
    product: Product | null;
    total: number;
    page: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    search: string;
    openDialog: boolean;
    openDeleteDialog: boolean;
    editData: Product | null;
    deleteData: Product | null;
    createData: Product | null;
};

type ProductsActions = {
    fetchProducts: (params?: { page?: number; search?: string }) => Promise<void>;
    createProduct: (product: Product) => Promise<boolean>;
    updateProduct: (product: Product) => Promise<boolean>;
    deleteProduct: (id: string) => Promise<Response>;
    setPage: (page: number) => void;
    setSearch: (search: string) => void;
    setOpenDialog: (openDialog: boolean) => void;
    setOpenDeleteDialog: (openDeleteDialog: boolean) => void;
    setEditData: (editData: Product | null) => void;
    setDeleteData: (deleteData: Product | null) => void;
    setCreateData: (createData: Product | null) => void;
    setProduct: (product: Product | null) => void;
    getProduct: (id: string) => Promise<void>;
};

// Initial State
const initialState: ProductsState = {
    products: [],
    product: null,
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
    search: '',
    openDialog: false,
    openDeleteDialog: false,
    editData: null,
    deleteData: null,
    createData: null,
};

// Store
export const useProductsStore = create<ProductsState & ProductsActions>((set, get) => ({
    ...initialState,

    fetchProducts: async (params = {}) => {
        const { page = get().page, search = get().search } = params;

        // Prevent duplicate requests
        if (get().loading) return;

        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/products?page=${page}&search=${encodeURIComponent(search)}`, {
                credentials: 'include',
            });
            const data = await res.json();
            set({
                products: data.products,
                total: data.total,
                page: data.page,
                totalPages: data.totalPages,
            });
        } catch (err) {
            console.error('Failed to fetch products:', err);
            set({ error: 'Failed to fetch products' });
        } finally {
            set({ loading: false });
        }
    },

    createProduct: async (product: Product) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(product),
            });
            
            if (!res.ok) {
                throw new Error(`Failed to create product: ${res.status}`);
            }
            
            const data = await res.json();
            set((state) => ({
                products: [data, ...state.products],
                total: state.total + 1,
            }));
            return true;
        } catch (err) {
            console.error('Failed to create product:', err);
            set({ error: 'Failed to create product' });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateProduct: async (product: Product) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });
            if (!res.ok) throw new Error('Failed to update product');
            const data = await res.json();
            set((state) => ({
                products: state.products.map((p) => (p.id === product.id ? data : p)),
            }));
            return true;
        } catch (err) {
            console.error('Failed to update product:', err);
            set({ error: 'Failed to update product' });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteProduct: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete product');
            set((state) => ({
                products: state.products.filter((p) => p.id !== id),
                total: state.total - 1,
            }));
            return res;
        } catch (err) {
            console.error('Failed to delete product:', err);
            set({ error: 'Failed to delete product' });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    getProduct: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/products/${id}`, {
                credentials: 'include',
            });
            
            if (!res.ok) {
                throw new Error(`Failed to fetch product: ${res.status}`);
            }
            
            const data = await res.json();
            set({ product: data, error: null });
        } catch (err) {
            console.error('Failed to fetch product:', err);
            set({ error: 'Failed to fetch product', product: null });
        } finally {
            set({ loading: false });
        }
    },

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search }),
    setOpenDialog: (openDialog) => set({ openDialog }),
    setOpenDeleteDialog: (openDeleteDialog) => set({ openDeleteDialog }),
    setEditData: (editData) => set({ editData }),
    setDeleteData: (deleteData) => set({ deleteData }),
    setCreateData: (createData) => set({ createData }),
    setProduct: (product) => set({ product }),
}));