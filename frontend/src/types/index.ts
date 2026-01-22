export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating?: { rate: number; count: number };
}

export interface CartItem {
    id: string;
    productId: number;
    quantity: number;
}

export type Cart = {
    id: string;
    sessionId: string;
    items: CartItem[];
};

export interface OrderItem {
    id: string;
    productId: number;
    quantity: number;
    title: string;
    image: string;
    unitPrice: number;
    lineTotal: number;
}

export interface Order {
    id: string;
    total: number;
    items: OrderItem[];
}