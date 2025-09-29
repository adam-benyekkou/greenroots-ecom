import { Link } from "react-router";
import "./navbarDesktop.css";
import { continents } from "~/continents";

function NavbarDesktop({ className }: { className?: string }) {
	const navLinks = [
		{ to: "/home", label: "Accueil" },
		{
			to: "/catalog",
			label: "Catalogue",
			subLinks: continents.map((continent) => ({
				label: continent.label,
				to: `/catalog/${continent.value}`
			})),
		},
		{ to: "/about", label: "À propos" },
	];

	return (
		<nav className={className}>
			<ul className="navlinks">
				{navLinks.map((link) =>
					link.subLinks ? (
						<li key={link.to} className="has-submenu">
							<details>
								<summary className="summary">{link.label}</summary>
								<ul className="submenu">
									{link.subLinks.map((subLink) => (
										<li key={subLink.to}>
											<Link to={subLink.to}>{subLink.label}</Link>
										</li>
									))}
								</ul>
							</details>
						</li>
					) : (
						<li key={link.to}>
							<Link to={link.to}>{link.label}</Link>
						</li>
					),
				)}
			</ul>
		</nav>
	);
}

export default NavbarDesktop;
