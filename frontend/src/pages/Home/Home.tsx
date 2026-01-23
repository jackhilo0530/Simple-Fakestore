import { useEffect, useState } from "react";
import { api } from "../../api/api";
import type { Product } from "../../types";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Home.css";

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalpages] = useState<number>(1);

    const PRODUCT_PER_PAGE = 10;

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                const list = await api.getProducts(page, PRODUCT_PER_PAGE);
                setProducts(list.products);
                setTotalpages(Math.ceil(list.total / PRODUCT_PER_PAGE));
            } catch (e: any) {
                setError(e?.message ?? "failed to load products");
            } finally {
                setLoading(false);
            }
        })();
    }, [page]);

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    return (
        <section>
            <h2 className="page-title">products</h2>

            {loading && <p className="muted">loading...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="grid grid-4">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>

                    <div className="pagination">
                        <button onClick={handlePrevPage} disabled={page === 1}>
                            Previous
                        </button>
                        <span>{`Page ${page} of ${totalPages}`}</span>
                        <button onClick={handleNextPage} disabled={page === totalPages}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}