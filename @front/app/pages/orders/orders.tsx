import { Link, redirect } from "react-router";
import type { Route } from "./+types/orders";
import { getSession } from "~/services/sessions.server";
import { useState } from "react";

import "./orders.css";

export function meta() {
    return [
        {
            title: "GreenRoots - Mes commandes",
        },
        {
            name: "description",
            content: "Consultez et suivez l'évolution de vos commandes d'arbres parrainés.",
        },
    ];
}

export async function loader(params: Route.LoaderArgs) {
    // Check authentication first
    const session = await getSession(params.request.headers.get("Cookie"));
    const token = session.get("token");

    if (!token) {
        // Redirect to login if not authenticated
        throw redirect("/login");
    }

    const apiUrl = import.meta.env.VITE_API_URL;
    const url = new URL(params.request.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Number.parseInt(limitParam) : 3;
    const pageParam = url.searchParams.get("page");
    const page = pageParam ? Number.parseInt(pageParam) : 1;

    try {
        const response = await fetch(`${apiUrl}/orders?limit=${limit}&page=${page}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            // Token expired or invalid, redirect to login
            throw redirect("/login");
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();

        // Transformer les données pour correspondre à l'interface frontend
        const adaptedOrders = json.data.map((order: any) => ({
            id: order.order_id,
            number: `CMD-${order.order_id.toString().padStart(4, '0')}`,
            date: new Date(order.created_at).toLocaleDateString('fr-FR'),
            status: getStatusLabel(order.status),
            total: calculateOrderTotal(order.order_lines),
            items: order.order_lines?.map((line: any) => ({
                product: `${line.tree?.name} - ${line.tree?.projects?.[0]?.name}`,
                quantity: line.quantity,
                unitPrice: `${line.price}€`,
                totalPrice: `${(line.price * line.quantity).toFixed(2)}€`
            })) || []
        }));

        return {
            orders: adaptedOrders,
            pages: json.pagination.pages,
            page: json.pagination.page,
            limit
        };

    } catch (error) {
        // Re-throw redirect responses
        if (error instanceof Response && error.status === 302) {
            throw error;
        }

        console.error('Orders loader error:', error);
        return {
            orders: [],
            pages: 1,
            page,
            limit
        };
    }
}

// Helper functions
function getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
        'pending': 'En cours',
        'processing': 'En préparation',
        'completed': 'Livré',
        'cancelled': 'Annulé'
    };
    return statusMap[status] || status;
}

function calculateOrderTotal(orderLines: any[]): string {
    const total = orderLines?.reduce((sum, line) => sum + (line.price * line.quantity), 0) || 0;
    return `${total.toFixed(2)}€`;
}

// Types
interface OrderItem {
    product: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
}

interface Order {
    id: number;
    number: string;
    date: string;
    status: string;
    total: string;
    items: OrderItem[];
}

// Order Detail Component
const OrderDetail: React.FC<{ order: Order; onBack: () => void }> = ({ order, onBack }) => (
    <div className="order-detail">
        <div className="order-detail-header">
            <h1 className="orders-title">Mes Commandes</h1>
            <button onClick={onBack} className="back-btn">
                Retour
            </button>
        </div>

        <div className="order-section">
            <h3 className="section-title">Commande {order.number}</h3>
            <div className="order-info-card">
                <div className="order-info-content">
                    <span className="order-date-label">Date de commande: {order.date}</span>
                    <div className="order-status-detail">{order.status}</div>
                </div>
            </div>
        </div>

        <div className="order-section">
            <h3 className="section-title">Détails de la commande</h3>
            <div className="order-table">
                <div className="table-header">
                    <span>Produit</span>
                    <span>Quantité</span>
                    <span>Prix Unitaire</span>
                    <span>Prix Total</span>
                </div>
                {order.items.map((item, index) => (
                    <div key={index} className="table-row">
                        <span className="product-name">{item.product}</span>
                        <span>{item.quantity}</span>
                        <span>{item.unitPrice}</span>
                        <span className="item-total">{item.totalPrice}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="order-total-section">
            <div className="order-total-card">
                Total Commande : {order.total}
            </div>
        </div>
    </div>
);

// Order Item Component
const OrderItem: React.FC<{ order: Order; onViewDetails: (order: Order) => void }> = ({ order, onViewDetails }) => {
    return (
        <div className="order-item">
            <div className="order-item-content">
                <div className="order-item-info">
                    <div className="order-item-main">
                        <span className="order-number">{order.number}</span>
                        <span className="order-date">{order.date}</span>
                        <span className="order-total">{order.total}</span>
                    </div>
                    <div className={`order-status status-${order.status.toLowerCase().replace(' ', '-')}`}>
                        {order.status}
                    </div>
                </div>
                <button
                    onClick={() => onViewDetails(order)}
                    className="order-details-btn"
                >
                    Voir le détail
                </button>
            </div>
        </div>
    );
};

export default function Orders(props: Route.ComponentProps) {
    const { loaderData } = props;
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
    };

    const handleBack = () => {
        setSelectedOrder(null);
    };

    return (
        <main className="orders-container">
            <div className="orders-modal">
                <div className="orders-main">
                    {selectedOrder ? (
                        <OrderDetail order={selectedOrder} onBack={handleBack} />
                    ) : (
                        <div className="orders-list">
                            <h1 className="orders-title">Mes Commandes</h1>

                            {loaderData.orders.length > 0 ? (
                                <div className="orders-grid">
                                    {loaderData.orders.map((order) => (
                                        <OrderItem key={order.id} order={order} onViewDetails={handleViewDetails} />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <h2>Aucune commande trouvée</h2>
                                    <p>Vous n'avez pas encore passé de commande.</p>
                                    <Link to="/catalog" className="navigation-pages-links">
                                        Découvrir nos arbres
                                    </Link>
                                </div>
                            )}

                            {loaderData.orders.length > 0 && loaderData.pages > 1 && (
                                <div className="pagination">
                                    {loaderData.page > 1 && (
                                        <Link
                                            to={`?page=${loaderData.page - 1}&limit=${loaderData.limit}`}
                                            className="navigation-pages-links"
                                        >
                                            Page précédente
                                        </Link>
                                    )}

                                    {loaderData.page < loaderData.pages && (
                                        <Link
                                            to={`?page=${loaderData.page + 1}&limit=${loaderData.limit}`}
                                            className="navigation-pages-links"
                                        >
                                            Page suivante
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}