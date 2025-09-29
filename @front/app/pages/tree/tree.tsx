import type { Route } from "./+types/tree";
import { useState } from "react";
import { useNavigation } from "react-router";

// Icons
import localizationIcon from "./icons/localisation.svg";
import projectIcon from "./icons/project.svg";

// Components
import { QuantitySelector } from "~/components/shared/components/quantitySelector/quantitySelector";

// Services
import { cartService } from "../../services/cartService";

// Styles
import "./tree.css";

export function meta() {
	return [
		{
			title: "GreenRoots - Catalogue d'arbres",
		},
		{
			name: "description",
			content:
				"Découvrez notre sélection d'arbres à parrainer dans nos projets de reforestation à travers le monde. Choisissez une espèce, un lieu et participez dès aujourd'hui à la lutte contre la déforestation.",
		},
	];
}

export async function loader(args: Route.LoaderArgs) {
	// Use environment variable for API URL
	const apiUrl = import.meta.env.VITE_API_URL;
	const { params } = args;
	const treeId = params.id;

	const response = await fetch(`${apiUrl}/trees/${treeId}`);
	const json = await response.json();

	const tree = json.data;
	const project = tree.projects?.[0] ?? null;

	return { tree, project };
}

export default function Tree(props: Route.ComponentProps) {
	const { tree, project } = props.loaderData;

	// État local
	const [quantity, setQuantity] = useState(1);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [cartMessage, setCartMessage] = useState<string | null>(null);
	const [cartError, setCartError] = useState<string | null>(null);

	const navigation = useNavigation();
	const isSubmitting = navigation.formAction === "/add-to-shopping-cart";

	// Gestion du panier
	const handleAddToCart = async () => {
		setIsAddingToCart(true);
		setCartMessage(null);
		setCartError(null);

		try {
			const result = await cartService.addItem(tree.tree_id, quantity);

			if (result.success) {
				setCartMessage(`${quantity} ${tree.name}(s) ajouté(s) au panier !`);

				// Message de succès disparaît après 3 secondes
				setTimeout(() => setCartMessage(null), 3000);
			} else {
				setCartError(result.error || "Erreur lors de l'ajout au panier");
			}
		} catch (error) {
			console.error("Erreur ajout panier:", error);
			setCartError("Erreur de connexion. Veuillez réessayer.");
		} finally {
			setIsAddingToCart(false);
		}
	};

	return (
		<main className="tree-page">
			{/* Section principale : produit */}
			<section className="tree-product">
				<div className="tree-image-container">
					<img
						src={tree.image}
						alt={`${tree.name} - Arbre à parrainer`}
						loading="lazy"
						className="tree-image"
					/>
				</div>

				<div className="tree-details">
					<div className="tree-header-info">
						<h1
							className={`tree-title continent-${project?.localization?.continent?.toLowerCase()?.replace(/\s+/g, "-")?.replace("é", "e") || "default"}`}
						>
							{tree.name}
						</h1>

						<div className="tree-meta">
							<div className="tree-location">
								<img src={localizationIcon} alt="" aria-hidden="true" />
								<span>{project?.localization?.country}</span>
							</div>
							<div className="tree-project-ref">
								<img src={projectIcon} alt="" aria-hidden="true" />
								<span>{project?.name}</span>
							</div>
						</div>
					</div>

					<div className="tree-description">
						<p>{tree.description}</p>
					</div>

					<div className="tree-price">
						<span className="price-value">{tree.price}€</span>
						<span className="price-unit">par arbre</span>
					</div>

					{/* Messages du panier */}
					{cartMessage && (
						<div
							className="cart-message cart-success"
							role="status"
							aria-live="polite"
						>
							✓ {cartMessage}
						</div>
					)}
					{cartError && (
						<div
							className="cart-message cart-error"
							role="alert"
							aria-live="assertive"
						>
							⚠ {cartError}
						</div>
					)}

					{/* Actions d'achat */}
					<div className="tree-purchase">
						<div className="quantity-section">
							<label htmlFor="quantity" className="quantity-label">
								Quantité :
							</label>
							<QuantitySelector
								value={quantity}
								onChange={setQuantity}
								id="quantity"
							/>
						</div>

						<button
							type="button"
							className="add-to-cart-btn"
							disabled={isSubmitting || isAddingToCart}
							onClick={handleAddToCart}
							aria-describedby={cartError ? "cart-error" : undefined}
						>
							{isAddingToCart ? (
								<>
									<span className="loading-spinner" aria-hidden="true" />
									Ajout en cours...
								</>
							) : (
								"Ajouter au panier"
							)}
						</button>
					</div>
				</div>
			</section>

			{/* Section projet associé */}
			{project && (
				<section className="project-section">
					<div className="project-content">
						<div className="project-text">
							<h2 className="project-title">Projet de reforestation</h2>
							<h3 className="project-name">{project.name}</h3>
							<p className="project-description">{project.description}</p>

							<div className="project-impact">
								<div className="impact-item">
									<span className="impact-number">+1</span>
									<span className="impact-label">Arbre planté</span>
								</div>
								<div className="impact-item">
									<span className="impact-number">≈ 22kg</span>
									<span className="impact-label">CO₂ absorbé/an</span>
								</div>
							</div>
						</div>

						<div className="project-image-container">
							<img
								src={project.image}
								alt={`Projet ${project.name}`}
								loading="lazy"
								className="project-image"
							/>
						</div>
					</div>
				</section>
			)}
		</main>
	);
}
