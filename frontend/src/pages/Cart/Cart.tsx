import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types";
import CartItem from "../../components/CartItem/CartItem";
import "./Cart.css";

export default function CartPage() {
    const nav = useNavigate();
    const { cart, loading, error, refresh, itemCount } = useCart();

    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [page, setPage] = useState<number>(1);
    const PRODUCTS_PER_PAGE = 10;

    useEffect(() => {
        (async () => {
            try {
                setProductsLoading(true);
                const {products: productList, total} = await api.getProducts(page, PRODUCTS_PER_PAGE);
                setProducts(productList);
            } catch (e) {
                console.error("Error fetching products", e);
                setProducts([]);
            } finally {
                setProductsLoading(false);
            }
        })();
    }, [page]);

    const productById = useMemo(() => {
        const m = new Map<number, Product>();
        products.forEach((p) => m.set(p.id, p)) ;
        return m;
    }, [products]);

    const subtotal = useMemo(() => {
        if (!cart) return 0;
        return cart.items.reduce((sum, i) => {
            const p = productById.get(i.productId);
            return sum + (p?.price ?? 0) * i.quantity;
        }, 0);
    }, [cart, productById]);

    if (loading) return <p className="muted">loading cart...</p>;

    return (
        <section className="cart">
            <div className="cart-head">
                <h2 className="page-title">cart</h2>
                <button className="btn" onClick={refresh}>refresh</button>
            </div>

            {error && <p className="error">{error}</p>}

            {!cart || cart.items.length === 0 ? (
                <div className="card cart-empty">
                    <p className="muted">your cart is empty</p>
                    <Link className="btn btn-primary" to="/">browse products</Link>
                </div>
            ) : (
                <>
                    <div className="cart-list">
                        {productsLoading ? (
                            <p>Loading products...</p>
                        ) : (
                            cart.items.map((item) => {
                                const product = productById.get(item.productId);  // Fetch the corresponding product
                                return (
                                    product ? (
                                        <CartItem key={item.id} item={item} product={product} />
                                    ) : (
                                        <div key={item.id} className="cart-item-placeholder">
                                            <p>Product not found</p>
                                        </div>
                                    )
                                );
                            })
                        )}
                    </div>

                    <div className="card cart-summary">
                        <div className="row cart-summary-row">
                            <span className="muted">items</span>
                            <span>{itemCount}</span>
                        </div>
                        <div className="row cart-summary-row">
                            <span className="muted">subtotal</span>
                            <span className="cart-total">${subtotal.toFixed(2)}</span>
                        </div>

                        <button className="btn btn-primary" onClick={() => nav("/checkout")}>
                            checkout
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}