import { Link } from "react-router";
import "./Footer.css";

export function Footer() {
    return (
        <>
            <footer>
                <div className="footer-div">
                    <h3 className="footer-title">Notre entreprise</h3>
                    <Link to="/catalog">Catalogue</Link>
                    <Link to="/about">Notre pépinière</Link>
                    <Link to="/blog">Blog nature</Link>
                </div>
                <div className="footer-div">
                    <h3 className="footer-title">Ressources</h3>
                    <Link to="/cgv">CGV</Link>
                    <Link to="/mentions-legales">Mentions légales</Link>
                    <Link to="/confidentialite">Politique de confidentialité</Link>
                </div>
            </footer>

            <div className="footer-eco">
                <strong>🌱 Pépinière éco-responsable</strong> • 100% local • 0 pesticide
                <br />
                <span className="footer-eco-details">
                    Ce site consomme <strong>8× moins d'énergie</strong> que la moyenne des e-commerces.{" "}
                    <Link to="/ecoconception" className="footer-eco-link">
                        En savoir plus
                    </Link>
                </span>
            </div>
        </>
    );
}
