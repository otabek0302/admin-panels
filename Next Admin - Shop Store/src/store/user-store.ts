import { User } from "@/interfaces/user";
import { create } from "zustand";


interface UserStore {
    users: User[];
    loading: boolean;
    error: string | null;
    search: string;
    page: number;
    total: number;
    perPage: number;
    editData: User | null;
    deleteData: User | null;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    setTotal: (total: number) => void;
    setEditData: (data: User | null) => void;
    setDeleteData: (data: User | null) => void;
    fetchUsers: () => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    editUser: (id: string, data: Partial<User>) => Promise<void>;
    createUser: (data: Partial<User>) => Promise<void>;
    reset: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
    users: [],
    total: 0,
    page: 1,
    search: "",
    deleteData: null,
    editData: null,
    loading: true,
    error: null,
    perPage: 10,

    setDeleteData: (data) => set({ deleteData: data }),
    setEditData: (data) => set({ editData: data }),
    setSearch: (search) => set({ search }),
    setPage: (page) => set({ page }),
    setTotal: (total) => set({ total }),
    reset: () => set({
        users: [],
        total: 0,
        page: 1,
        search: "",
        deleteData: null,
        editData: null,
        loading: true,
        error: null,
        perPage: 10
    }),

    fetchUsers: async () => {
        set({ loading: true });
        try {
            const { search, page } = get();
            const res = await fetch(`/api/users?search=${search}&page=${page}`);
            const data = await res.json();
            set({ users: data.users, total: data.total });
        } catch (err) {
            console.error("[FETCH_USERS_ERROR]", err);
        } finally {
            set({ loading: false });
        }
    },

    deleteUser: async (id: string) => {
        try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
            if (res.ok) get().fetchUsers();
        } catch (err) {
            console.error("[DELETE_USER_ERROR]", err);
        }
    },

    editUser: async (id: string, data: Partial<User>) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) get().fetchUsers();
        } catch (err) {
            console.error("[EDIT_USER_ERROR]", err);
        }
    },

    createUser: async (data: Partial<User>) => {
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) get().fetchUsers();
        } catch (err) {
            console.error("[CREATE_USER_ERROR]", err);
        }
    },
}));
