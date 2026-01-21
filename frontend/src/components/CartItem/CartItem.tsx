import type { CartItem as CartItemType, Product } from "../../types";
import { useCart } from "../../context/CartContext";
import "./cart-item.css";

export default function CartItem({
    item,
    product
}: {
    item: CartItemType;
    product: Product | undefined;
}) {
    const { setQty, removeItem } = useCart();

    const title = product?.title ?? `product ${item.productId}`;
    const price = product?.price ?? 0;
    const line = price * item.quantity;

    return (
        <div className="card cart-item">
            <div className="cart-item-left">
                {product?.image ? (
                    <img className="cart-item-img" src={product.image} alt={title} />
                ) : (
                    <div className="cart-item-img placeholder" />
                )}
            </div>

            <div className="cart-item-mid">
                <div className="cart-item-title">{title}</div>
                <div className="muted">unit: ${price.toFixed(2)}</div>
            </div>

            <div className="cart-item-right">
                <div className="row">
                    <button
                        className="btn"
                        onClick={() => setQty(item.productId, Math.max(1, item.quantity - 1))}
                        aria-label="decrease quantity"
                    >
                        -
                    </button>

                    <input
                        className="cart-item-qty"
                        type="number"
                        min={1}
                        max={99}
                        value={item.quantity}
                        onChange={(e) => {
                            const v = Number(e.target.value);
                            if (!Number.isFinite(v)) return;
                            setQty(item.productId, Math.min(99, Math.max(1, v)));
                        }}
                    />

                    <button
                        className="btn"
                        onClick={() => setQty(item.productId, Math.min(99, item.quantity + 1))}
                        aria-label="increase quantity"
                    >
                        +
                    </button>
                </div>

                <div className="cart-item-line">${line.toFixed(2)}</div>

                <button className="btn" onClick={() => removeItem(item.productId)}>
                    remove
                </button>
            </div>
        </div>
    );
}