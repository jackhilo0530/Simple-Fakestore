const VITE_API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";


export async function getProducts() {
    const res = await fetch(`${VITE_API_BASE}/products`, {credentials: "include"});
    return res.json();
}

export async function getProduct(id: number) {
    const res = await fetch(`${VITE_API_BASE}/products/${id}`, {credentials: "include"});
    return res.json();
}

export async function getCart() {
    const res = await fetch(`${VITE_API_BASE}/cart`, {credentials: "include"});
    return res.json();
}

export async function addToCart(productId: number, quantity = 1) {
    const res = await fetch(`${VITE_API_BASE}/cart/items`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({productId, quantity}),
    });
    return res.json();
}

export async function setCartQty(productId: number, quantity: number) {
    const res = await fetch(`${VITE_API_BASE}/cart/items/${productId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({quantity}),
    });
    return res.json();
}

export async function removeFromCart(productId: number){
    const res = await fetch(`${VITE_API_BASE}/cart/items/${productId}`, {
        method: "DELETE",
        credentials: "include",
    });
    return res.json();
}

export async function checkout() {
    const res = await fetch(`${VITE_API_BASE}/checkout`, {
        method: "POST",
        credentials: "include",
    });
    return res.json();
}