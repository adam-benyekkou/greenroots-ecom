import "./Header.css";
import NavbarMobile from "./navbarMobile/navbarMobile";
import NavbarDesktop from "./navbarDesktop/navbarDesktop";
import { Link } from "react-router";

import logo from "../../../../assets/icons/logo.svg";
import iconAccount from "../../../../assets/icons/iconAccount.svg";
import iconCart from "../../../../assets/icons/iconCart.svg";

export function Header() {
	return (
		<div>
			<header>
				{/* burger menu, only for mobile*/}
				<NavbarMobile className="navbar-mobile" />

				{/* logo */}
				<Link to="/" className="header-logo">
					<img src={logo} alt="logo greenroots" />
				</Link>

				{/* navbar, only for tablet and desktop*/}
				<NavbarDesktop className="navbar-desktop" />

				{/* account and cart */}
				<div className="header-account-cart">
					<Link to="/">
						<img src={iconCart} alt="Panier" />
					</Link>
					<Link to="/">
						<img src={iconAccount} alt="Compte personnel" />
					</Link>
				</div>
			</header>
		</div>
	);
}
