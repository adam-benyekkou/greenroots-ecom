import React, { useState } from 'react';
import './orders.css';

// Types pour TypeScript
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

// Données d'exemple pour les commandes basées sur la vraie BDD
const mockOrders: Order[] = [
    {
        id: 1,
        number: "CMD-2024-001",
        date: "15/08/2024",
        status: "En cours",
        total: "89.50€",
        items: [
            { product: "Chêne - Reforestation Bretagne", quantity: 2, unitPrice: "15.50€", totalPrice: "31.00€" },
            { product: "Eucalyptus - Reforestation Bretagne", quantity: 2, unitPrice: "30.00€", totalPrice: "60.00€" }
        ]
    },
    {
        id: 2,
        number: "CMD-2024-002",
        date: "12/08/2024",
        status: "Livré",
        total: "125.00€",
        items: [
            { product: "Baobab - Sauvegarde Baobabs", quantity: 5, unitPrice: "25.00€", totalPrice: "125.00€" }
        ]
    },
    {
        id: 3,
        number: "CMD-2024-003",
        date: "10/08/2024",
        status: "En préparation",
        total: "135.00€",
        items: [
            { product: "Palissandre - Sauvegarde Baobabs", quantity: 3, unitPrice: "45.00€", totalPrice: "135.00€" }
        ]
    },
    {
        id: 4,
        number: "CMD-2024-004",
        date: "08/08/2024",
        status: "Annulé",
        total: "90.00€",
        items: [
            { product: "Dipterocarpus - Bornéo Emergency", quantity: 2, unitPrice: "45.00€", totalPrice: "90.00€" }
        ]
    },
    {
        id: 5,
        number: "CMD-2024-005",
        date: "05/08/2024",
        status: "Livré",
        total: "152.00€",
        items: [
            { product: "Teck birman - Myanmar Forest Rescue", quantity: 4, unitPrice: "38.00€", totalPrice: "152.00€" }
        ]
    },
    {
        id: 6,
        number: "CMD-2024-006",
        date: "02/08/2024",
        status: "En cours",
        total: "126.00€",
        items: [
            { product: "Narra philippin - Philippines Coral Triangle", quantity: 3, unitPrice: "42.00€", totalPrice: "126.00€" }
        ]
    },
    {
        id: 7,
        number: "CMD-2024-007",
        date: "30/07/2024",
        status: "Livré",
        total: "110.00€",
        items: [
            { product: "Acajou du Brésil - Amazonie Colombienne", quantity: 2, unitPrice: "55.00€", totalPrice: "110.00€" }
        ]
    },
    {
        id: 8,
        number: "CMD-2024-008",
        date: "28/07/2024",
        status: "En préparation",
        total: "189.00€",
        items: [
            { product: "Cecropia - Amazonie Colombienne", quantity: 3, unitPrice: "25.00€", totalPrice: "75.00€" },
            { product: "Épinette noire - Forêt Boréale Canada", quantity: 2, unitPrice: "28.00€", totalPrice: "56.00€" },
            { product: "Peuplier faux-tremble - Californie Post-Feux", quantity: 2, unitPrice: "22.00€", totalPrice: "44.00€" }
        ]
    },
    {
        id: 9,
        number: "CMD-2024-009",
        date: "25/07/2024",
        status: "Livré",
        total: "105.00€",
        items: [
            { product: "Eucalyptus à gomme rouge - Bushfire Recovery", quantity: 3, unitPrice: "35.00€", totalPrice: "105.00€" }
        ]
    },
    {
        id: 10,
        number: "CMD-2024-010",
        date: "22/07/2024",
        status: "En cours",
        total: "140.00€",
        items: [
            { product: "Chêne-liège - Montado Portugais", quantity: 2, unitPrice: "40.00€", totalPrice: "80.00€" },
            { product: "Balanites - Sahel Vert Sénégal", quantity: 3, unitPrice: "20.00€", totalPrice: "60.00€" }
        ]
    }
];

// Composant pour une commande individuelle dans la liste
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

// Composant liste des commandes avec pagination
const OrdersList: React.FC<{
    orders: Order[];
    onViewDetails: (order: Order) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = ({ orders, onViewDetails, currentPage, totalPages, onPageChange }) => {
    const ordersPerPage = 3;
    const startIndex = (currentPage - 1) * ordersPerPage;
    const displayedOrders = orders.slice(startIndex, startIndex + ordersPerPage);

    return (
        <div className="orders-list">
            <h1 className="orders-title">Mes Commandes</h1>

            {displayedOrders.map(order => (
                <OrderItem key={order.id} order={order} onViewDetails={onViewDetails} />
            ))}

            <div className="pagination">
                {currentPage > 1 && (
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        className="pagination-btn"
                    >
                        Page précédente
                    </button>
                )}

                {currentPage < totalPages && (
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        className="pagination-btn"
                    >
                        Page suivante
                    </button>
                )}
            </div>
        </div>
    );
};

// Composant détail d'une commande
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

// Composant principal
const Orders: React.FC = () => {
    const [currentView, setCurrentView] = useState<'orders' | 'detail'>('orders');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setCurrentView('detail');
    };

    const handleBack = () => {
        setCurrentView('orders');
        setSelectedOrder(null);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const ordersPerPage = 3;
    const totalPages = Math.ceil(mockOrders.length / ordersPerPage);

    return (
        <div className="orders-container">
            <div className="orders-modal">
                <main className="orders-main">
                    {currentView === 'orders' ? (
                        <OrdersList
                            orders={mockOrders}
                            onViewDetails={handleViewDetails}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    ) : (
                        selectedOrder && (
                            <OrderDetail
                                order={selectedOrder}
                                onBack={handleBack}
                            />
                        )
                    )}
                </main>
            </div>
        </div>
    );
};

export default Orders;