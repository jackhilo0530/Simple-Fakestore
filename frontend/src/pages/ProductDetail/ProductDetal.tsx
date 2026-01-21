import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../api/api";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types";
import "./product-detail.css";

export default function ProductDetailPage() {
    const { id } = useParams();
    const productId = Number(id);
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                if (!Number.isFinite(productId)) throw new Error("invalid product id");
                const p = await api.getProduct(productId);
                setProduct(p);
            } catch (e: any) {
                setError(e?.message ?? "failed to load product");
            } finally {
                setLoading(false);
            }
        })();
    }, [productId]);

    if (loading) return <p className="muted">loading...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!product) return <p className="muted">not found</p>;

    return (
        <section className="product-detail">
            <Link to="/" className="muted">← back</Link>

            <div className="card product-detail-card">
                <div className="product-detail-imgwrap">
                    <img className="product-detail-img" src={product.image} alt={product.title} />
                </div>

                <div className="product-detail-body">
                    <h2 className="product-detail-title">{product.title}</h2>
                    <p className="muted">{product.category}</p>
                    <p className="product-detail-price">${product.price.toFixed(2)}</p>
                    <p className="product-detail-desc">{product.description}</p>

                    <button className="btn btn-primary" onClick={() => addItem(product.id, 1)}>
                        add to cart
                    </button>
                </div>
            </div>
        </section>
    );
}