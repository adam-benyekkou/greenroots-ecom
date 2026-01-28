// app/Services/email.service.ts

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

interface WelcomeEmailData {
    email: string;
    firstName: string;
    lastName: string;
}

interface InvoiceEmailData {
    email: string;
    firstName: string;
    lastName: string;
    orderId: number;
    paymentIntentId: string;
    orderLines: any[];
    totalAmount: number;
}

class EmailService {
    private transporter: Transporter;

    constructor() {
        // Configuration du transporteur
        const config: EmailConfig = {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true pour le port 465, false pour les autres
            auth: {
                user: process.env.EMAIL_USER || '',
                pass: process.env.EMAIL_PASS || ''
            }
        };

        // ✅ CORRECTION : createTransport (sans "er")
        this.transporter = nodemailer.createTransport(config);
    }

    // Vérifier la configuration du transporteur
    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log('✅ Email service ready');
            return true;
        } catch (error) {
            console.error('❌ Email service error:', error);
            return false;
        }
    }

    // Email de bienvenue après inscription
    async sendWelcomeEmail(data: WelcomeEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
        try {
            const mailOptions = {
                from: {
                    name: process.env.EMAIL_FROM_NAME || 'GreenRoots',
                    address: process.env.EMAIL_FROM || process.env.EMAIL_USER || ''
                },
                to: data.email,
                subject: '🌱 Welcome to GreenRoots!',
                html: this.getWelcomeEmailTemplate(data.firstName, data.lastName),
                text: `Welcome ${data.firstName} ${data.lastName}! Your registration on GreenRoots was successful.`
            };

            const info = await this.transporter.sendMail(mailOptions);

            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('Error sending welcome email:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Email de confirmation de paiement avec facture
    async sendInvoiceEmail(data: InvoiceEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
        try {
            const mailOptions = {
                from: {
                    name: process.env.EMAIL_FROM_NAME || 'GreenRoots',
                    address: process.env.EMAIL_FROM || process.env.EMAIL_USER || ''
                },
                to: data.email,
                subject: `🌱 Order Confirmation #${data.orderId} - GreenRoots`,
                html: this.getInvoiceEmailTemplate(data),
                text: `Thank you ${data.firstName} ${data.lastName}! Your order #${data.orderId} has been confirmed and paid successfully.`
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Invoice email sent:', info.messageId);

            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('❌ Error sending invoice email:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Template HTML pour l'email de bienvenue
    private getWelcomeEmailTemplate(firstName: string, lastName: string): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to GreenRoots</title>
            <style>
                * {
                    box-sizing: border-box;
                }
                :root {
                    --dark-green: #455e46;
                    --dark-grey: #212529;
                    --black: #000000;
                    --grey: #d9d9d9;
                    --pearl: #faf2e4;
                    --light-grey: #f6f7f9;
                    --light-yellow: #f0ddb5;
                    --light-green: #c9caba;
                    --light-red: #eeded2;
                    --light-blue: #cce7f0;
                    --light-brown: #ebeed2;
                    --europe-color: #4D834C;
                    --europe-hover: #3a6239;
                }
                body { 
                    font-family: sans-serif; 
                    line-height: 1.6; 
                    color: var(--dark-grey); 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px; 
                    background-color: var(--pearl); 
                }
                .container { 
                    background-color: white; 
                    border-radius: 12px; 
                    overflow: hidden; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
                }
                .header { 
                    background: linear-gradient(135deg, var(--dark-green), var(--europe-color));
                    color: white; 
                    padding: 40px 20px; 
                    text-align: center; 
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 2rem; 
                    font-weight: normal;
                    color: white;
                }
                .content { 
                    padding: 40px 30px; 
                    background-color: white;
                }
                .welcome-text { 
                    font-size: 1.2rem; 
                    color: var(--dark-green); 
                    margin-bottom: 25px; 
                    font-weight: bold;
                }
                .features { 
                    background-color: var(--light-grey); 
                    padding: 25px; 
                    border-radius: 8px; 
                    margin: 25px 0; 
                }
                .features h3 {
                    color: var(--dark-green);
                    font-size: 1.2rem;
                    margin-bottom: 20px;
                }
                .feature-item { 
                    margin: 15px 0; 
                    display: flex; 
                    align-items: center; 
                }
                .feature-icon { 
                    color: var(--europe-color); 
                    margin-right: 15px; 
                    font-size: 18px; 
                    min-width: 20px;
                }
                .button { 
                    display: inline-block; 
                    background-color: var(--dark-green);
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    margin: 25px 0; 
                    font-weight: 500; 
                    transition: all 0.3s; 
                }
                .button:hover {
                    background-color: var(--europe-hover);
                    text-decoration: none;
                }
                .footer { 
                    text-align: center; 
                    color: #666; 
                    font-size: 14px; 
                    margin-top: 30px; 
                    padding: 20px; 
                    background-color: var(--light-grey);
                }
                p {
                    margin-bottom: 1rem;
                }
                a {
                    color: var(--dark-green);
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to GreenRoots</h1>
                </div>
                <div class="content">
                    <div class="welcome-text">
                        Hello ${firstName} ${lastName},
                    </div>
                    <p>Welcome to the GreenRoots community! Your account has been successfully created.</p>
                    <p>Together, we can take concrete action against deforestation by sponsoring trees and supporting reforestation projects around the world.</p>
                    
                    <div class="features">
                        <h3>Your impact starts now:</h3>
                        <div class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>Sponsor trees in certified projects</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>Track the growth of your trees in real time</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>Measure your contribution to the fight against deforestation</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>Join a community committed to the planet</span>
                        </div>
                    </div>

                    <p style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
                            Discover our trees
                        </a>
                    </p>
                    
                    <p>Your first tree is waiting for you. Each sponsorship contributes directly to the restoration of forest ecosystems and the fight against climate change.</p>
                    <p>Thank you for joining our mission.</p>
                    <p><strong>The GreenRoots Team</strong></p>
                </div>
                <div class="footer">
                    <p>This email was sent automatically, please do not reply directly.</p>
                    <p>© 2025 GreenRoots - All rights reserved</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    // Template HTML pour l'email de facture
    private getInvoiceEmailTemplate(data: InvoiceEmailData): string {
        const itemsHtml = data.orderLines.map(line => {
            const price = parseFloat(line.price);
            const quantity = parseInt(line.quantity);
            return `
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">${line.tree_name}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">${quantity}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right;">${price.toFixed(2)}€</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${(quantity * price).toFixed(2)}€</td>
            </tr>
        `}).join('');

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GreenRoots Invoice #${data.orderId}</title>
            <style>
                * {
                    box-sizing: border-box;
                }
                :root {
                    --dark-green: #455e46;
                    --dark-grey: #212529;
                    --black: #000000;
                    --grey: #d9d9d9;
                    --pearl: #faf2e4;
                    --light-grey: #f6f7f9;
                    --europe-color: #4D834C;
                    --europe-hover: #3a6239;
                }
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
                    line-height: 1.6; 
                    color: var(--dark-grey); 
                    max-width: 700px; 
                    margin: 0 auto; 
                    padding: 20px; 
                    background-color: var(--pearl); 
                }
                .container { 
                    background-color: white; 
                    border-radius: 12px; 
                    overflow: hidden; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
                }
                .header { 
                    background: linear-gradient(135deg, var(--dark-green), var(--europe-color));
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                }
                .header h1 { 
                    margin: 0 0 10px 0; 
                    font-size: 2rem; 
                    font-weight: 600;
                    color: white;
                }
                .header p {
                    margin: 0;
                    opacity: 0.9;
                    font-size: 1.1rem;
                }
                .content { 
                    padding: 40px 30px; 
                }
                .invoice-details {
                    background-color: var(--light-grey);
                    padding: 25px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                }
                .invoice-details h3 {
                    color: var(--dark-green);
                    margin-top: 0;
                    margin-bottom: 15px;
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 8px 0;
                }
                .detail-label {
                    font-weight: 500;
                    color: #666;
                }
                .detail-value {
                    font-weight: 600;
                    color: var(--dark-grey);
                }
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 30px 0;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .items-table th {
                    background-color: var(--dark-green);
                    color: white;
                    padding: 18px 15px;
                    text-align: left;
                    font-weight: 600;
                }
                .items-table th:nth-child(2), 
                .items-table th:nth-child(3), 
                .items-table th:nth-child(4) {
                    text-align: center;
                }
                .items-table th:nth-child(3), 
                .items-table th:nth-child(4) {
                    text-align: right;
                }
                .items-table td {
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    background-color: white;
                }
                .total-row {
                    background-color: var(--europe-color) !important;
                    color: white;
                    font-weight: bold;
                    font-size: 1.1rem;
                }
                .total-row td {
                    border-bottom: none !important;
                }
                .thank-you {
                    background-color: var(--pearl);
                    padding: 25px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 30px 0;
                }
                .thank-you h3 {
                    color: var(--dark-green);
                    margin-bottom: 15px;
                }
                .footer { 
                    text-align: center; 
                    color: #666; 
                    font-size: 14px; 
                    padding: 25px; 
                    background-color: var(--light-grey);
                    margin-top: 0;
                }
                .status-badge {
                    display: inline-block;
                    background-color: #28a745;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                @media (max-width: 600px) {
                    .detail-row {
                        flex-direction: column;
                        gap: 5px;
                    }
                    .items-table {
                        font-size: 0.9rem;
                    }
                    .items-table th,
                    .items-table td {
                        padding: 10px 8px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌱 Confirmation Invoice</h1>
                    <p>Thank you for contributing to reforestation!</p>
                </div>
                <div class="content">
                    <div class="invoice-details">
                        <h3>Order Details</h3>
                        <div class="detail-row">
                            <span class="detail-label">Order Number:</span>
                            <span class="detail-value">#${data.orderId}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Date:</span>
                            <span class="detail-value">${new Date().toLocaleDateString('en-US')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Customer:</span>
                            <span class="detail-value">${data.firstName} ${data.lastName}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${data.email}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Payment ID:</span>
                            <span class="detail-value">${data.paymentIntentId}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Status:</span>
                            <span class="status-badge">✓ PAID</span>
                        </div>
                    </div>

                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Sponsored Tree</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                            <tr class="total-row">
                                <td colspan="3"><strong>TOTAL</strong></td>
                                <td style="text-align: right;"><strong>${data.totalAmount.toFixed(2)}€</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="thank-you">
                        <h3>🌿 Thank you for your commitment!</h3>
                        <p>Your sponsorship contributes directly to reforestation and the fight against climate change. Every tree planted makes a difference for our planet.</p>
                        <p>You will soon receive updates about your trees and their environmental impact.</p>
                    </div>

                    <p style="margin-top: 30px;"><strong>The GreenRoots Team</strong></p>
                </div>
                <div class="footer">
                    <p>This invoice was generated automatically following your payment.</p>
                    <p>© 2025 GreenRoots - All rights reserved</p>
                    <p>For any questions, contact us at support@greenroots.website</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}

export { EmailService };
