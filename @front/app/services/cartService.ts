class CartService {
    constructor() {
        this.STORAGE_KEY = 'greenroots_cart';
    }

    get API_BASE() {
        return `${import.meta.env.VITE_API_URL}/cart`;
    }

    // log cart contents
    logCartContents(action, details = null) {
        const cart = this.getCart();
        console.log(`\n=== CART ${action.toUpperCase()} ===`);
        console.log(`Total items: ${this.getItemCount()}`);
        console.log(`Total value: €${cart.total.toFixed(2)}`);

        if (cart.items.length === 0) {
            console.log('Cart is empty');
        } else {
            console.log('Cart contents:');
            cart.items.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.name}`);
                console.log(`     Quantity: ${item.quantity}`);
                console.log(`     Price: €${item.price}`);
                console.log(`     Subtotal: €${(item.price * item.quantity).toFixed(2)}`);
            });
        }

        if (details) {
            console.log('Action details:', details);
        }
        console.log('=====================================\n');
    }

    // Get cart from localStorage
    getCart() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    items: parsed.items || [],
                    total: this.calculateTotal(parsed.items || []),
                    lastUpdated: parsed.lastUpdated || new Date().toISOString()
                };
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
        }

        return { items: [], total: 0, lastUpdated: new Date().toISOString() };
    }

    // Save cart to localStorage
    saveCart(cart) {
        try {
            const cartData = {
                items: cart.items,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartData));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }

    // Calculate total price
    calculateTotal(items) {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Add item to cart with API validation
    async addItem(tree_id, quantity) {
        try {
            // Convert to numbers to ensure correct data types
            const numericTreeId = Number(tree_id);
            const numericQuantity = Number(quantity);

            // Validate that conversion was successful
            if (isNaN(numericTreeId) || isNaN(numericQuantity)) {
                throw new Error('Invalid tree_id or quantity - must be valid numbers');
            }

            // First, validate with API
            const response = await fetch(this.API_BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tree_id: numericTreeId,
                    quantity: numericQuantity
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to validate item');
            }

            // If validation successful, add to localStorage
            const cart = this.getCart();
            const existingItemIndex = cart.items.findIndex(item => item.tree_id === numericTreeId);

            if (existingItemIndex > -1) {
                // Update existing item quantity
                const oldQuantity = cart.items[existingItemIndex].quantity;
                cart.items[existingItemIndex].quantity += numericQuantity;
                cart.items[existingItemIndex].price = result.tree.price; // Update price

                cart.total = this.calculateTotal(cart.items);
                this.saveCart(cart);

                // Log quantity change
                this.logCartContents('QUANTITY UPDATED', {
                    item: result.tree.name,
                    old_quantity: oldQuantity,
                    new_quantity: cart.items[existingItemIndex].quantity,
                    added: numericQuantity
                });
            } else {
                // Add new item
                const cartItem = {
                    tree_id: result.tree.tree_id,
                    name: result.tree.name,
                    description: result.tree.description,
                    price: result.tree.price,
                    image: result.tree.image,
                    quantity: numericQuantity
                };
                cart.items.push(cartItem);

                cart.total = this.calculateTotal(cart.items);
                this.saveCart(cart);

                // Log new item added
                this.logCartContents('ITEM ADDED', {
                    item: result.tree.name,
                    quantity: numericQuantity,
                    price: result.tree.price
                });
            }

            return {
                success: true,
                cart,
                message: 'Item added to cart successfully'
            };

        } catch (error) {
            console.error('Error adding item to cart:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Update item quantity with API validation
    async updateItem(tree_id, quantity) {
        try {
            // Convert to numbers to ensure correct data types
            const numericTreeId = Number(tree_id);
            const numericQuantity = Number(quantity);

            // Validate that conversion was successful
            if (isNaN(numericTreeId) || isNaN(numericQuantity)) {
                throw new Error('Invalid tree_id or quantity - must be valid numbers');
            }

            // Validate with API
            const response = await fetch(`${this.API_BASE}/${numericTreeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: numericQuantity })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to validate update');
            }

            // Update localStorage
            const cart = this.getCart();
            const itemIndex = cart.items.findIndex(item => item.tree_id === numericTreeId);

            if (itemIndex > -1) {
                const item = cart.items[itemIndex];
                const oldQuantity = item.quantity;

                if (numericQuantity <= 0) {
                    // Remove item if quantity is 0 or less
                    cart.items.splice(itemIndex, 1);

                    cart.total = this.calculateTotal(cart.items);
                    this.saveCart(cart);

                    this.logCartContents('ITEM REMOVED', {
                        item: item.name,
                        removed_quantity: oldQuantity,
                        reason: 'Quantity set to 0'
                    });
                } else {
                    cart.items[itemIndex].quantity = numericQuantity;
                    cart.items[itemIndex].price = result.tree.price; // Update price

                    cart.total = this.calculateTotal(cart.items);
                    this.saveCart(cart);

                    this.logCartContents('QUANTITY CHANGED', {
                        item: item.name,
                        old_quantity: oldQuantity,
                        new_quantity: numericQuantity,
                        change: numericQuantity - oldQuantity
                    });
                }
            }

            return {
                success: true,
                cart,
                message: numericQuantity <= 0 ? 'Item removed from cart' : 'Item quantity updated'
            };

        } catch (error) {
            console.error('Error updating cart item:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Remove item from cart with API validation
    async removeItem(tree_id) {
        try {
            // Convert to number to ensure correct data type
            const numericTreeId = Number(tree_id);

            // Validate that conversion was successful
            if (isNaN(numericTreeId)) {
                throw new Error('Invalid tree_id - must be a valid number');
            }

            // Get item details before removal for logging
            const cart = this.getCart();
            const itemToRemove = cart.items.find(item => item.tree_id === numericTreeId);

            // Validate with API
            const response = await fetch(`${this.API_BASE}/${numericTreeId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to validate removal');
            }

            // Remove from localStorage
            cart.items = cart.items.filter(item => item.tree_id !== numericTreeId);
            cart.total = this.calculateTotal(cart.items);
            this.saveCart(cart);

            this.logCartContents('ITEM DELETED', {
                item: itemToRemove?.name || 'Unknown item',
                removed_quantity: itemToRemove?.quantity || 0,
                reason: 'User removed item'
            });

            return {
                success: true,
                cart,
                message: 'Item removed from cart'
            };

        } catch (error) {
            console.error('Error removing cart item:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Validate entire cart before checkout
    async validateCart() {
        try {
            const cart = this.getCart();

            if (cart.items.length === 0) {
                return {
                    success: false,
                    error: 'Cart is empty'
                };
            }

            // Prepare cart items for validation
            const cartItems = cart.items.map(item => ({
                tree_id: item.tree_id,
                quantity: item.quantity,
                cart_price: item.price
            }));

            const response = await fetch(`${this.API_BASE}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cart_items: cartItems })
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle validation failures
                if (result.invalid_items && result.invalid_items.length > 0) {
                    // Update cart with current prices and remove invalid items
                    await this.handleValidationErrors(result);
                }
                return {
                    success: false,
                    validation: result,
                    error: result.message
                };
            }

            this.logCartContents('VALIDATED', {
                validation_status: 'Passed',
                total_amount: result.total_amount
            });

            return {
                success: true,
                validation: result,
                message: 'Cart validation successful'
            };

        } catch (error) {
            console.error('Error validating cart:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Handle validation errors by updating cart
    async handleValidationErrors(validationResult) {
        const cart = this.getCart();
        const updatedItems = [];
        const removedItems = [];

        // Keep only valid items and update prices
        for (const validItem of validationResult.valid_items) {
            const cartItem = cart.items.find(item => item.tree_id === validItem.tree_id);
            if (cartItem) {
                cartItem.price = validItem.current_price;
                updatedItems.push(cartItem);
            }
        }

        // Track removed items
        for (const invalidItem of validationResult.invalid_items) {
            const cartItem = cart.items.find(item => item.tree_id === invalidItem.tree_id);
            if (cartItem) {
                removedItems.push({
                    name: cartItem.name,
                    quantity: cartItem.quantity,
                    reason: invalidItem.error
                });
            }
        }

        cart.items = updatedItems;
        cart.total = this.calculateTotal(cart.items);
        this.saveCart(cart);

        this.logCartContents('VALIDATION ERRORS HANDLED', {
            removed_items: removedItems,
            items_updated: validationResult.valid_items.length,
            items_removed: removedItems.length
        });
    }

    // Refresh cart prices
    async refreshPrices() {
        try {
            const cart = this.getCart();

            if (cart.items.length === 0) {
                return { success: true, cart };
            }

            const tree_ids = cart.items.map(item => item.tree_id);
            const response = await fetch(`${this.API_BASE}/trees?tree_ids=${tree_ids.join(',')}`);

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to refresh prices');
            }

            // Update cart items with current prices
            const treesMap = new Map(result.trees.map(tree => [tree.tree_id, tree]));
            let pricesChanged = false;
            const priceChanges = [];

            cart.items.forEach(item => {
                const currentTree = treesMap.get(item.tree_id);
                if (currentTree && Math.abs(item.price - currentTree.price) > 0.01) {
                    priceChanges.push({
                        item: item.name,
                        old_price: item.price,
                        new_price: currentTree.price
                    });

                    item.price = currentTree.price;
                    item.name = currentTree.name; // Update name too
                    item.image = currentTree.image; // Update image too
                    pricesChanged = true;
                }
            });

            if (pricesChanged) {
                cart.total = this.calculateTotal(cart.items);
                this.saveCart(cart);

                this.logCartContents('PRICES REFRESHED', {
                    price_changes: priceChanges,
                    items_updated: priceChanges.length
                });
            }

            return {
                success: true,
                cart,
                pricesChanged,
                message: pricesChanged ? 'Cart prices updated' : 'Prices are current'
            };

        } catch (error) {
            console.error('Error refreshing cart prices:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Clear entire cart
    clearCart() {
        const cart = this.getCart();
        const itemCount = this.getItemCount();

        const emptyCart = { items: [], total: 0, lastUpdated: new Date().toISOString() };
        this.saveCart(emptyCart);

        this.logCartContents('CLEARED', {
            items_removed: itemCount,
            previous_total: cart.total
        });

        return emptyCart;
    }

    // Get item count
    getItemCount() {
        const cart = this.getCart();
        return cart.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Get cart total
    getCartTotal() {
        const cart = this.getCart();
        return cart.total;
    }
}

// Create singleton instance
const cartService = new CartService();

// Export for use in modules
export { cartService };
