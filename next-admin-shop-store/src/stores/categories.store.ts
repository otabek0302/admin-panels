import { create } from 'zustand';
import { Category } from '@/interfaces/category';

// Types
type CategoriesState = {
    categories: Category[];
    category: Category | null;
    total: number;
    page: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    search: string;
    openDialog: boolean;
    openDeleteDialog: boolean;
    editData: Category | null;
    deleteData: Category | null;
    createData: Category | null;
};

type CategoriesActions = {
    fetchCategories: (params?: { page?: number; search?: string }) => Promise<void>;
    createCategory: (category: Category) => Promise<boolean>;
    updateCategory: (category: Category) => Promise<boolean>;
    deleteCategory: (id: string) => Promise<Response>;
    setPage: (page: number) => void;
    setSearch: (search: string) => void;
    setOpenDialog: (openDialog: boolean) => void;
    setOpenDeleteDialog: (openDeleteDialog: boolean) => void;
    setEditData: (editData: Category | null) => void;
    setDeleteData: (deleteData: Category | null) => void;
    setCreateData: (createData: Category | null) => void;
    setCategory: (category: Category | null) => void;
    getCategory: (id: string) => Promise<void>;
    fetchAllCategories: () => Promise<void>;
};

// Initial State
const initialState: CategoriesState = {
    categories: [],
    category: null,
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
export const useCategoriesStore = create<CategoriesState & CategoriesActions>((set, get) => ({
    ...initialState,

    fetchCategories: async (params = {}) => {
        const { page = get().page, search = get().search } = params;

        // Prevent duplicate requests
        if (get().loading) return;

        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/categories?page=${page}&search=${search}`, {
                credentials: 'include',
            });
            const data = await res.json();
            set({
                categories: data.categories,
                total: data.total,
                page: data.page,
                totalPages: data.totalPages,
            });
        } catch (err) {
            console.error('Failed to fetch users:', err);
            set({ error: 'Failed to fetch users' });
        } finally {
            set({ loading: false });
        }
    },

    createCategory: async (category: Category) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category),
            });
            const data = await res.json();
            set((state) => ({
                categories: [...state.categories, data],
                total: state.total + 1,
            }));
            return true;
        } catch (err) {
            console.error('Failed to create category:', err);
            set({ error: 'Failed to create category' });
            return false;
        } finally {
            set({ loading: false });
        }
        return false;
    },

    updateCategory: async (category: Category) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/categories/${category.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category),
            });
            if (!res.ok) throw new Error('Failed to update category');
            const data = await res.json();
            set((state) => ({
                categories: state.categories.map((c) => (c.id === category.id ? data : c)),
            }));
            return true;
        } catch (err) {
            console.error('Failed to update category:', err);
            set({ error: 'Failed to update category' });
            return false;
        } finally {
            set({ loading: false });
        }
        return false;
    },

    deleteCategory: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete category');
            set((state) => ({
                categories: state.categories.filter((c) => c.id !== id),
                total: state.total - 1,
            }));
            return res;
        } catch (err) {
            console.error('Failed to delete category:', err);
            set({ error: 'Failed to delete category' });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    getCategory: async (id: string) => {
        const res = await fetch(`/api/categories/${id}`);
        const data = await res.json();
        set({ category: data });
    },

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search }),
    setOpenDialog: (openDialog) => set({ openDialog }),
    setOpenDeleteDialog: (openDeleteDialog) => set({ openDeleteDialog }),
    setEditData: (editData) => set({ editData }),
    setDeleteData: (deleteData) => set({ deleteData }),
    setCreateData: (createData) => set({ createData }),
    setCategory: (category) => set({ category }),

    fetchAllCategories: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('/api/categories?all=true', { credentials: 'include' });
            const data = await res.json();
            set({ categories: data.categories });
        } catch (err) {
            set({ error: 'Failed to fetch all categories' });
        } finally {
            set({ loading: false });
        }
    },
}));