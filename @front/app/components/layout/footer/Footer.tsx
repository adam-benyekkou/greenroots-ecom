import { Link } from "react-router";
import "./Footer.css";

export function Footer() {
    return (
        <>
            <footer>
                <div className="footer-div">
                    <h3 className="footer-title">Our Company</h3>
                    <Link to="/catalog">Catalog</Link>
                    <Link to="/about">Our Nursery</Link>
                    <Link to="/blog">Nature Blog</Link>
                </div>
                <div className="footer-div">
                    <h3 className="footer-title">Resources</h3>
                    <Link to="/cgv">T&C</Link>
                    <Link to="/mentions-legales">Legal Notice</Link>
                    <Link to="/confidentialite">Privacy Policy</Link>
                </div>
            </footer>

            <div className="footer-eco">
                <strong>🌱 Eco-responsible Nursery</strong> • 100% local • 0 pesticide
                <br />
                <span className="footer-eco-details">
                    This site consumes <strong>8× less energy</strong> than average e-commerce sites.{" "}
                    <Link to="/ecoconception" className="footer-eco-link">
                        Learn more
                    </Link>
                </span>
            </div>
        </>
    );
}
