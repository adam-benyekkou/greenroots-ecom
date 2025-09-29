import { useState } from "react";
import type { TreeCardProps } from "@types";
import { QuantitySelector } from "~/components/shared/components/quantitySelector/quantitySelector";
import "./TreeCard.css";
import { Form, useNavigation, Link } from "react-router";
import localizationIcon from "./icons/localization.svg";
import projectIcon from "./icons/project.svg";

import { cartService } from "~/services/cartService";

function TreeCard({
                      tree_id,
                      name,
                      price,
                      image,
                      localization,
                      project_name,
                  }: TreeCardProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState<string | null>(null);
    const [cartError, setCartError] = useState<string | null>(null);

    const navigation = useNavigation();
    const isSubmitting = navigation.formAction === "/add-to-shopping-cart";

    // Déterminer le continent basé sur la localisation (noms français de la DB)
    const getContinent = (location: string | undefined): string => {
        if (!location) return 'Europe'; // Par défaut si pas de localisation

        const locationLower = location.toLowerCase();

        // Mapping exact selon vos données de base (pays français -> continents anglais pour CSS)
        const locationToContinentMap: Record<string, string> = {
            // Données existantes
            'france': 'Europe',
            'madagascar': 'Africa',
            'brésil': 'South America',

            // Nouvelles données (noms français)
            'indonésie': 'Asia',
            'myanmar': 'Asia',
            'philippines': 'Asia',
            'colombie': 'South America',
            'pérou': 'South America',
            'bolivie': 'South America',
            'canada': 'North America',
            'états-unis': 'North America',
            'australie': 'Australia',
            'roumanie': 'Europe',
            'portugal': 'Europe',
            'sénégal': 'Africa',
            'mali': 'Africa',
        };

        // Chercher une correspondance exacte
        const continent = locationToContinentMap[locationLower];
        if (continent) {
            return continent;
        }

        // Fallback avec mots-clés (noms de continents français dans votre DB)
        if (locationLower.includes('europe')) return 'Europe';
        if (locationLower.includes('asie') || locationLower.includes('asia')) return 'Asia';
        if (locationLower.includes('amérique du nord') || locationLower.includes('north america')) return 'North America';
        if (locationLower.includes('amérique du sud') || locationLower.includes('south america')) return 'South America';
        if (locationLower.includes('afrique') || locationLower.includes('africa')) return 'Africa';
        if (locationLower.includes('australie') || locationLower.includes('australia')) return 'Australia';

        return 'Europe'; // Par défaut
    };

    const continent = getContinent(localization);

    // Handle add to cart functionality
    const handleAddToCart = async (event: React.FormEvent) => {
        event.preventDefault();

        setIsAddingToCart(true);
        setCartMessage(null);
        setCartError(null);

        try {
            const result = await cartService.addItem(tree_id, quantity);

            if (result.success) {
                setCartMessage(`${quantity} ${name}${quantity > 1 ? 's' : ''} ajouté${quantity > 1 ? 's' : ''} au panier !`);

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
        <Form
            className="tree-card"
            onSubmit={handleAddToCart}
            data-continent={continent}
        >
            <img src={image} alt={`${name} - Arbre de ${localization}`} />
            <div className="tree-card-text-content">
                <div className="tree-card-name-price">
                    <Link to={`/tree/${tree_id}`} className="tree-name-link">
                        <h3>{name}</h3>
                    </Link>
                    <p>{price} €</p>
                </div>

                <div className="tree-card-localization-project">
                    <div className="tree-card-localization">
                        <img
                            src={localizationIcon}
                            alt="Localisation"
                        />
                        <p>{localization}</p>
                    </div>
                    <div className="tree-card-project">
                        <img src={projectIcon} alt="Projet" />
                        <p>{project_name}</p>
                    </div>
                </div>

                {cartMessage && (
                    <div className="cart-success-message">
                        {cartMessage}
                    </div>
                )}

                {cartError && (
                    <div className="cart-error-message">
                        {cartError}
                    </div>
                )}

                <div className="tree-card-add-cart">
                    <QuantitySelector
                        value={quantity}
                        onChange={setQuantity}
                        disabled={isSubmitting || isAddingToCart}
                        max={10}
                    />
                    <input name="quantity" value={quantity} type="hidden" />
                    <input name="treeId" value={tree_id} type="hidden" />
                    <button
                        type="submit"
                        className="add-cart-button"
                        disabled={isSubmitting || isAddingToCart}
                    >
                        {isAddingToCart ? "Ajout..." : "Ajouter au panier"}
                    </button>
                </div>
            </div>
        </Form>
    );
}

export default TreeCard;