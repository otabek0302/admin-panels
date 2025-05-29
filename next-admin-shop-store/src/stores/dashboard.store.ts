import { DashboardData, DashboardResponse } from '@/interfaces/dashboard';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


type DashboardStore = {
  // State
  data: DashboardResponse | null;
  isLoading: boolean;
  error: string | null;
  selectedMonth: number;
  selectedYear: number;
}

type DashboardActions = {
  // Actions
  fetchDashboardData: (month?: number, year?: number) => Promise<void>;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  resetError: () => void;
}

// Initial state
const initialState: DashboardStore = {
  data: null,
  isLoading: false,
  error: null,
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),
};

// Create the store
export const useDashboardStore = create<DashboardStore & DashboardActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchDashboardData: async (month?: number, year?: number) => {
        try {
          set({ isLoading: true, error: null });

          const currentMonth = month || get().selectedMonth;
          const currentYear = year || get().selectedYear;

          const response = await fetch(
            `/api/dashboard?month=${currentMonth}&year=${currentYear}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
          }

          const data: DashboardResponse = await response.json();
          set({ data, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      setSelectedMonth: (month: number) => {
        set({ selectedMonth: month });
        get().fetchDashboardData(month, get().selectedYear);
      },

      setSelectedYear: (year: number) => {
        set({ selectedYear: year });
        get().fetchDashboardData(get().selectedMonth, year);
      },

      resetError: () => set({ error: null }),
    }),
    {
      name: 'dashboard-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
