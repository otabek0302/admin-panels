import { create } from "zustand";
import { Product, ProductFormData } from "@/interfaces/products";

interface ProductState {
    products: Product[];
    total: number;
    page: number;
    search: string;
    deleteData: Product | null;
    editData: Product | null;
    loading: boolean;
    error: string | null;
    setDeleteData: (data: Product | null) => void;
    setEditData: (data: Product | null) => void;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    setTotal: (total: number) => void;
    fetchProducts: () => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    editProduct: (id: string, data: ProductFormData) => Promise<void>;
    createProduct: (data: ProductFormData) => Promise<void>;
    reset: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    total: 0,
    page: 1,
    search: "",
    deleteData: null,
    editData: null,
    loading: true,
    error: null,
    setDeleteData: (data) => set({ deleteData: data }),
    setEditData: (data) => set({ editData: data }),
    setSearch: (search) => set({ search }),
    setPage: (page) => set({ page }),
    setTotal: (total) => set({ total }),
    reset: () => set({
        products: [],
        total: 0,
        page: 1,
        search: "",
        deleteData: null,
        editData: null,
        loading: true,
        error: null
    }),
    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const { search, page } = get();
            const res = await fetch(`/api/products?search=${search}&page=${page}`);
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: "Failed to fetch products" }));
                throw new Error(error.message);
            }
            const data = await res.json();
            set({ products: data.products, total: data.total });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error fetching products";
            console.error("[FETCH_PRODUCTS_ERROR]", error);
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },
    deleteProduct: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            const data = await res.json();
            
            if (!res.ok) {
                if (res.status === 400) {
                    throw new Error(data.error);
                }
                throw new Error('Failed to delete product');
            }
            
            await get().fetchProducts();
            get().setDeleteData(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error deleting product";
            console.error("[DELETE_PRODUCT_ERROR]", error);
            set({ error: message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    editProduct: async (id: string, data: ProductFormData) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update product");
            }
            await get().fetchProducts();
            get().setEditData(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error updating product";
            console.error("[EDIT_PRODUCT_ERROR]", error);
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },
    createProduct: async (data: ProductFormData) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/products`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to create product');
            }

            await get().fetchProducts();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error creating product";
            console.error("[CREATE_PRODUCT_ERROR]", error);
            set({ error: message });
            throw error;
        } finally {
            set({ loading: false });
        }
    }
}));
