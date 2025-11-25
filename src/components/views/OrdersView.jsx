import React, { useState } from 'react';
import { Plus, Search, Filter, Truck, FileText, MoreHorizontal, CheckCircle, XCircle, AlertCircle, Edit2, Download, Send, Eye } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { generateInvoicePDF } from '../../utils/invoiceUtils';

// Mock Tenant Data (Should come from global state/context in real app)
const MOCK_TENANT = {
    name: "Dakar Electronics",
    address: "Rue 12 x 14",
    city: "Dakar",
    country: "Sénégal",
    phone: "+221 77 000 00 00",
    email: "contact@dakarelec.sn"
};

export const OrdersView = ({ orders, setOrders, deliveryPartners, openOrderModal, setIsPartnerModalOpen }) => {
    const [subTab, setSubTab] = useState('list'); // 'list' or 'partners'
    const [filterStatus, setFilterStatus] = useState('Tout');
    const [selectedOrder, setSelectedOrder] = useState(null); // For details view

    // Feature: Invoice & Delivery Modals
    const [selectedAssignOrder, setSelectedAssignOrder] = useState(null);

    // Feature: Price Override
    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [overridePrice, setOverridePrice] = useState(0);

    // Feature: Invoice Preview
    const [previewUrl, setPreviewUrl] = useState(null);

    const filteredOrders = orders.filter(o => filterStatus === 'Tout' || o.status === filterStatus);

    const handleAssignDriver = (partnerId) => {
        setOrders(orders.map(o => o.id === selectedAssignOrder.id ? { ...o, deliveryPartnerId: parseInt(partnerId), status: 'En livraison' } : o));
        setSelectedAssignOrder(null);
    };

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
    };

    const handlePriceOverride = () => {
        if (!selectedOrder) return;
        const updatedOrder = { ...selectedOrder, totalAmount: parseInt(overridePrice) };
        setOrders(orders.map(o => o.id === selectedOrder.id ? updatedOrder : o));
        setSelectedOrder(updatedOrder);
        setIsEditingPrice(false);
    };

    const handleGenerateInvoice = () => {
        if (!selectedOrder) return;
        try {
            generateInvoicePDF(selectedOrder, MOCK_TENANT, true); // true = download
        } catch (error) {
            console.error('Erreur génération facture:', error);
            alert('Erreur lors du téléchargement de la facture');
        }
    };

    const handlePreviewInvoice = () => {
        if (!selectedOrder) return;
        try {
            // Clean up previous blob URL if exists
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            const url = generateInvoicePDF(selectedOrder, MOCK_TENANT, false); // false = no download
            if (url) {
                setPreviewUrl(url);
            } else {
                alert('Impossible de générer l\'aperçu de la facture');
            }
        } catch (error) {
            console.error('Erreur aperçu facture:', error);
            alert('Erreur lors de l\'aperçu de la facture');
        }
    };

    const handleSendInvoice = (method) => {
        if (!selectedOrder) return;
        // Simulate sending
        alert(`Facture envoyée à ${selectedOrder.clientName} via ${method} !`);
    };

    // Calculate Margin for an Order
    const calculateMargin = (order) => {
        let totalCost = 0;
        order.items.forEach(item => {
            item.allocations.forEach(alloc => {
                totalCost += alloc.qty * alloc.unitCost;
            });
        });
        return order.totalAmount - totalCost;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Commandes</h2>
                <div className="flex gap-2">
                    <Button variant={subTab === 'list' ? 'default' : 'outline'} onClick={() => setSubTab('list')}>Liste</Button>
                    <Button variant={subTab === 'partners' ? 'default' : 'outline'} onClick={() => setSubTab('partners')}>Livreurs</Button>
                </div>
            </div>

            {subTab === 'list' ? (
                <>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input placeholder="Rechercher commande..." className="pl-9 w-64" />
                            </div>
                            <SelectFilter value={filterStatus} onChange={setFilterStatus} options={['Tout', 'Nouveau', 'Confirmé', 'En livraison', 'Livré', 'Annulé']} />
                        </div>
                        <Button onClick={() => openOrderModal()}>
                            <Plus className="mr-2 h-4 w-4" /> Nouvelle Commande
                        </Button>
                    </div>

                    <Card>
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Client</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Statut</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3">Marge (Est.)</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredOrders.map((order) => {
                                    const margin = calculateMargin(order);
                                    return (
                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => { setSelectedOrder(order); setIsEditingPrice(false); }}>
                                            <td className="px-4 py-3 font-mono font-medium">{order.id}</td>
                                            <td className="px-4 py-3">{order.clientName}</td>
                                            <td className="px-4 py-3">{order.date}</td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-4 py-3 font-medium">{order.totalAmount.toLocaleString()} FCFA</td>
                                            <td className="px-4 py-3 text-green-600 font-medium">
                                                {margin.toLocaleString()} FCFA
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                    {order.status === 'Confirmé' && (
                                                        <Button size="sm" variant="outline" onClick={() => setSelectedAssignOrder(order)}>
                                                            <Truck className="h-3 w-3 mr-1" /> Livrer
                                                        </Button>
                                                    )}
                                                    {order.status === 'Livré' && (
                                                        <Button size="sm" variant="ghost">
                                                            <FileText className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </Card>
                </>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-3 flex justify-end">
                        <Button onClick={() => setIsPartnerModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Nouveau Livreur
                        </Button>
                    </div>
                    {deliveryPartners.map(partner => (
                        <Card key={partner.id} className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{partner.name}</h3>
                                    <p className="text-xs text-slate-500">{partner.type}</p>
                                </div>
                            </div>
                            <div className="text-sm space-y-1 text-slate-600">
                                <p>Zone: {partner.zone}</p>
                                <p>Tel: {partner.phone}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal: Assign Driver */}
            <Modal isOpen={!!selectedAssignOrder} onClose={() => setSelectedAssignOrder(null)} title={`Assigner Livreur - ${selectedAssignOrder?.id}`}>
                <div className="space-y-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Sélectionnez un partenaire pour la livraison vers <strong>{selectedAssignOrder?.deliveryAddress.city}, {selectedAssignOrder?.deliveryAddress.district}</strong>.</p>
                    <div className="grid gap-2">
                        {deliveryPartners.map(partner => (
                            <button key={partner.id} onClick={() => handleAssignDriver(partner.id)}
                                className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                                <div>
                                    <p className="font-medium">{partner.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{partner.zone}</p>
                                </div>
                                <Badge variant="outline">Choisir</Badge>
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Modal: Order Details */}
            <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Détail Commande ${selectedOrder?.id}`}>
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400">Client</p>
                                <p className="font-medium">{selectedOrder.clientName}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400">Date</p>
                                <p className="font-medium">{selectedOrder.date}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400">Adresse</p>
                                <p className="font-medium">{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.district}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 mb-1">Statut</p>
                                <Select
                                    value={selectedOrder.status}
                                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                    className="h-8 text-xs"
                                >
                                    <option value="Nouveau">Nouveau</option>
                                    <option value="Confirmé">Confirmé</option>
                                    <option value="En livraison">En livraison</option>
                                    <option value="Livré">Livré</option>
                                    <option value="Annulé">Annulé</option>
                                </Select>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 mb-1">Livreur</p>
                                {selectedOrder.deliveryPartnerId ? (
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            {deliveryPartners.find(p => p.id === selectedOrder.deliveryPartnerId)?.name || 'Inconnu'}
                                        </span>
                                        <Button size="sm" variant="ghost" onClick={() => { setSelectedAssignOrder(selectedOrder); setSelectedOrder(null); }}>
                                            <Edit2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button size="sm" variant="outline" onClick={() => { setSelectedAssignOrder(selectedOrder); setSelectedOrder(null); }}>
                                        Assigner
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                            <h4 className="font-semibold mb-2">Articles</h4>
                            <div className="space-y-3">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-sm">
                                        <div className="flex justify-between font-medium">
                                            <span>{item.productName} (x{item.qty})</span>
                                            <span>{(item.unitPrice * item.qty).toLocaleString()} FCFA</span>
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                            <p>Allocation de stock (FIFO):</p>
                                            <ul className="list-disc list-inside pl-1">
                                                {item.allocations.map((alloc, i) => (
                                                    <li key={i}>
                                                        Lot {alloc.batchId}: {alloc.qty} unité(s) à coût {alloc.unitCost.toLocaleString()} FCFA
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between items-center font-bold text-lg">
                            <span>Total</span>
                            {isEditingPrice ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={overridePrice}
                                        onChange={(e) => setOverridePrice(e.target.value)}
                                        className="w-32 h-8"
                                    />
                                    <Button size="sm" onClick={handlePriceOverride}>OK</Button>
                                    <Button size="sm" variant="ghost" onClick={() => setIsEditingPrice(false)}>X</Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>{selectedOrder.totalAmount.toLocaleString()} FCFA</span>
                                    <Button size="sm" variant="ghost" onClick={() => { setOverridePrice(selectedOrder.totalAmount); setIsEditingPrice(true); }}>
                                        <Edit2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                            <Button variant="outline" onClick={() => setSelectedOrder(null)}>Fermer</Button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handlePreviewInvoice}>
                                    <Eye className="h-4 w-4 mr-2" /> Aperçu
                                </Button>
                                <Button variant="outline" onClick={handleGenerateInvoice}>
                                    <Download className="h-4 w-4 mr-2" /> PDF
                                </Button>
                                <Button onClick={() => handleSendInvoice('WhatsApp')}>
                                    <Send className="h-4 w-4 mr-2" /> Envoyer
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal: Invoice Preview */}
            <Modal isOpen={!!previewUrl} onClose={() => {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }} title="Aperçu Facture" className="max-w-4xl w-full">
                <div className="space-y-4">
                    <div className="h-[70vh] w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                        {previewUrl ? (
                            <iframe
                                src={previewUrl}
                                className="w-full h-full"
                                title="Aperçu Facture"
                                style={{ border: 'none' }}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-slate-500 dark:text-slate-400">Chargement de l'aperçu...</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (selectedOrder) {
                                    handleGenerateInvoice();
                                }
                            }}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger PDF
                        </Button>
                        <Button onClick={() => {
                            if (previewUrl) URL.revokeObjectURL(previewUrl);
                            setPreviewUrl(null);
                        }}>
                            Fermer
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const SelectFilter = ({ value, onChange, options }) => (
    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        {options.map(opt => (
            <button key={opt} onClick={() => onChange(opt)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${value === opt ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-slate-50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50'}`}>
                {opt}
            </button>
        ))}
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        'Nouveau': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        'Confirmé': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
        'En livraison': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
        'Livré': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
        'Annulé': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300'}`}>
            {status}
        </span>
    );
};
