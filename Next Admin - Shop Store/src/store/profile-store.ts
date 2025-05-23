import { create } from "zustand";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  currentPassword?: string;
  newPassword?: string;
}

interface ProfileStore {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  setProfile: (profile: Profile) => void;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  reset: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  loading: false,
  error: null,
  setProfile: (profile) => set({ profile }),

  updateProfile: async (profile) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update profile");
      }
      const updatedProfile = await res.json();
      set({ profile: updatedProfile });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error while updating";
      console.error("[UPDATE_PROFILE_ERROR]", err);
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/profile");
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Failed to fetch profile" }));
        throw new Error(error.message);
      }
      const profile = await res.json();
      set({ profile });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error fetching profile";
      console.error("[FETCH_PROFILE_ERROR]", err);
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => set({
    profile: null,
    loading: false,
    error: null
  })
}));