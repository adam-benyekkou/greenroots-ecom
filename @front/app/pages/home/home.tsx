import { Link } from "react-router";
import "./home.css";
import type { Route } from "./+types/home";

import homePageSeed from "./images/homePage_seed_growing.webp";
import TreeCard from "~/components/shared/components/TreeCard/TreeCard";
import type { TreeCardProps } from "@types";

export function meta() {
	return [
		{
			title:
				"GreenRoots - plant trees to fight deforestation",
		},
		{
			name: "description",
			content:
				"Sponsor a tree in one of our reforestation projects around the world",
		},
	];
}

// Loader Remix -> s'exécute côté serveur
export async function loader() {
	const apiUrl = import.meta.env.VITE_API_URL; // service docker backend

	try {
		const response = await fetch(`${apiUrl}/trees/homepage?limit=3`);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const result = await response.json();

		const transformedTrees: TreeCardProps[] = result.data.map((tree: any) => {
			const firstProject = tree.projects?.[0] ?? null;

			return {
				tree_id: tree.tree_id,
				name: tree.name,
				price: tree.price,
				image: tree.image,
				localization: firstProject?.localization?.continent || null,
				project_name: firstProject?.name || null,
				description: tree.description,
				created_at: tree.created_at,
				updated_at: tree.updated_at,
			};
		});

		return { trees: transformedTrees };
	} catch (err) {
		console.error("Error fetching trees in loader:", err);
		return {
			trees: [],
			error: err instanceof Error ? err.message : "Erreur inconnue",
		};
	}
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { trees, error } = loaderData;

	return (
		<main>
			<section className="hero-section">
				<h1>
					Participate in reforestation with <span>GreenRoots</span>
				</h1>
			</section>

			<section className="sub-hero-section-full-width">
				<div className="container-sub-hero">
					<img src={homePageSeed} alt="seed growing in the forest" />
					<div className="sub-hero-text-content">
						<p>All over the world, our projects are revitalizing the planet!</p>
						<h3>Make Our Planet Green Again!</h3>
						<Link to="/catalog" className="link-button-desktop">
							See all our trees
						</Link>
					</div>
				</div>
			</section>

			<section className="trees-section">
				<h2>Our trees around the world</h2>
				<div className="tree-card-container">
					<ul>
						{error ? (
							<li>
								<p>Error: {error}</p>
							</li>
						) : trees.length > 0 ? (
							trees.map((tree: TreeCardProps) => (
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
							))
						) : (
							<li>
								<p>No trees available at the moment.</p>
							</li>
						)}
					</ul>
				</div>
				<Link to="/catalog" className="link-button-mobile">
					See all our trees
				</Link>
			</section>
		</main>
	);
}
