export interface DailyStat {
    date: string;
    revenue: number;
    orders: number;
}

export interface OutOfStockProduct {
    id: string;
    name: string;
    image: {
        url: string;
        alt: string;
    };
    price: number;
    category: string | null;
}

export interface DashboardData {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    pendingOrders: number;
    processingOrders: number;
    totalRevenue: number;
    totalProducts: number;
    productsInStore: number;
    soldProducts: number;
    outOfStockProducts: number;
    outOfStockProductsList: OutOfStockProduct[];
    totalRevenueOfProductsInStock: number;
    soldProductsGrossValue: number;
    totalDiscountGiven: number;
    dailyStats: DailyStat[];
}

export interface DashboardResponse {
    data: DashboardData;
    message: string;
    status: string;
    success: boolean;
}