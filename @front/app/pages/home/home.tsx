import { Link } from "react-router";
import "./home.css";
import type { Route } from "./+types/home";

import homePageSeed from "./images/homePage_seed_growing.webp";

import trees from "./data/data";
import TreeCard from "~/components/shared/components/TreeCard/TreeCard";
import type { TreeCardProps } from "@types";
import "./home.css";

export function meta() {
	return [
		{
			title:
				"GreenRoots - plantez des arbres pour lutter contre la déforestation",
		},
		{
			name: "description",
			content:
				"Parrainez un arbre dans un de nos projets de notre reforestation à travers le monde",
		},
	];
}

export async function loader() {
	return { trees };
}

export default function Home(props: Route.ComponentProps) {
	const { loaderData } = props;
	return (
		<main>
			<section className="hero-section">
				<h1>
					Participez à la reforestation avec <span>GreenRoots</span>
				</h1>
			</section>
			<section className="sub-hero-section-full-width">
				<div
					className="container-sub-hero
				"
				>
					<img src={homePageSeed} alt="graine poussant dans la forêt" />
					<div className="sub-hero-text-content">
						<p>Partout dans le monde, nos projets revitalisent la planète!</p>
						<h3>make our planet green again!</h3>
						<Link to="/catalog" className="link-button-desktop">
							Voir tous nos arbres
						</Link>
					</div>
				</div>
			</section>
			<section className="trees-section">
				<h2>Nos arbres autour du monde</h2>
				<div className="tree-card-container">
					<ul>
						{loaderData.trees.map((tree: TreeCardProps) => (
							<li key={tree.tree_id}>
								<TreeCard
									tree_id={tree.tree_id}
									name={tree.name}
									price={tree.price}
									image={tree.image}
									localization={tree.localization}
									project_name={tree.project_name}
								/>
							</li>
						))}
					</ul>
				</div>
				<Link to="/catalog" className="link-button-mobile">
					Voir tous nos arbres
				</Link>
			</section>
		</main>
	);
}
