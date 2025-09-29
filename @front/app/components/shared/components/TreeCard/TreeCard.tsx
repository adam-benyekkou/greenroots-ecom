import { useState } from "react";
import type { HomePageTreeCardProps } from "@types";
import { QuantitySelector } from "~/components/shared/components/quantitySelector/quantitySelector";
import "./TreeCard.css";
import { Form, useNavigation } from "react-router";
import localizationIcon from "./icons/localization.svg";
import projectIcon from "./icons/project.svg";

function TreeCard({
	treeId,
	name,
	price,
	image,
	localization,
	project_name,
}: HomePageTreeCardProps) {
	const [quantity, setQuantity] = useState(1);
	const navigation = useNavigation();
	const isSubmitting = navigation.formAction === "/add-to-shopping-cart";
	return (
		<Form className="tree-card" action="/add-to-shopping-cart" method="POST">
			<img src={image} alt={name} />
			<div className="tree-card-text-content">
				<div className="tree-card-name-price">
					<h3>{name}</h3>
					<p>Prix : {price} €</p>
				</div>
				<div className="tree-card-localization-project">
					<div className="tree-card-localization">
						<img
							src={localizationIcon}
							alt="picto représentant la localisation"
						/>
						<p>Localisation : {localization}</p>
					</div>
					<div className="tree-card-project">
						<img src={projectIcon} alt="picto représentant le projet" />
						<p>Projet : {project_name}</p>
					</div>
				</div>
				<div className="tree-card-add-cart">
					<QuantitySelector value={quantity} onChange={setQuantity} />
					<input name="quantity" value={quantity} type="hidden" />
					<input name="treeId" value={treeId} type="hidden" />
					<button
						type="submit"
						className="add-cart-button"
						disabled={isSubmitting}
					>
						Ajouter au panier
					</button>
				</div>
			</div>
		</Form>
	);
}

export default TreeCard;
