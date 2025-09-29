import type { Route } from "./+types/tree";
import { useState } from "react";
import { useNavigation } from "react-router";

import type { TreeHomePage } from "@types";

import localizationIcon from "./icons/localisation.svg";
import projectIcon from "./icons/project.svg";

import { QuantitySelector } from "~/components/shared/components/quantitySelector/quantitySelector";

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

export async function loader(args: Route.LoaderArgs) {
	const apiUrl = "http://localhost:3000";

	const { params } = args;
	const treeId = params.id;
	const response = await fetch(`${apiUrl}/api/trees/${treeId}`);

	const json = await response.json();

	const tree = json.data;
	const project = tree.projects?.[0] ?? null;

	return { tree, project };
}

export default function Tree(props: Route.ComponentProps) {
	const { tree, project } = props.loaderData;
	const [quantity, setQuantity] = useState(1);
	const navigation = useNavigation();
	const isSubmitting = navigation.formAction === "/add-to-shopping-cart";

	return (
		<main>
			<section className="tree-description">
				<img src={tree.image} alt={`représenation de ${tree.name}`} />
				<div className="tree-text-content">
					<h2>{tree.name}</h2>
					<div className="tree-localization">
						<img src={localizationIcon} alt="picto de lieu" />
						<p>{project.localization?.country}</p>
					</div>
					<div className="tree-project">
						<img src={projectIcon} alt="picto de lieu" />
						<p>{project.name}</p>
					</div>
					<p>{tree.description}</p>
					<p>€ {tree.price}</p>
					<div className="tree-add-to-cart">
						<QuantitySelector value={quantity} onChange={setQuantity} />
						<button
							type="submit"
							className="add-cart-button"
							disabled={isSubmitting}
						>
							Ajouter au panier
						</button>
					</div>
				</div>
			</section>
			<section className="project-description">
				<img src={project.image} alt={`représenation de ${project.name}`} />
				<div className="project-text-content">
					<h2>{project.name}</h2>
					<p>{project.description}</p>
				</div>
			</section>
		</main>
	);
}
