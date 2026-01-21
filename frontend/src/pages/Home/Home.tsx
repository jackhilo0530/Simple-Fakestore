import { useEffect, useState } from "react";
import { api } from "../../api/api";
import type { Product } from "../../types";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./home.css";

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                const list = await api.getProducts();
                setProducts(list);
            } catch (e: any) {
                setError(e?.message ?? "failed to load products");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <section>
            <h2 className="page-title">products</h2>

            {loading && <p className="muted">loading...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-4">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </section>
    );
}