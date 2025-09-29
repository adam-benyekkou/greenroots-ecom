import { Form, Link, useSubmit } from "react-router";
import type { Route } from "./+types/catalog";

import HomePageTreeCard from "../home/HomePageTreeCard/HomePageTreeCard";
import type { TreeHomePage } from "@types";

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
				"Découvrez notre sélection d'arbres à parrainer dans nos projets de reforestation à travers le monde. Choisissez une espèce, un lieu et participez dès aujourd’hui à la lutte contre la déforestation.",
		},
	];
}

export async function loader(params: Route.LoaderArgs) {
	const apiUrl = "http://localhost:3000";

	// get the url params
	const url = new URL(params.request.url);

	// get the params value in the URL (limit per page)
	const limitParam = url.searchParams.get("limit");
	// otherwise, the default value 6 is used
	const limit = limitParam ? Number.parseInt(limitParam) : 6;

	// get the params value in the URL (current page)
	const pageParam = url.searchParams.get("page");
	// otherwise, the default value 1 is used
	const page = pageParam ? Number.parseInt(pageParam) : 1;

	const continent = params.params.continent;

	let treeApiUrl = `${apiUrl}/api/trees`;

	if (continent) {
		treeApiUrl = `${apiUrl}/api/trees/continent/${continent}`;
	}
	// get data from api
	const response = await fetch(
		`${treeApiUrl}?limit=${limit}&page=${page}`,
	);

	// waits for the JSON response from the server and converts it into a JavaScript object
	const json = await response.json();
	// access to data = list of trees
	const trees = json.data;

	// access to pages = total number of available pages
	const pages = json.pagination.pages;

	return { trees, pages, page, limit, continent };
}

export default function Catalog(props: Route.ComponentProps) {
	const { loaderData } = props;

	return (
		<main>
			<h1>Nos arbres</h1>

			<details>
				<summary className="summary">Filtrer par continent</summary>
				<ul className="submenu">
					{continents.map((continent) => (
						<li key={continent.value}>
							<Link to={`/catalog/${continent.value}`}>{continent.label}</Link>
						</li>
					))}
				</ul>
			</details>

			
			<div className="tree-card-container">
				<ul>
					{loaderData.trees.map((tree: TreeHomePage) => (
						<li key={tree.tree_id}>
							<HomePageTreeCard
								treeId={tree.tree_id}
								name={tree.name}
								price={tree.price}
								image={tree.image}
								localization={tree.localization}
								project_name={tree.project_name}
							/>
						</li>
					))}
				</ul>
				<div>
					{loaderData.page > 1 ? (
						<Link
							to={`?page=${loaderData.page - 1}&limit=${loaderData.limit}`}
							className="navigation-pages-links"
						>
							Page précédente
						</Link>
					) : null}
				</div>
				<div>
					{loaderData.page < loaderData.pages ? (
						<Link
							to={`?page=${loaderData.page + 1}&limit=${loaderData.limit}`}
							className="navigation-pages-links"
						>
							Page suivante
						</Link>
					) : null}
				</div>
			</div>
		</main>
	);
}
