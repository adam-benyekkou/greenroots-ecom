import { Link } from "react-router";
import "./navbarDesktop.css";
import { continents } from "~/continents";

function NavbarDesktop({ className }: { className?: string }) {
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
			<ul className="navlinks">
				{navLinks.map((link) =>
					link.subLinks ? (
						<li key={link.to} className="has-submenu">
							<Link to={link.to} className="menu-trigger">{link.label}</Link>
							<ul className="submenu">
								<li key="/catalog">
									<Link to="/catalog">Voir tout</Link>
								</li>
								{link.subLinks.map((subLink) => (
									<li key={subLink.to}>
										<Link to={subLink.to}>{subLink.label}</Link>
									</li>
								))}
							</ul>
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