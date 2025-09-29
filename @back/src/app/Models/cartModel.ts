import type { QueryResult } from 'pg';
import type { Tree } from '../../@types/Tree.js';
import DatabaseService from '../Services/database.js';

interface CartValidationItem {
    tree_id: number;
    quantity: number;
    cart_price: number;
}

interface CartValidationResult {
    tree_id: number;
    valid: boolean;
    current_price: number;
    cart_price: number;
    price_changed: boolean;
    quantity: number;
    line_total: number;
    tree_name?: string;
    tree_image?: string;
    available: boolean;
    error?: string;
}

interface CartTree extends Tree {
    available: boolean;
}

class CartModel {
    private db = DatabaseService;

    // Validate a single tree for cart operations
    async validateTreeForCart(tree_id: number): Promise<CartTree | null> {
        try {
            const query = `
                SELECT tree_id, name, description, price, image, created_at, updated_at 
                FROM tree 
                WHERE tree_id = $1
            `;
            const result: QueryResult<Tree> = await this.db.query(query, [tree_id]);

            if (result.rows.length === 0) {
                return null;
            }

            const tree = result.rows[0];

            // Add availability check (you can customize this logic)
            return {
                ...tree,
                available: true // For now, assume all trees are available
            };
        } catch (error) {
            throw new Error(`Error validating tree with ID ${tree_id}: ${error}`);
        }
    }

    // Get multiple trees by IDs for cart display
    async getTreesByIds(tree_ids: number[]): Promise<CartTree[]> {
        try {
            if (tree_ids.length === 0) {
                return [];
            }

            // Create placeholders for the IN clause
            const placeholders = tree_ids.map((_, index) => `$${index + 1}`).join(', ');

            const query = `
                SELECT tree_id, name, description, price, image, created_at, updated_at 
                FROM tree 
                WHERE tree_id IN (${placeholders})
                ORDER BY name
            `;

            const result: QueryResult<Tree> = await this.db.query(query, tree_ids);

            return result.rows.map(tree => ({
                ...tree,
                available: true // Add availability logic here if needed
            }));
        } catch (error) {
            throw new Error(`Error fetching trees by IDs: ${error}`);
        }
    }

    // Validate entire cart before checkout
    async validateCart(cartItems: CartValidationItem[]): Promise<CartValidationResult[]> {
        try {
            if (cartItems.length === 0) {
                return [];
            }

            const tree_ids = cartItems.map(item => item.tree_id);
            const trees = await this.getTreesByIds(tree_ids);

            // Create a map for quick lookup
            const treesMap = new Map(trees.map(tree => [tree.tree_id, tree]));

            const validationResults: CartValidationResult[] = [];

            for (const cartItem of cartItems) {
                const tree = treesMap.get(cartItem.tree_id);

                if (!tree) {
                    validationResults.push({
                        tree_id: cartItem.tree_id,
                        valid: false,
                        current_price: 0,
                        cart_price: cartItem.cart_price,
                        price_changed: false,
                        quantity: cartItem.quantity,
                        line_total: 0,
                        available: false,
                        error: 'Tree not found'
                    });
                    continue;
                }

                const priceChanged = Math.abs(Number(tree.price) - cartItem.cart_price) > 0.01;
                const currentPrice = Number(tree.price);
                const lineTotal = currentPrice * cartItem.quantity;

                const validation: CartValidationResult = {
                    tree_id: cartItem.tree_id,
                    valid: tree.available && !priceChanged,
                    current_price: currentPrice,
                    cart_price: cartItem.cart_price,
                    price_changed: priceChanged,
                    quantity: cartItem.quantity,
                    line_total: lineTotal,
                    tree_name: tree.name,
                    tree_image: tree.image || undefined,
                    available: tree.available
                };

                if (!tree.available) {
                    validation.error = 'Tree is no longer available';
                } else if (priceChanged) {
                    validation.error = 'Price has changed since item was added to cart';
                }

                validationResults.push(validation);
            }

            return validationResults;
        } catch (error) {
            throw new Error(`Error validating cart: ${error}`);
        }
    }

    // Get tree details with current pricing for cart operations
    async getTreeForCartOperation(tree_id: number, requested_quantity: number): Promise<{
        tree: CartTree | null;
        total_price: number;
        valid_quantity: boolean;
    }> {
        try {
            const tree = await this.validateTreeForCart(tree_id);

            if (!tree) {
                return {
                    tree: null,
                    total_price: 0,
                    valid_quantity: false
                };
            }

            const validQuantity = requested_quantity > 0 && Number.isInteger(requested_quantity);
            const totalPrice = validQuantity ? Number(tree.price) * requested_quantity : 0;

            return {
                tree,
                total_price: totalPrice,
                valid_quantity: validQuantity
            };
        } catch (error) {
            throw new Error(`Error getting tree for cart operation: ${error}`);
        }
    }

    // Check if trees are still available and get updated prices
    async refreshCartPrices(tree_ids: number[]): Promise<{
        tree_id: number;
        current_price: number;
        available: boolean;
        name: string;
        image?: string;
    }[]> {
        try {
            const trees = await this.getTreesByIds(tree_ids);

            return trees.map(tree => ({
                tree_id: tree.tree_id,
                current_price: Number(tree.price),
                available: tree.available,
                name: tree.name,
                image: tree.image || undefined
            }));
        } catch (error) {
            throw new Error(`Error refreshing cart prices: ${error}`);
        }
    }

    // Get cart summary with totals
    async getCartSummary(cartItems: CartValidationItem[]): Promise<{
        valid_items: CartValidationResult[];
        invalid_items: CartValidationResult[];
        total_amount: number;
        total_items: number;
        cart_valid: boolean;
    }> {
        try {
            const validationResults = await this.validateCart(cartItems);

            const validItems = validationResults.filter(item => item.valid);
            const invalidItems = validationResults.filter(item => !item.valid);

            const totalAmount = validItems.reduce((sum, item) => sum + item.line_total, 0);
            const totalItemCount = validItems.reduce((sum, item) => sum + item.quantity, 0);

            return {
                valid_items: validItems,
                invalid_items: invalidItems,
                total_amount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
                total_items: totalItemCount,
                cart_valid: invalidItems.length === 0 && validItems.length > 0
            };
        } catch (error) {
            throw new Error(`Error generating cart summary: ${error}`);
        }
    }

    // Check stock availability (if you implement inventory management)
    async checkStockAvailability(tree_id: number, requested_quantity: number): Promise<{
        available: boolean;
        stock_quantity?: number;
        max_available?: number;
    }> {
        try {
            // For now, assume unlimited stock
            // You can implement actual stock checking here if needed
            const tree = await this.validateTreeForCart(tree_id);

            if (!tree) {
                return {
                    available: false
                };
            }

            return {
                available: tree.available,
                // stock_quantity: 999, // If you have a stock table
                // max_available: Math.min(999, requested_quantity)
            };
        } catch (error) {
            throw new Error(`Error checking stock availability: ${error}`);
        }
    }



    // Validate cart item before adding/updating
    async validateCartItem(tree_id: number, quantity: number): Promise<{
        valid: boolean;
        tree?: CartTree;
        error?: string;
        suggested_quantity?: number;
    }> {
        try {
            if (!Number.isInteger(quantity) || quantity <= 0) {
                return {
                    valid: false,
                    error: 'Quantity must be a positive integer'
                };
            }

            const tree = await this.validateTreeForCart(tree_id);

            if (!tree) {
                return {
                    valid: false,
                    error: 'Tree not found'
                };
            }

            if (!tree.available) {
                return {
                    valid: false,
                    tree,
                    error: 'Tree is not available'
                };
            }

            // Add any additional validation logic here
            // For example, maximum quantity per item, etc.
            const maxQuantityPerItem = 100; // Example limit
            if (quantity > maxQuantityPerItem) {
                return {
                    valid: false,
                    tree,
                    error: `Maximum quantity per item is ${maxQuantityPerItem}`,
                    suggested_quantity: maxQuantityPerItem
                };
            }

            return {
                valid: true,
                tree
            };
        } catch (error) {
            throw new Error(`Error validating cart item: ${error}`);
        }
    }
}

export { CartModel };
export type { CartValidationItem, CartValidationResult, CartTree };