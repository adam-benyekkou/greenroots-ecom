import type { Route } from "./+types/tree";
import { useState } from "react";
import { useNavigation } from "react-router";

import localizationIcon from "./icons/localisation.svg";
import projectIcon from "./icons/project.svg";

import { QuantitySelector } from "~/components/shared/components/quantitySelector/quantitySelector";

// Import your cart service
import { cartService } from "../../services/cartService";

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

export async function loader(args: Route.LoaderArgs) {
    const apiUrl = "http://backend:3001";

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
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState<string | null>(null);
    const [cartError, setCartError] = useState<string | null>(null);

    const navigation = useNavigation();
    const isSubmitting = navigation.formAction === "/add-to-shopping-cart";

    // Handle add to cart functionality
    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        setCartMessage(null);
        setCartError(null);

        try {
            const result = await cartService.addItem(tree.tree_id, quantity);

            if (result.success) {
                setCartMessage(`${quantity} ${tree.name}(s) ajouté(s) au panier !`);

                // Optional: Reset quantity after successful add
                // setQuantity(1);

                // Optional: Show success message for a few seconds then hide
                setTimeout(() => {
                    setCartMessage(null);
                }, 3000);

            } else {
                setCartError(result.error || "Erreur lors de l'ajout au panier");
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setCartError("Erreur de connexion. Veuillez réessayer.");
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <main>
            <section className="tree-description">
                <img src={tree.image} alt={`représenation de ${tree.name}`} />
                <div className="tree-text-content">
                    <h2>{tree.name}</h2>
                    <div className="tree-localization">
                        <img src={localizationIcon} alt="picto de lieu" />
                        <p>{project?.localization?.country}</p>
                    </div>
                    <div className="tree-project">
                        <img src={projectIcon} alt="picto de lieu" />
                        <p>{project?.name}</p>
                    </div>
                    <p>{tree.description}</p>
                    <p>€ {tree.price}</p>

                    {/* Cart messages */}
                    {cartMessage && (
                        <div className="cart-success-message" style={{ color: 'green', marginBottom: '10px' }}>
                            {cartMessage}
                        </div>
                    )}
                    {cartError && (
                        <div className="cart-error-message" style={{ color: 'red', marginBottom: '10px' }}>
                            {cartError}
                        </div>
                    )}

                    <div className="tree-add-to-cart">
                        <QuantitySelector value={quantity} onChange={setQuantity} />
                        <button
                            type="button"
                            className="add-cart-button"
                            disabled={isSubmitting || isAddingToCart}
                            onClick={handleAddToCart}
                        >
                            {isAddingToCart ? "Ajout en cours..." : "Ajouter au panier"}
                        </button>
                    </div>
                </div>
            </section>
            <section className="project-description">
                <img src={project?.image} alt={`représenation de ${project?.name}`} />
                <div className="project-text-content">
                    <h2>{project?.name}</h2>
                    <p>{project?.description}</p>
                </div>
            </section>
        </main>
    );
}