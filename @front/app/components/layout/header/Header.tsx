import { useState } from "react";
import "./Header.css";
import NavbarMobile from "./navbarMobile/navbarMobile";
import NavbarDesktop from "./navbarDesktop/navbarDesktop";
import { Form, Link } from "react-router";
import logo from "../../../../assets/icons/logo.svg";
import iconAccount from "../../../../assets/icons/iconAccount.svg";
import iconCart from "../../../../assets/icons/iconCart.svg";
import type { User } from "@types";

export function Header(props: { user: User | null }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

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
					<Link to="/shopping-cart">
						<img src={iconCart} alt="Cart" />
					</Link>
					<ul className="navlinks">
						<li>
							<div
								className="account-menu-container"
								onMouseEnter={() => setIsMenuOpen(true)}
								onMouseLeave={closeMenu}
							>
								<button
									className="account-trigger"
									onClick={toggleMenu}
									type="submit"
									aria-label="Open user menu"
								>
									<img src={iconAccount} alt="User account" />
								</button>
								{isMenuOpen && (
									<ul className="account-submenu">
										{props.user ? (
											<>
												<li>
													<Link to="/" onClick={closeMenu}>
														{props.user.email}
													</Link>
												</li>
												<li>
													<Link to="/orders" onClick={closeMenu}>
														My Orders
													</Link>
												</li>
												<li>
													<Form method="post" action="/logout">
														<button
															type="submit"
															onMouseDown={(e) => e.stopPropagation()}
															onClick={() => setTimeout(closeMenu, 100)}
														>
															Logout
														</button>
													</Form>
												</li>
											</>
										) : (
											<>
												<li>
													<Link to="/login" onClick={closeMenu}>
														Login
													</Link>
												</li>
												<li>
													<Link to="/register" onClick={closeMenu}>
														Register
													</Link>
												</li>
											</>
										)}
									</ul>
								)}
							</div>
						</li>
					</ul>
				</div>
			</header>
		</div>
	);
}
