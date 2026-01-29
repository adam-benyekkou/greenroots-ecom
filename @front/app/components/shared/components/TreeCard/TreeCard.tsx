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

    // Determine continent based on localization
    const getContinent = (location: string | undefined): string => {
        if (!location) return 'Europe'; // Default if no localization

        const locationLower = location.toLowerCase();

        // Mapping based on database data (country -> continent)
        const locationToContinentMap: Record<string, string> = {
            // Existing data
            'france': 'Europe',
            'madagascar': 'Africa',
            'brazil': 'South America',

            // New data
            'indonesia': 'Asia',
            'myanmar': 'Asia',
            'philippines': 'Asia',
            'colombia': 'South America',
            'peru': 'South America',
            'bolivia': 'South America',
            'canada': 'North America',
            'usa': 'North America',
            'australia': 'Australia',
            'romania': 'Europe',
            'portugal': 'Europe',
            'senegal': 'Africa',
            'mali': 'Africa',
        };

        // Search for exact match
        const continent = locationToContinentMap[locationLower];
        if (continent) {
            return continent;
        }

        // Fallback with keywords
        if (locationLower.includes('europe')) return 'Europe';
        if (locationLower.includes('asia')) return 'Asia';
        if (locationLower.includes('north america')) return 'North America';
        if (locationLower.includes('south america')) return 'South America';
        if (locationLower.includes('africa')) return 'Africa';
        if (locationLower.includes('australia')) return 'Australia';

        return 'Europe'; // Default
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
                setCartMessage(`${quantity} ${name}${quantity > 1 ? 's' : ''} added to cart!`);

                setTimeout(() => {
                    setCartMessage(null);
                }, 3000);

            } else {
                setCartError(result.error || "Error adding to cart");
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setCartError("Connection error. Please try again.");
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
            <div className="tree-image-container">
                <img src={image} alt={`${name} - Tree from ${localization}`} />
            </div>
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
                            alt="Localization"
                        />
                        <p>{localization}</p>
                    </div>
                    <div className="tree-card-project">
                        <img src={projectIcon} alt="Project" />
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
                        {isAddingToCart ? "Adding..." : "Add to cart"}
                    </button>
                </div>
            </div>
        </Form>
    );
}

export default TreeCard;