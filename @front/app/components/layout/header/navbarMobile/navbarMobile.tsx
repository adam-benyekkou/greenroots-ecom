import { useState } from "react";
import { Link } from "react-router";
import { continents } from "~/continents";

import "./navbarMobile.css";

function NavbarMobile({ className }: { className?: string }) {
	const [open, setOpen] = useState(false);

	const navLinks = [
		{ to: "/", label: "Accueil" },
		{
			to: "/catalog",
			label: "Catalogue",
			subLinks: continents.map((continent) => ({
				label: continent.label,
				to: `/catalog/${continent.value}`,
			})),
		},
		{ to: "/about", label: "Notre pépinière" },
	];

	return (
		<nav className={className}>
			<button
				type="button"
				onClick={() => {
					setOpen((previousOpen) => !previousOpen);
				}}
				aria-label="Ouvrir le menu"
				className="toggle-btn"
			>
				<span className="menu-icon">{open ? "✖" : "☰"}</span>
			</button>
			{open ? (
				<ul className="mobile-menu">
					{navLinks.map((link) => (
						<li key={link.to}>
							{link.subLinks ? (
								<div className="mobile-submenu-container">
									<Link to={link.to} onClick={() => setOpen(false)} className="mobile-main-link">
										{link.label}
									</Link>
									<details className="mobile-details">
										<summary className="mobile-summary">Continents</summary>
										<ul className="mobile-submenu">
											<li>
												<Link to="/catalog" onClick={() => setOpen(false)} className="mobile-submenu-link">
													Voir tout
												</Link>
											</li>
											{link.subLinks.map((sub) => (
												<li key={sub.to}>
													<Link to={sub.to} onClick={() => setOpen(false)} className="mobile-submenu-link">
														{sub.label}
													</Link>
												</li>
											))}
										</ul>
									</details>
								</div>
							) : (
								<Link to={link.to} onClick={() => setOpen(false)} className="mobile-main-link">
									{link.label}
								</Link>
							)}
						</li>
					))}
				</ul>
			) : null}
		</nav>
	);
}

export default NavbarMobile;