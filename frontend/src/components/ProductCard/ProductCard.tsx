import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }: { product: Product }) {
    const { addItem } = useCart();

    return (
        <div className="card product-card">
            <Link to={`/products/${product.id}`} className="product-link">
                <div className="product-image-wrap">
                    <img className="product-image" src={product.image} alt={product.title} loading="lazy" />
                </div>
                <div className="product-body">
                    <div className="product-title" title={product.title}>{product.title}</div>
                    <div className="product-meta">
                        <span>${product.price.toFixed(2)}</span>
                        <span className="muted">{product.category}</span>
                    </div>
                </div>
            </Link>

            <div className="product-actions">
                <button className="btn btn-primary" onClick={() => addItem(product.id, 1)}>
                    add to cart
                </button>
            </div>
        </div>
    );
}