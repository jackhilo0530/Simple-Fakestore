import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
    const { itemCount } = useCart();

    return (
        <header className="nav">
            <div className="nav-inner">
                <Link to="/" className="nav-brand">shopapp</Link>

                <nav className="nav-links">
                    <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                        products
                    </NavLink>
                    <NavLink to="/cart" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                        cart ({itemCount})
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}