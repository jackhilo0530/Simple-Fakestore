import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <span className="muted">© {new Date().getFullYear()} shopapp</span>
            </div>
        </footer>
    );
}