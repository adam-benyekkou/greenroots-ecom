import { Link } from "react-router";
import "./Footer.css";

export function Footer () {
    return (
        <footer>
            <div className="footer-div">
                <h3 className="footer-title">Notre entreprise</h3>
                <Link to="">Catalogue</Link>
                <Link to="">A propos/contact</Link>
            </div>
            <div className="footer-div">
                <h3 className="footer-title">Ressources</h3>
                <Link to="">CGV</Link>
                <Link to="">Mentions légales</Link>
                <Link to="">Politique de confidentialité</Link>
            </div>
        </footer>
    )
}