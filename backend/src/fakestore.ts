const BASE = process.env.BASE || "https://fakestoreapi.com";

export type FakeStoreProduct = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating?: {rate: number; count: number};
};

export async function fetchProducts() {
    const res = await fetch(`${BASE}/products`);
    if(!res.ok) throw new Error("failed to fetch products");
    return (await res.json()) as FakeStoreProduct[];
}

export async function fetchProduct(id: number) {
    const res = await fetch(`${BASE}/products/${id}`);
    if(!res.ok) throw new Error("failed to fetch product");
    return (await res.json()) as FakeStoreProduct;
}