const BASE_URL = process.env.BASE || "https://fakestoreapi.com";

export type FakeStoreProduct = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating?: {rate: number; count: number};
};

export async function fetchProducts({skip = 0, limit = 10}) {
    const res = await fetch(`${BASE_URL}/products?_start=${skip}&_limit=${limit}`);
    if(!res.ok) throw new Error("failed to fetch products");
    return (await res.json()) as FakeStoreProduct[];
}

export async function getTotalProductsCount() {
    const res = await fetch(`${BASE_URL}/products`);
    if(!res.ok) {
        throw new Error("Failed to fetch products count");
    }
    const products = await res.json();
    return products.length;
}

export async function fetchProduct(id: number) {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if(!res.ok) throw new Error("failed to fetch product");
    return (await res.json()) as FakeStoreProduct;
}