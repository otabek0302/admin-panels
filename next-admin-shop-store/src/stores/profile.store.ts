import { create } from 'zustand';

// Types
type ProfileState = {
    openEditDialog: boolean;
    loading: boolean;
    error: string | null;
};

type ProfileActions = {
    updatePassword: (data: { currentPassword: string; newPassword: string }, id: string) => Promise<boolean>;
    updateProfile: (data: { name: string; email: string; phone: string }, id: string) => Promise<boolean>;
    setOpenEditDialog: (openEditDialog: boolean) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
};

// Initial State
const initialState: ProfileState = {
    openEditDialog: false,
    loading: false,
    error: null,
};

// Store
export const useProfileStore = create<ProfileState & ProfileActions>((set, get) => ({
    ...initialState,
    updateProfile: async (data, id) => {
        set({ loading: true, error: null });

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            return true;
        } catch (err) {
            console.error('Failed to update profile:', err);
            set({ error: err instanceof Error ? err.message : 'Failed to update profile' });
            return false;
        } finally {
            set({ loading: false });
        }
    },
    updatePassword: async (data, id) => {
        set({ loading: true, error: null });

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to update password');

            return true;
        } catch (err) {
            console.error('Failed to update password:', err);
            set({ error: err instanceof Error ? err.message : 'Failed to update password' });
            return false;
        } finally {
            set({ loading: false });
        }
    },
    setOpenEditDialog: (openEditDialog) => set({ openEditDialog }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));
