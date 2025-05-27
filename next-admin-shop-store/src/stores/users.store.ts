import { create } from 'zustand';
import { User } from '@/interfaces/user';

// Types
type UsersState = {
  users: User[];
  user: User | null;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  search: string;
  openDialog: boolean;
  openDeleteDialog: boolean;
  editData: User | null;
  deleteData: User | null;
  createData: User | null;
};

type UsersActions = {
  fetchUsers: (params?: { page?: number; search?: string }) => Promise<void>;
  createUser: (user: User) => Promise<boolean>;
  updateUser: (user: User) => Promise<boolean>;
  deleteUser: (id: string) => Promise<Response>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setOpenDialog: (openDialog: boolean) => void;
  setOpenDeleteDialog: (openDeleteDialog: boolean) => void;
  setEditData: (editData: User | null) => void;
  setDeleteData: (deleteData: User | null) => void;
  setCreateData: (createData: User | null) => void;
  setUser: (user: User | null) => void;
  getUser: (id: string) => Promise<void>;
};

// Initial State
const initialState: UsersState = {
  users: [],
  user: null,
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
export const useUsersStore = create<UsersState & UsersActions>((set, get) => ({
  ...initialState,

  fetchUsers: async (params = {}) => {
    const { page = get().page, search = get().search } = params;

    // Prevent duplicate requests
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/users?page=${page}&search=${search}`, {
        credentials: 'include',
      });
      const data = await res.json();
      set({
        users: data.users,
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

  createUser: async (user: User) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      set((state) => ({
        users: [...state.users, data],
        total: state.total + 1,
      }));
      return true;
    } catch (err) {
      console.error('Failed to create user:', err);
      set({ error: 'Failed to create user' });
      return false;
    } finally {
      set({ loading: false });
    }
    return false;
  },

  updateUser: async (user: User) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error('Failed to update user');
      const data = await res.json();
      set((state) => ({
        users: state.users.map((u) => (u.id === user.id ? data : u)),
      }));
      return true;
    } catch (err) {
      console.error('Failed to update user:', err);
      set({ error: 'Failed to update user' });
      return false;
    } finally {
      set({ loading: false });
    }
    return false;
  },

  deleteUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete user');
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        total: state.total - 1,
      }));
      return res;
    } catch (err) {
      console.error('Failed to delete user:', err);
      set({ error: 'Failed to delete user' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  getUser: async (id: string) => {
    const res = await fetch(`/api/users/${id}`);
    const data = await res.json();
    set({ user: data });
  },

  setPage: (page) => set({ page }),
  setSearch: (search) => set({ search }),
  setOpenDialog: (openDialog) => set({ openDialog }),
  setOpenDeleteDialog: (openDeleteDialog) => set({ openDeleteDialog }),
  setEditData: (editData) => set({ editData }),
  setDeleteData: (deleteData) => set({ deleteData }),
  setCreateData: (createData) => set({ createData }),
  setUser: (user) => set({ user }),
}));
