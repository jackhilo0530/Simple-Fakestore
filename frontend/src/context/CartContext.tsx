import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import type { Cart, Order } from "../types";

type CartContextValue = {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
    itemCount: number;
    refresh: () => Promise<void>;
    addItem: (productId: number, qty?: number) => Promise<void>;
    setQty: (productId: number, qty: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    checkout: () => Promise<Order>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const itemCount = useMemo(() => {
        if (!cart) return 0;
        return cart.items.reduce((sum, i) => sum + i.quantity, 0);
    }, [cart]);

    async function refresh() {
        setError(null);
        const c = await api.getCart();
        setCart(c);
    }

    async function addItem(productId: number, qty = 1) {
        setError(null);
        const c = await api.addToCart(productId, qty);
        setCart(c);
    }

    async function setQty(productId: number, qty: number) {
        setError(null);
        const c = await api.setCartQty(productId, qty);
        setCart(c);
    }

    async function removeItem(productId: number) {
        setError(null);
        const c = await api.removeFromCart(productId);
        setCart(c);
    }

    async function checkout() {
        setError(null);
        const order = await api.checkout();
        // backend clears cart; refresh to show empty cart after order
        await refresh();
        return order;
    }

    useEffect(() => {
        (async () => {
            try {
                await refresh();
            } catch (e: any) {
                setError(e?.message ?? "failed to load cart");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const value: CartContextValue = {
        cart,
        loading,
        error,
        itemCount,
        refresh,
        addItem,
        setQty,
        removeItem,
        checkout
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}
