import Stripe from "stripe";
import "dotenv/config";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
	throw new Error("STRIPE_SECRET_KEY must be defined in your .env file");
}

const stripe = new Stripe(stripeSecretKey);

export default stripe;
