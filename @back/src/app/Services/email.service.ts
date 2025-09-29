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
                subject: '🌱 Bienvenue sur GreenRoots !',
                html: this.getWelcomeEmailTemplate(data.firstName, data.lastName),
                text: `Bienvenue ${data.firstName} ${data.lastName} ! Votre inscription sur GreenRoots a été réalisée avec succès.`
            };

            const info = await this.transporter.sendMail(mailOptions);

            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('Erreur envoi email de bienvenue:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            };
        }
    }

    // Template HTML pour l'email de bienvenue
    private getWelcomeEmailTemplate(firstName: string, lastName: string): string {
        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenue sur GreenRoots</title>
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
                    <h1>Bienvenue sur GreenRoots</h1>
                </div>
                <div class="content">
                    <div class="welcome-text">
                        Bonjour ${firstName} ${lastName},
                    </div>
                    <p>Bienvenue dans la communauté GreenRoots ! Votre compte a été créé avec succès.</p>
                    <p>Ensemble, nous pouvons agir concrètement contre la déforestation en parrainant des arbres et en soutenant des projets de reforestation partout dans le monde.</p>
                    
                    <div class="features">
                        <h3>Votre impact commence maintenant :</h3>
                        <div class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>Parrainez des arbres dans des projets certifiés</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>Suivez la croissance de vos arbres en temps réel</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>Mesurez votre contribution à la lutte contre la déforestation</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>Rejoignez une communauté engagée pour la planète</span>
                        </div>
                    </div>

                    <p style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
                            Découvrir nos arbres
                        </a>
                    </p>
                    
                    <p>Votre premier arbre n'attend que vous. Chaque parrainage contribue directement à la restauration des écosystèmes forestiers et à la lutte contre le changement climatique.</p>
                    <p>Merci de rejoindre notre mission.</p>
                    <p><strong>L'équipe GreenRoots</strong></p>
                </div>
                <div class="footer">
                    <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.</p>
                    <p>© 2025 GreenRoots - Tous droits réservés</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}

export { EmailService };