import type { Request, Response } from 'express';
import stripe from '../Services/stripeService.js';
import { paymentModel } from '../Models/paymentModel.js';
import { orderLineModel } from '../Models/orderLineModel.js';
import { orderModel } from '../Models/orderModel.js';
import { PaymentStatus } from '../../@types/PaymentTransaction.js';

const paymentController = {
    async createPaymentIntent(req: Request, res: Response) {
        try {
            const { currency = 'eur', order_id, payment_method_types } = req.body;
            const { user } = req;

            if (!order_id) {
              return res.status(400).json({
                error: 'Order ID is required'
              });
            }

            const order = await orderModel.findById(order_id);

            if (!order) {
              return res.status(404).json({
                error: 'Order not found'
              });
            }

            if (user?.role !== 'admin' && order.user_id !== user?.user_id) {
              return res.status(403).json({
                error: 'Access denied: You can only create payments for your own orders'
              });
            }

            const amount = await orderLineModel.calculateOrderTotal(order_id);

            if (amount <= 0) {
                return res.status(400).json({
                    error: 'Invalid order: no items found or total amount is zero'
                });
            }

            const paymentIntentData: any = {
                amount: Math.round(amount * 100),
                currency,
                metadata: {
                    order_id: order_id.toString()
                }
            };

            if (payment_method_types && Array.isArray(payment_method_types)) {
                paymentIntentData.payment_method_types = payment_method_types;
            } else {
                paymentIntentData.automatic_payment_methods = {
                    enabled: true,
                };
            }

            const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

            await paymentModel.create({
                order_id,
                stripe_payment_id: paymentIntent.id,
                amount,
                status: PaymentStatus.PENDING
            });

            res.json({
                client_secret: paymentIntent.client_secret,
                payment_intent_id: paymentIntent.id
            });
        } catch (error) {
            console.error('Error creating payment intent:', error);
            res.status(500).json({
                error: 'Failed to create payment intent'
            });
        }
    },

    async webhook(req: Request, res: Response) {
        const stripeSignature = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!stripeSignature || !endpointSecret) {
            return res.status(400).json({ error: 'Missing signature or endpoint secret' });
        }

        try {
            const event = stripe.webhooks.constructEvent(req.body, stripeSignature, endpointSecret);

            switch (event.type) {
                case 'payment_intent.created':
                    const createdPayment = event.data.object as any;
                    console.log(`Payment intent created: ${createdPayment.id}`);
                    break;

                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object as any;
                    await paymentModel.updateByStripeId(paymentIntent.id, {
                        status: PaymentStatus.COMPLETED
                    });
                    console.log(`Payment succeeded: ${paymentIntent.id}`);
                    break;

                case 'payment_intent.payment_failed':
                    const failedPayment = event.data.object as any;
                    await paymentModel.updateByStripeId(failedPayment.id, {
                        status: PaymentStatus.FAILED
                    });
                    console.log(`Payment failed: ${failedPayment.id}`);
                    break;

                case 'payment_intent.requires_action':
                    const actionRequired = event.data.object as any;
                    console.log(`Payment requires action: ${actionRequired.id}`);
                    break;

                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            res.json({ received: true });
        } catch (error) {
            console.error('Webhook error:', error);
            res.status(400).json({ error: 'Webhook error' });
        }
    },

    async getPaymentStatus(req: Request, res: Response) {
        try {
            const { order_id } = req.params;
            const { user } = req;

            if (!order_id) {
                return res.status(400).json({
                    error: 'Order ID is required'
                });
            }

            const order = await orderModel.findById(Number(order_id));

            if (!order) {
                return res.status(404).json({
                    error: 'Order not found'
                });
            }

            if (user?.role !== 'admin' && order.user_id !== user?.user_id) {
                return res.status(403).json({
                    error: 'Access denied: You can only view payment status for your own orders'
                });
            }

            const payment = await paymentModel.findByOrderId(Number(order_id));

            if (!payment) {
                return res.status(404).json({
                    error: 'Payment not found'
                });
            }

            res.json(payment);
        } catch (error) {
            console.error('Error getting payment status:', error);
            res.status(500).json({
                error: 'Failed to get payment status'
            });
        }
    },

    async getPaymentHistory(req: Request, res: Response) {
        try {
            const { user } = req;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;

            if (!user) {
                return res.status(401).json({
                    error: 'User not authenticated'
                });
            }

            if (typeof user.user_id !== 'number') {
                return res.status(400).json({
                    error: 'Invalid user ID'
                });
            }

            const paymentHistory = await paymentModel.getPaymentHistoryByUserId(
                user.user_id,
                limit,
                offset
            );

            res.json(paymentHistory);
        } catch (error) {
            console.error('Error getting payment history:', error);
            res.status(500).json({
                error: 'Failed to get payment history'
            });
        }
    },

    // Route de test pour simuler le paiement sans front
    async testPayment(req: Request, res: Response) {
        try {
            const { payment_intent_id } = req.body;

            if (!payment_intent_id) {
                return res.status(400).json({
                    error: 'Payment intent ID is required'
                });
            }

            // Simuler l'ajout d'une méthode de paiement de test
            const paymentIntent = await stripe.paymentIntents.confirm(payment_intent_id, {
                payment_method: 'pm_card_visa', // Carte de test Stripe
                return_url: `${process.env.FRONTEND_URL}/payment/return`
            });

            res.json({
                status: paymentIntent.status,
                payment_intent_id: paymentIntent.id
            });
        } catch (error) {
            console.error('Error testing payment:', error);
            res.status(500).json({
                error: 'Failed to test payment'
            });
        }
    }
};

export { paymentController };
