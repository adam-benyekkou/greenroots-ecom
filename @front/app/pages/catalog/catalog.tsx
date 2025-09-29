import { Form, Link, useSubmit } from "react-router";
import type { Route } from "./+types/catalog";

import TreeCard from "~/components/shared/components/TreeCard/TreeCard";
import type { TreeCardProps } from "@types";

import "./catalog.css";

import { continents } from "~/continents";

export function meta() {
	return [
		{
			title: "GreenRoots - catalogue d'arbres",
		},
		{
			name: "description",
			content:
				"Découvrez notre sélection d'arbres à parrainer dans nos projets de reforestation à travers le monde. Choisissez une espèce, un lieu et participez dès aujourd'hui à la lutte contre la déforestation.",
		},
	];
}

export async function loader(params: Route.LoaderArgs) {
	// Use environment variable for API URL
	const apiUrl = import.meta.env.VITE_API_URL;

	// get the url params
	const url = new URL(params.request.url);

	// get the params value in the URL (limit per page)
	const limitParam = url.searchParams.get("limit");
	// Change default limit to 6 cards per page
	const limit = limitParam ? Number.parseInt(limitParam) : 6;

	// get the params value in the URL (current page)
	const pageParam = url.searchParams.get("page");
	// otherwise, the default value 1 is used
	const page = pageParam ? Number.parseInt(pageParam) : 1;

	const continent = params.params.continent;

	let treeApiUrl = `${apiUrl}/trees`;

	if (continent) {
		treeApiUrl = `${apiUrl}/trees/continent/${continent}`;
	}

	try {
		// get data from api
		const response = await fetch(`${treeApiUrl}?limit=${limit}&page=${page}`);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		// waits for the JSON response from the server and converts it into a JavaScript object
		const json = await response.json();

		// Transformer les données pour correspondre à TreeCardProps
		const adaptedTrees = json.data.map((tree: any) => ({
			tree_id: tree.tree_id,
			name: tree.name,
			price: tree.price,
			image: tree.image,
			localization: tree.projects?.[0]?.localization?.country || 'Non spécifié',
			project_name: tree.projects?.[0]?.name || 'Projet général'
		}));

		// access to pages = total number of available pages
		const pages = json.pagination?.pages || 1;

		return { trees: adaptedTrees, pages, page, limit, continent };
	} catch (error) {
		console.error('Loader error:', error);
		return {
			trees: [],
			pages: 1,
			page,
			limit,
			continent
		};
	}
}

export default function Catalog(props: Route.ComponentProps) {
	const { loaderData } = props;

	// Mapping pour afficher les noms français des continents
	const continentNames: Record<string, string> = {
		'europe': 'Europe',
		'asie': 'Asie',
		'amerique-nord': 'Amérique du Nord',
		'amerique-sud': 'Amérique du Sud',
		'afrique': 'Afrique',
		'oceanie': 'Océanie'
	};

	const continentName = loaderData.continent
		? continentNames[loaderData.continent] || loaderData.continent
		: null;

	const pageTitle = continentName
		? `Nos arbres - ${continentName}`
		: 'Nos arbres - Monde entier';

	return (
		<main>
			<h1>{pageTitle}</h1>

			<div className="tree-card-container">
				{loaderData.trees.length > 0 ? (
					<div className="tree-cards-grid">
						{loaderData.trees.map((tree: TreeCardProps) => (
							<div key={tree.tree_id}>
								<TreeCard
									tree_id={tree.tree_id}
									name={tree.name}
									price={tree.price}
									image={tree.image}
									localization={tree.localization}
									project_name={tree.project_name}
								/>
							</div>
						))}
					</div>
				) : (
					<div className="empty-state">
						<h2>Aucun arbre trouvé</h2>
						<p>Aucun arbre n'est disponible pour cette région actuellement.</p>
						<Link to="/catalog" className="navigation-pages-links">
							Voir tous les arbres
						</Link>
					</div>
				)}

				{loaderData.trees.length > 0 && loaderData.pages > 1 && (
					<div className="pagination">
						{loaderData.page > 1 && (
							<Link
								to={`?page=${loaderData.page - 1}&limit=${loaderData.limit}`}
								className="navigation-pages-links"
							>
								← Page précédente
							</Link>
						)}

						{loaderData.page < loaderData.pages && (
							<Link
								to={`?page=${loaderData.page + 1}&limit=${loaderData.limit}`}
								className="navigation-pages-links"
							>
								Page suivante →
							</Link>
						)}
					</div>
				)}
			</div>
		</main>
	);
}