import { create } from "zustand";
import { Category } from "@/interfaces/category";

interface CategoryState {
    categories: Category[];
    total: number;
    page: number;
    search: string;
    deleteData: Category | null;
    editData: Category | null;
    loading: boolean;
    error: string | null;
    setDeleteData: (data: Category | null) => void;
    setEditData: (data: Category | null) => void;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    setTotal: (total: number) => void;
    fetchCategories: () => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    editCategory: (id: string, name: string) => Promise<void>;
    createCategory: (name: string) => Promise<void>;
    reset: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
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
        categories: [],
        total: 0,
        page: 1,
        search: "",
        deleteData: null,
        editData: null,
        loading: true,
        error: null
    }),
    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const { search, page } = get();
            const res = await fetch(`/api/categories?search=${search}&page=${page}`);
            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: "Failed to fetch categories" }));
                throw new Error(error.message);
            }
            const data = await res.json();
            set({ categories: data.categories, total: data.total });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error fetching categories";
            console.error("[FETCH_CATEGORIES_ERROR]", error);
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },
    deleteCategory: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to delete category");
            }
            await get().fetchCategories();
            get().setDeleteData(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error deleting category";
            console.error("[DELETE_CATEGORY_ERROR]", error);
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },
    editCategory: async (id: string, name: string) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update category");
            }
            await get().fetchCategories();
            get().setEditData(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error updating category";
            console.error("[EDIT_CATEGORY_ERROR]", error);
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },
    createCategory: async (name: string) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to create category");
            }
            await get().fetchCategories();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error creating category";
            console.error("[CREATE_CATEGORY_ERROR]", error);
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    }
}));
