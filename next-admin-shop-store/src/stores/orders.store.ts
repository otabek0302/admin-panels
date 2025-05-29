// Zustand Order Store - Final Merged and Cleaned Version

import { create } from 'zustand';
import { Order, OrderItem, OrderRequest } from '@/interfaces/order';
import { Product } from '@/interfaces/product';
import { OrderStatus } from '@prisma/client';

// State
type OrdersState = {
    orders: Order[];
    order: Order | null;
    orderItems: OrderItem[];
    subtotal: number;
    discount: number;
    total: number;
    page: number;
    totalPages: number;
    loading: boolean;
    hydrated: boolean;
    error: string | null;
    search: string;
    openDialog: boolean;
    openDeleteDialog: boolean;
    editData: Order | null;
    deleteData: Order | null;
    createData: Order | null;
};

// Actions
type OrdersActions = {
    fetchOrders: (params?: { page?: number; search?: string }) => Promise<void>;
    createOrder: (order: OrderRequest) => Promise<boolean>;
    updateOrder: (order: OrderRequest & { id: string }) => Promise<boolean>;
    deleteOrder: (id: string) => Promise<boolean>;
    getOrder: (id: string) => Promise<void>;
    updateOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;

    setPage: (page: number) => void;
    setSearch: (search: string) => void;
    setOpenDialog: (openDialog: boolean) => void;
    setOpenDeleteDialog: (openDeleteDialog: boolean) => void;
    setEditData: (editData: Order | null) => void;
    setDeleteData: (deleteData: Order | null) => void;
    setCreateData: (createData: Order | null) => void;
    setOrder: (order: Order | null) => void;

    setSubtotal: (subtotal: number) => void;
    getSubtotal: () => number;
    setDiscount: (discount: number) => void;
    getDiscount: () => number;
    applyDiscount: (discount: number) => void;
    setOrderItems: (orderItems: OrderItem[]) => void;
    getOrderItems: () => OrderItem[];
    calculateOrderSubtotal: (orderItems: OrderItem[]) => number;

    addOrderItem: (product: Product) => void;
    removeOrderItem: (productId: string) => void;
    updateOrderItem: (index: number, field: keyof OrderItem, value: string | number) => void;
    reset: () => void;
    resetOrderForm: () => void;
};

// Initial State
const initialState: OrdersState = {
    orders: [],
    order: null,
    orderItems: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    hydrated: false,
    error: null,
    search: '',
    openDialog: false,
    openDeleteDialog: false,
    editData: null,
    deleteData: null,
    createData: null,
};

export const useOrdersStore = create<OrdersState & OrdersActions>((set, get) => ({
    ...initialState,

    fetchOrders: async (params = {}) => {
        const { page = get().page, search = get().search } = params;
        
        // Prevent duplicate requests
        if (get().loading) return;
        
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/orders?page=${page}&search=${search}`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch orders');
            const data = await res.json();
            
            // Set the data first
            set({ 
                orders: data.orders, 
                total: data.total, 
                page: data.page, 
                totalPages: data.totalPages,
                hydrated: true
            });

            // Add a small delay before setting loading to false
            await new Promise(resolve => setTimeout(resolve, 300));
            set({ loading: false });
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            set({ 
                error: err instanceof Error ? err.message : 'Failed to fetch orders',
                hydrated: true
            });
            // Add the same delay for error case
            await new Promise(resolve => setTimeout(resolve, 300));
            set({ loading: false });
        }
    },

    createOrder: async (order) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to create order');
            const data = await res.json();
            set((state) => ({ 
                orders: [...state.orders, data], 
                total: state.total + 1 
            }));
            get().fetchOrders({ page: get().page, search: get().search });
            return true;
        } catch (err) {
            console.error('Failed to create order:', err);
            set({ error: err instanceof Error ? err.message : 'Failed to create order' });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateOrder: async (order) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/orders/${order.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to update order');
            const data = await res.json();
            set((state) => ({
                orders: state.orders.map((o) => (o.id === order.id ? data : o)),
            }));
            get().fetchOrders({ page: get().page, search: get().search });
            return true;
        } catch (err) {
            console.error('Failed to update order:', err);
            set({ error: err instanceof Error ? err.message : 'Failed to update order' });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateOrderStatus: async (id: string, status: OrderStatus) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) {
                const data = await res.json();
                set({ error: data.message || 'Failed to update status' });
                return false;
            }
            
            // Update the order status in the store
            set((state) => ({
                orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
            }));
            
            // Refresh the list after update
            get().fetchOrders({ page: get().page, search: get().search });
            return true;
        } catch (err: any) {
            set({ error: err.message || 'Status update failed' });
            return false;
        } finally {
            set({ loading: false });

        }
    },

    deleteOrder: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to delete order');
            set((state) => ({
                orders: state.orders.filter((o) => o.id !== id),
                total: state.total - 1,
            }));
            return true;
        } catch (err) {
            console.error('Failed to delete order:', err);
            set({ error: err instanceof Error ? err.message : 'Failed to delete order' });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    getOrder: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/orders/${id}`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch order');
            const data = await res.json();
            set({ order: data });
        } catch (err) {
            console.error('Failed to fetch order:', err);
            set({ error: err instanceof Error ? err.message : 'Failed to fetch order' });
        } finally {
            set({ loading: false });
        }
    },

    addOrderItem: (product: Product) => {
        const current = get().orderItems;
        const existing = current.find(item => item.productId === product.id);

        let updatedItems;
        if (existing) {
            updatedItems = current.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
                    : item
            );
        } else {
            updatedItems = [
                ...current,
                {
                    id: '',
                    orderId: '',
                    productId: product.id,
                    product,
                    quantity: 1,
                    price: product.price,
                    discount: 0,
                    total: product.price,
                    name: product.name,
                    image: {
                        publicId: product.image.publicId,
                        url: product.image.url,
                    },
                    status: 'PENDING' as OrderStatus,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
        }

        set({ orderItems: updatedItems });
        const subtotal = get().calculateOrderSubtotal(updatedItems);
        set({ subtotal, total: Math.max(subtotal - get().discount, 0) });
    },

    removeOrderItem: (productId: string) => {
        const items = get().orderItems.filter(item => item.productId !== productId);
        set({ orderItems: items, subtotal: get().calculateOrderSubtotal(items) });
        set({ total: Math.max(get().subtotal - get().discount, 0) });
    },

    updateOrderItem: (index, field, value) => {
        const items = [...get().orderItems];
        const item = items[index];

        if (field === 'quantity') {
            const quantity = typeof value === 'number' ? value : parseInt(value);
            item.quantity = quantity;
            item.total = quantity * item.price;
        } else {
            (item[field] as any) = value;
        }

        items[index] = item;
        set({ orderItems: items });
        set({ subtotal: get().calculateOrderSubtotal(items) });
        set({ total: Math.max(get().subtotal - get().discount, 0) });
    },

    updateOrderItemQuantity: (productId: string, quantity: number) => {
        const items = get().orderItems.map(item =>
            item.productId === productId
                ? { ...item, quantity, total: quantity * item.price }
                : item
        );
        set({ orderItems: items, subtotal: get().calculateOrderSubtotal(items) });
        set({ total: Math.max(get().subtotal - get().discount, 0) });
    },

    calculateOrderSubtotal: (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0),

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search }),
    setOpenDialog: (openDialog) => set({ openDialog }),
    setOpenDeleteDialog: (openDeleteDialog) => set({ openDeleteDialog }),
    setEditData: (editData) => set({ editData }),
    setDeleteData: (deleteData) => set({ deleteData }),
    setCreateData: (createData) => set({ createData }),
    setOrder: (order) => set({ order }),
    setSubtotal: (subtotal) => set({ 
        subtotal, 
        total: Math.max(subtotal - get().discount, 0) 
    }),
    getSubtotal: () => get().subtotal,
    setDiscount: (discount) => set({ 
        discount, 
        total: Math.max(get().subtotal - discount, 0) 
    }),
    getDiscount: () => get().discount,
    applyDiscount: (discount) => set({ 
        discount, 
        total: Math.max(get().subtotal - discount, 0) 
    }),
    setOrderItems: (orderItems) => set({ orderItems }),
    getOrderItems: () => get().orderItems,

    reset: () => set(initialState),
    resetOrderForm: () => set({
        orderItems: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        editData: null,
        createData: null,
    }),
}));