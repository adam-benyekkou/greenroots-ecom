const Stripe = require('stripe');

// Check for API Key
if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ Error: STRIPE_SECRET_KEY environment variable is missing.');
    console.error('Usage: STRIPE_SECRET_KEY=sk_test_... node scripts/sync-stripe.js');
    process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const trees = [
    { name: 'Oak', price: 15.50 },
    { name: 'Baobab', price: 25.00 },
    { name: 'Eucalyptus', price: 30.00 },
    { name: 'Rosewood', price: 45.00 },
    { name: 'Dipterocarpus', price: 45.00 },
    { name: 'Burmese Teak', price: 38.00 },
    { name: 'Philippine Narra', price: 42.00 },
    { name: 'Brazilian Mahogany', price: 55.00 },
    { name: 'Cecropia', price: 25.00 },
    { name: 'Pau-Brasil', price: 48.00 },
    { name: 'Black Spruce', price: 28.00 },
    { name: 'Trembling Aspen', price: 22.00 },
    { name: 'Red Gum Eucalyptus', price: 35.00 },
    { name: 'Giant Banksia', price: 32.00 },
    { name: 'Romanian Oak', price: 30.00 },
    { name: 'Cork Oak', price: 40.00 },
    { name: 'Balanites', price: 20.00 },
    { name: 'Prosopis', price: 18.00 }
];

async function sync() {
    console.log('🔄 Connecting to Stripe...');
    console.log(`📋 Found ${trees.length} trees to sync.\n`);

    console.log('-- RUN THIS SQL --------');

    for (const tree of trees) {
        try {
            // 1. Create Product & Price
            const product = await stripe.products.create({
                name: tree.name,
                default_price_data: {
                    currency: 'eur',
                    unit_amount: Math.round(tree.price * 100), // cents
                },
            });

            // 2. Get the Price ID (default_price is usually expanded or ID)
            // If passing default_price_data, response.default_price is the ID.
            const priceId = product.default_price;

            // 3. Output SQL
            console.log(`UPDATE tree SET price_id = '${priceId}' WHERE name = '${tree.name}';`);

        } catch (error) {
            console.error(`❌ Failed to create ${tree.name}:`, error.message);
        }
    }

    console.log('------------------------');
    console.log('\n✅ Done! Copy the SQL above and run it in your database.');
}

sync();
