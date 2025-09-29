import "./Header.css";
import NavbarMobile from "./navbarMobile/navbarMobile";
import NavbarDesktop from "./navbarDesktop/navbarDesktop";
import { Form, Link } from "react-router";

import logo from "../../../../assets/icons/logo.svg";
import iconAccount from "../../../../assets/icons/iconAccount.svg";
import iconCart from "../../../../assets/icons/iconCart.svg";

export function Header(props: { user: any }) {
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
					<ul className="navlinks">
						<li>
							<details>
								<summary className="summary">
									<img src={iconAccount} alt="Compte personnel" />
								</summary>
								{props.user ? (
									<ul className="submenu">
										<li>
											<Link to="/">{props.user.email}</Link>
										</li>
										<li>
											<Form method="post" action="/logout">
												<button type="button">Se déconnecter</button>
											</Form>
										</li>
									</ul>
								) : (
									<ul className="account-submenu">
										<li>
											<Link to="/login">Se connecter</Link>
										</li>
										<li>
											<Link to="/register">S'inscrire</Link>
										</li>
									</ul>
								)}
							</details>
						</li>
					</ul>
				</div>
			</header>
		</div>
	);
}
