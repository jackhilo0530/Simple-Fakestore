import type { Cart, Order, Product } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = (isJson ? await res.json() : null) as unknown;

  if (!res.ok) {
    const msg =
      (data as any)?.message ||
      (data as any)?.error ||
      `request failed: ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

export const api = {
  // catalog
  getProducts: async (page: number, limit: number) => {
    
    const res = await fetch(`${API_BASE}/products?page=${page}&limit=${limit}`);
    const data = await res.json();
    return {
      products: Array.isArray(data.products) ? data.products : [],
      total: data.total || 0
    };
  },
  getProduct: (id: number) => request<Product>(`/products/${id}`),

  // cart
  getCart: () => request<Cart>("/cart"),
  addToCart: (productId: number, quantity = 1) =>
    request<Cart>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity })
    }),
  setCartQty: (productId: number, quantity: number) =>
    request<Cart>(`/cart/items/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity })
    }),
  removeFromCart: (productId: number) =>
    request<Cart>(`/cart/items/${productId}`, { method: "DELETE" }),

  // checkout
  checkout: () => request<Order>("/checkout", { method: "POST" })
};