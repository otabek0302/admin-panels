import { TrendingUp, Users, DollarSign } from "lucide-react";

export const dashboard_data = [
    {
        trackingId: "TRK001",
        product: "Laptop Pro X",
        customer: "Alice Smith",
        date: "2024-07-15",
        amount: "$1250.00",
        paymentMethod: "Credit Card",
        status: "Shipped",
    },
    {
        trackingId: "TRK002",
        product: "Wireless Mouse",
        customer: "Bob Johnson",
        date: "2024-07-16",
        amount: "$35.50",
        paymentMethod: "PayPal",
        status: "Delivered",
    },
    {
        trackingId: "TRK003",
        product: "Mechanical Keyboard",
        customer: "Charlie Brown",
        date: "2024-07-16",
        amount: "$110.00",
        paymentMethod: "Bank Transfer",
        status: "Processing",
    },
    {
        trackingId: "TRK004",
        product: "4K Monitor",
        customer: "Diana Prince",
        date: "2024-07-17",
        amount: "$450.00",
        paymentMethod: "Credit Card",
        status: "Shipped",
    },
    {
        trackingId: "TRK005",
        product: "Webcam HD",
        customer: "Ethan Hunt",
        date: "2024-07-18",
        amount: "$75.00",
        paymentMethod: "PayPal",
        status: "Delivered",
    },
    {
        trackingId: "TRK006",
        product: "External SSD 1TB",
        customer: "Fiona Glenanne",
        date: "2024-07-18",
        amount: "$150.00",
        paymentMethod: "Credit Card",
        status: "Cancelled",
    },
    {
        trackingId: "TRK007",
        product: "Gaming Chair",
        customer: "George Costanza",
        date: "2024-07-19",
        amount: "$300.00",
        paymentMethod: "Bank Transfer",
        status: "Processing",
    },
];

export const users_data = [
    {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        phone: "+1234567890",
        address: "123 Main St, Anytown, USA",
        country: "USA",
        status: "Active",
        createdAt: "2024-07-15",
        updatedAt: "2024-07-15",
    },
    {
        id: 2,
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@doe.com",
        phone: "+1234567890",
        address: "123 Main St, Anytown, USA",
        country: "USA",
        status: "Active",
        createdAt: "2024-07-15",
        updatedAt: "2024-07-15",
    },

];

export const users_labels = [
    {
        value: "id",
        label: "ID",
    },
    {
        value: "firstName",
        label: "First Name",
    },
    {
        value: "lastName",
        label: "Last Name",
    },
    {
        value: "email",
        label: "Email",
    },
    {
        value: "phone",
        label: "Phone",
    },
    {
        value: "address",
        label: "Address",
    },
    {
        value: "country",
        label: "Country",
    },
    {
        value: "status",
        label: "Status",
    }
]

export const products_data = [
    {
        id: 1,
        name: "Product 1",
        price: "$100",
        status: "In Stock",
        discount: "$10",
        category: "Electronics",
        createdAt: "2024-07-15",
        updatedAt: "2024-07-15",
    },
    {
        id: 2,
        name: "Product 2",
        price: "$200",
        status: "In Stock",
        discount: "$20",
        category: "Electronics",
        createdAt: "2024-07-15",
        updatedAt: "2024-07-15",
    },
    {
        id: 3,
        name: "Product 3",
        price: "$300",
        status: "In Stock",
        discount: "$30",
        category: "Electronics",
        createdAt: "2024-07-15",
        updatedAt: "2024-07-15",
    },
    {
        id: 4,
        name: "Product 4",
        price: "$400",
        status: "In Stock",
        discount: "$40",
        category: "Electronics",
        createdAt: "2024-07-15",
        updatedAt: "2024-07-15",
    },
]

export const products_labels = [
    {
        value: "id",
        label: "ID",
    },
    {
        value: "name",
        label: "Name",
    },
    {
        value: "price",
        label: "Price",
    },
    {
        value: "status",
        label: "Status",
    },
    {
        value: "discount",
        label: "Discount",
    },
    {
        value: "category",
        label: "Category",
    },
    {
        value: "createdAt",
        label: "Created At",
    }
]

export const orders_data = [
    {
        id: 1,
        trackingId: "TRK001",
        product: "Laptop Pro X",
        customer: "Alice Smith",
        date: "2024-07-15",
        amount: "$1250.00",
        paymentMethod: "Credit Card",
        status: "Shipped",
    },
    {
        id: 2,
        trackingId: "TRK002",
        product: "Wireless Mouse",
        customer: "Bob Johnson",
        date: "2024-07-16",
        amount: "$35.50",
        paymentMethod: "PayPal",
        status: "Delivered",
    },
    {
        id: 3,
        trackingId: "TRK003",
        product: "Mechanical Keyboard",
        customer: "Charlie Brown",
        date: "2024-07-16",
        amount: "$110.00",
        paymentMethod: "Bank Transfer",
        status: "Processing",
    },
    {
        id: 4,
        trackingId: "TRK004",
        product: "4K Monitor",
        customer: "Diana Prince",
        date: "2024-07-17",
        amount: "$450.00",
        paymentMethod: "Credit Card",
        status: "Shipped",
    },
    {
        id: 5,
        trackingId: "TRK005",
        product: "Webcam HD",
        customer: "Ethan Hunt",
        date: "2024-07-18",
        amount: "$75.00",
        paymentMethod: "PayPal",
        status: "Delivered",
    },
    {
        id: 6,
        trackingId: "TRK006",
        product: "External SSD 1TB",
        customer: "Fiona Glenanne",
        date: "2024-07-18",
        amount: "$150.00",
        paymentMethod: "Credit Card",
        status: "Cancelled",
    },
    {
        id: 7,
        trackingId: "TRK007",
        product: "Gaming Chair",
        customer: "George Costanza",
        date: "2024-07-19",
        amount: "$300.00",
        paymentMethod: "Bank Transfer",
        status: "Processing",
    },
];

export const orders_labels = [
    {
        value: "id",
        label: "ID",
    },
    {
        value: "trackingId",
        label: "Tracking ID",
    },
    {
        value: "product",
        label: "Product",
    },
    {
        value: "customer",
        label: "Customer",
    },
    {
        value: "date",
        label: "Date",
    },
    {
        value: "amount",
        label: "Amount",
    },
    {
        value: "paymentMethod",
        label: "Payment Method",
    },
    {
        value: "status",
        label: "Status",
    },
];

export const metrics_data = [
    {
        id: 1,
        title: "Revenue Growth",
        subtitle: "Monthly revenue target",
        icon: TrendingUp,
        status: "On Track",
        progress: 75,
        target: 100000,
        current: 75000,
        unit: "$",
    },
    {
        id: 2,
        title: "Customer Acquisition",
        subtitle: "New customers this quarter",
        icon: Users,
        status: "Behind",
        progress: 60,
        target: 1000,
        current: 600,
        unit: "",
    },
    {
        id: 3,
        title: "Average Order Value",
        subtitle: "Target AOV for Q3",
        icon: DollarSign,
        status: "Ahead",
        progress: 110,
        target: 150,
        current: 165,
        unit: "$",
    },
]

export const settings_tabs = ["Overview", "Integrations", "Activity", "Domains", "Usage", "Monitoring"]


export const activity_data = [
    {
        id: 1,
        title: "Activity 1",
        description: "Description 1",
        date: "2024-07-15",
        time: "10:00 AM",
        status: "Success",
        icon: TrendingUp,
    },
    {
        id: 2,
        title: "Activity 2",
        description: "Description 2",
        date: "2024-07-15",
        time: "10:00 AM",
        status: "Success",
        icon: TrendingUp,   
    },
    {
        id: 3,
        title: "Activity 3",
        description: "Description 3",
        date: "2024-07-15",
        time: "10:00 AM",
        status: "Success",
        icon: TrendingUp,
    },
]

export const activity_labels = [
    {
        value: "id",
        label: "ID",
    },
    {
        value: "title",
        label: "Title",
    },
    {
        value: "description",
        label: "Description",
    },
    {
        value: "date",
        label: "Date",
    },
    {
        value: "time",
        label: "Time",
    },
    {
        value: "status",
        label: "Status",
    },
    {
        value: "icon",
        label: "Icon",
    },
]
