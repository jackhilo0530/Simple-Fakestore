import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import type { Order } from "../../types";
import "./CheckOut.css";

export default function CheckoutPage() {
    const nav = useNavigate();
    const { cart, checkout } = useCart();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // guard: if cart is empty, bounce back
        if (!cart || cart.items.length === 0) {
            nav("/cart", { replace: true });
            return;
        }

        (async () => {
            try {
                setError(null);
                const o = await checkout();
                setOrder(o);
            } catch (e: any) {
                setError(e?.message ?? "checkout failed");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <p className="muted">processing checkout...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!order) return <p className="muted">no order</p>;

    return (
        <section className="checkout">
            <h2 className="page-title">order confirmed</h2>

            <div className="card checkout-card">
                <div className="row checkout-row">
                    <span className="muted">order id</span>
                    <span className="mono">{order.id}</span>
                </div>
                <div className="row checkout-row">
                    <span className="muted">total</span>
                    <span className="checkout-total">${Number(order.total).toFixed(2)}</span>
                </div>

                <div className="checkout-items">
                    {order.items.map((i) => (
                        <div key={i.id} className="checkout-item">
                            <img src={i.image} alt={i.title} />
                            <div>
                                <div className="checkout-title">{i.title}</div>
                                <div className="muted">
                                    {i.quantity} × ${Number(i.unitPrice).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Link className="btn btn-primary" to="/">
                    keep shopping
                </Link>
            </div>
        </section>
    );
}