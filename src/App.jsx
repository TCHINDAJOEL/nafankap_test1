import React, { useState, useMemo } from 'react';
import {
    LayoutDashboard,
    MessageSquare,
    ShoppingBag,
    Users,
    Package,
    Settings,
    LogOut,
    Menu,
    XCircle,
    Building,
    Search,
    Bell,
    Mail
} from 'lucide-react';

// UI Components
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Badge } from './components/ui/Badge';
import { Avatar } from './components/ui/Avatar';
import { Modal } from './components/ui/Modal';
import { Select } from './components/ui/Select';
import { ThemeToggle } from './components/ui/ThemeToggle';

// Views
import { AnalyticsView } from './components/views/AnalyticsView';
import { InboxView } from './components/views/InboxView';
import { OrdersView } from './components/views/OrdersView';
import { ClientsView } from './components/views/ClientsView';
import { StockView } from './components/views/StockView';
import { SettingsView } from './components/views/SettingsView';

// Data
import {
    INITIAL_ORDERS,
    INITIAL_CLIENTS,
    INITIAL_PRODUCTS,
    INITIAL_SUPPLIERS,
    INITIAL_DELIVERY_PARTNERS,
    INITIAL_DELIVERY_COMPANIES,
    INITIAL_USERS,
    INITIAL_CONVERSATIONS,
    INITIAL_TENANT
} from './data/mockData';

export default function App() {
    // Global Auth State (F-AUTH)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Global State
    const [activeTab, setActiveTab] = useState('analytics');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Data State
    const [tenant, setTenant] = useState(INITIAL_TENANT);
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [clients, setClients] = useState(INITIAL_CLIENTS);
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
    const [deliveryPartners, setDeliveryPartners] = useState(INITIAL_DELIVERY_PARTNERS);
    const [deliveryCompanies, setDeliveryCompanies] = useState(INITIAL_DELIVERY_COMPANIES);
    const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
    const [users, setUsers] = useState(INITIAL_USERS);

    // --- MODAL STATES ---
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [newOrderData, setNewOrderData] = useState({ client: '', product: '', qty: 1 });

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [newProductData, setNewProductData] = useState({ name: '', stock: 0, price: 0, cost: 0, supplierId: '', desc: '' });

    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [newSupplierData, setNewSupplierData] = useState({ name: '', country: '', phone: '', reliability: 'Moyen' });

    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
    const [newPartnerData, setNewPartnerData] = useState({ name: '', phone: '', zone: '', type: 'Indépendant' });

    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [newClientData, setNewClientData] = useState({ name: '', phone: '', city: 'Dakar', district: '', channel: 'whatsapp' });

    // --- BUSINESS LOGIC (SRS COMPLIANT) ---

    // F-STOCK-02: FIFO Allocation Logic
    const allocateStock = (product, qtyRequired) => {
        let remainingToAllocate = qtyRequired;
        const allocations = [];
        const updatedBatches = [...product.batches].sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ASC (FIFO)

        for (let batch of updatedBatches) {
            if (remainingToAllocate <= 0) break;
            if (batch.qtyRemaining > 0) {
                const take = Math.min(batch.qtyRemaining, remainingToAllocate);
                batch.qtyRemaining -= take;
                remainingToAllocate -= take;
                allocations.push({
                    batchId: batch.id,
                    qty: take,
                    unitCost: batch.unitCost // Capture cost at allocation time
                });
            }
        }

        if (remainingToAllocate > 0) {
            alert(`Stock insuffisant pour ${product.name}. Manque: ${remainingToAllocate}`);
            return null; // Allocation failed
        }

        return { allocations, updatedBatches };
    };

    const handleCreateOrder = () => {
        const selectedClient = clients.find(c => c.id === newOrderData.client);
        const selectedProduct = products.find(p => p.id === parseInt(newOrderData.product));

        if (!selectedClient || !selectedProduct) return;

        const qty = parseInt(newOrderData.qty);

        // 1. Perform Stock Allocation (FIFO)
        const allocationResult = allocateStock(selectedProduct, qty);
        if (!allocationResult) return; // Stop if stock insufficient

        const { allocations, updatedBatches } = allocationResult;

        // 2. Create Order Item
        const orderItem = {
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            qty: qty,
            unitPrice: selectedProduct.price,
            allocations: allocations // Store allocations for margin calc
        };

        // 3. Create Order
        const newOrder = {
            id: `CMD-${String(orders.length + 1).padStart(3, '0')}`,
            tenantId: tenant.id,
            clientId: selectedClient.id,
            clientName: selectedClient.name,
            status: "Nouveau",
            date: new Date().toISOString().split('T')[0],
            deliveryAddress: {
                country: selectedClient.country,
                city: selectedClient.city,
                district: selectedClient.district
            },
            deliveryPartnerId: null,
            deliveryFees: 0, // Default
            totalAmount: selectedProduct.price * qty,
            items: [orderItem],
            invoiceUrl: null
        };

        // 4. Update State (Atomic-like)
        setOrders([newOrder, ...orders]);

        // Update Product Stock & Batches
        const updatedProducts = products.map(p => {
            if (p.id === selectedProduct.id) {
                return {
                    ...p,
                    stock: p.stock - qty,
                    batches: updatedBatches
                };
            }
            return p;
        });
        setProducts(updatedProducts);

        setIsOrderModalOpen(false);
        setNewOrderData({ client: '', product: '', qty: 1 });
    };

    const handleCreateProduct = () => {
        if (!newProductData.name || !newProductData.price) return;
        const supplier = suppliers.find(s => s.id === parseInt(newProductData.supplierId));

        const newProd = {
            id: products.length + 1,
            tenantId: tenant.id,
            name: newProductData.name,
            description: newProductData.desc,
            price: parseInt(newProductData.price),
            image: null,
            stock: parseInt(newProductData.stock),
            batches: [
                {
                    id: `BATCH-${Date.now()}`,
                    productId: products.length + 1,
                    supplierId: supplier ? supplier.id : null,
                    supplierName: supplier ? supplier.name : 'Inconnu',
                    date: new Date().toISOString().split('T')[0],
                    qtyPurchased: parseInt(newProductData.stock),
                    qtyRemaining: parseInt(newProductData.stock),
                    unitCost: parseInt(newProductData.cost),
                    location: tenant.city
                }
            ]
        };

        setProducts([...products, newProd]);
        setIsProductModalOpen(false);
        setNewProductData({ name: '', stock: 0, price: 0, cost: 0, supplierId: '', desc: '' });
    };

    const handleCreateSupplier = () => {
        if (!newSupplierData.name) return;
        const newSup = {
            id: suppliers.length + 1,
            tenantId: tenant.id,
            ...newSupplierData
        };
        setSuppliers([...suppliers, newSup]);
        setIsSupplierModalOpen(false);
        setNewSupplierData({ name: '', country: '', phone: '', reliability: 'Moyen' });
    };

    const handleCreatePartner = () => {
        if (!newPartnerData.name) return;
        const newPartner = {
            id: deliveryPartners.length + 1,
            tenantId: tenant.id,
            ...newPartnerData
        };
        setDeliveryPartners([...deliveryPartners, newPartner]);
        setIsPartnerModalOpen(false);
        setNewPartnerData({ name: '', phone: '', zone: '', type: 'Indépendant' });
    };

    const handleCreateClient = () => {
        if (!newClientData.name || !newClientData.phone) return;
        const newClient = {
            id: `CL-${String(clients.length + 1).padStart(3, '0')}`,
            tenantId: tenant.id,
            name: newClientData.name,
            country: tenant.country, // Default to tenant country
            city: newClientData.city,
            district: newClientData.district,
            notes: "",
            totalSpent: 0,
            lastOrderDate: null,
            contactMethods: [
                { type: newClientData.channel, value: newClientData.phone, isPrimary: true }
            ]
        };
        setClients([newClient, ...clients]);
        setIsClientModalOpen(false);
        setNewClientData({ name: '', phone: '', city: 'Dakar', district: '', channel: 'whatsapp' });
    };

    // Helper to open order modal from anywhere
    const openOrderModal = (clientId = '') => {
        setNewOrderData({ ...newOrderData, client: clientId, qty: 1 });
        setIsOrderModalOpen(true);
    };

    const navItems = [
        { id: 'analytics', label: 'Analytics & Marges', icon: LayoutDashboard },
        { id: 'inbox', label: 'Inbox Omnicanale', icon: MessageSquare },
        { id: 'orders', label: 'Commandes', icon: ShoppingBag },
        { id: 'clients', label: 'Clients', icon: Users },
        { id: 'stock', label: 'Produits & Stock', icon: Package },
        { id: 'settings', label: 'Paramètres', icon: Settings },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'analytics': return <AnalyticsView orders={orders} products={products} suppliers={suppliers} />;
            case 'inbox': return <InboxView conversations={conversations} setConversations={setConversations} openOrderModal={openOrderModal} clients={clients} />;
            case 'orders': return <OrdersView orders={orders} setOrders={setOrders} deliveryPartners={deliveryPartners} setDeliveryPartners={setDeliveryPartners} deliveryCompanies={deliveryCompanies} setDeliveryCompanies={setDeliveryCompanies} openOrderModal={openOrderModal} setIsPartnerModalOpen={setIsPartnerModalOpen} />;
            case 'clients': return <ClientsView clients={clients} setIsClientModalOpen={setIsClientModalOpen} />;
            case 'stock': return <StockView products={products} setProducts={setProducts} suppliers={suppliers} setSuppliers={setSuppliers} setIsProductModalOpen={setIsProductModalOpen} setIsSupplierModalOpen={setIsSupplierModalOpen} tenant={tenant} />;
            case 'settings': return <SettingsView users={users} setUsers={setUsers} tenant={tenant} />;
            default: return <AnalyticsView orders={orders} products={products} suppliers={suppliers} />;
        }
    };

    // --- AUTH VIEW (F-AUTH) ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-slate-900 dark:text-slate-50">
                <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-slate-900 dark:bg-slate-100 rounded-xl flex items-center justify-center text-white dark:text-slate-900 font-bold text-xl mb-4">N</div>
                        <h2 className="text-2xl font-bold tracking-tight">Bienvenue sur nafankap</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Gérez vos ventes WhatsApp & Facebook en un seul endroit.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Numéro de téléphone (F-AUTH-01)</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 sm:text-sm">+221</span>
                                <Input placeholder="77 000 00 00" className="rounded-l-none" />
                            </div>
                        </div>

                        <Button className="w-full h-11" onClick={() => {
                            setIsAuthenticated(true);
                            setCurrentUser(INITIAL_USERS[0]);
                        }}>
                            Recevoir le code OTP (Simulation)
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">Ou continuer avec</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full">
                            <Mail className="mr-2 h-4 w-4" /> Email & Mot de passe (F-AUTH-02)
                        </Button>
                    </div>

                    <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                        Pas encore de compte ? <a href="#" className="text-slate-900 dark:text-slate-50 font-semibold underline">Créer une boutique</a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-950 dark:text-slate-50">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 fixed inset-y-0 z-40">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <div className="h-8 w-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center text-white dark:text-slate-900 font-bold">N</div>
                    <span className="font-bold text-xl tracking-tight">nafankap</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <Avatar fallback={currentUser?.name?.substring(0, 2).toUpperCase() || "AK"} className="h-9 w-9 bg-slate-200 dark:bg-slate-700" />
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{currentUser?.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.role}</p>
                        </div>
                    </div>
                    <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center text-white dark:text-slate-900 font-bold">N</div>
                    <span className="font-bold text-xl">nafankap</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 p-4 md:hidden animate-in slide-in-from-right">
                    <div className="flex justify-end mb-4">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                            <XCircle className="h-6 w-6" />
                        </Button>
                    </div>
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-lg text-lg font-medium ${activeTab === item.id ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400'
                                    }`}
                            >
                                <item.icon className="h-6 w-6" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col min-h-0 overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'blur-sm' : ''} md:pl-64 pt-16 md:pt-0`}>
                {/* Header (Desktop only mostly) */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                        <Building className="h-4 w-4 mr-2 hidden md:block" />
                        <span className="hidden md:inline">Boutique: </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-50 ml-1">{tenant.name}</span>
                        <Badge variant="outline" className="ml-3 text-[10px] uppercase tracking-wider bg-slate-100 dark:bg-slate-800">{tenant.plan}</Badge>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500 md:block hidden" />
                            <input className="hidden md:block h-10 w-64 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100" placeholder="Recherche globale..." />
                        </div>
                        <ThemeToggle />
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-slate-900"></span>
                        </Button>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </div>
            </main>

            {/* --- GLOBAL MODALS --- */}

            {/* Modal: New Order */}
            <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title="Nouvelle Commande">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Client</label>
                        <Select value={newOrderData.client} onChange={(e) => setNewOrderData({ ...newOrderData, client: e.target.value })}>
                            <option value="">Choisir un client...</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Produit</label>
                        <Select value={newOrderData.product} onChange={(e) => setNewOrderData({ ...newOrderData, product: e.target.value })}>
                            <option value="">Choisir un produit...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.price} FCFA)</option>)}
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Quantité</label>
                        <Input type="number" min="1" value={newOrderData.qty} onChange={(e) => setNewOrderData({ ...newOrderData, qty: parseInt(e.target.value) })} />
                    </div>
                    <Button className="w-full mt-4" onClick={handleCreateOrder}>Créer Commande</Button>
                </div>
            </Modal>

            {/* Modal: New Product */}
            <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Nouveau Produit">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Nom du produit</label>
                        <Input value={newProductData.name} onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })} placeholder="Ex: AirPods Gen 3" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Prix Vente</label>
                            <Input type="number" value={newProductData.price} onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Coût Achat (Initial)</label>
                            <Input type="number" value={newProductData.cost} onChange={(e) => setNewProductData({ ...newProductData, cost: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Stock Initial</label>
                        <Input type="number" value={newProductData.stock} onChange={(e) => setNewProductData({ ...newProductData, stock: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Fournisseur</label>
                        <Select value={newProductData.supplierId} onChange={(e) => setNewProductData({ ...newProductData, supplierId: e.target.value })}>
                            <option value="">Sélectionner un fournisseur...</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <Input value={newProductData.desc} onChange={(e) => setNewProductData({ ...newProductData, desc: e.target.value })} />
                    </div>
                    <Button className="w-full mt-4" onClick={handleCreateProduct}>Ajouter Produit</Button>
                </div>
            </Modal>

            {/* Modal: New Supplier */}
            <Modal isOpen={isSupplierModalOpen} onClose={() => setIsSupplierModalOpen(false)} title="Nouveau Fournisseur">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Nom de l'entreprise</label>
                        <Input value={newSupplierData.name} onChange={(e) => setNewSupplierData({ ...newSupplierData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Pays</label>
                        <Input value={newSupplierData.country} onChange={(e) => setNewSupplierData({ ...newSupplierData, country: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Téléphone / Contact</label>
                        <Input value={newSupplierData.phone} onChange={(e) => setNewSupplierData({ ...newSupplierData, phone: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Fiabilité</label>
                        <Select value={newSupplierData.reliability} onChange={(e) => setNewSupplierData({ ...newSupplierData, reliability: e.target.value })}>
                            <option value="Bon">Bon</option>
                            <option value="Moyen">Moyen</option>
                            <option value="Mauvais">Mauvais</option>
                        </Select>
                    </div>
                    <Button className="w-full mt-4" onClick={handleCreateSupplier}>Ajouter Fournisseur</Button>
                </div>
            </Modal>

            {/* Modal: New Delivery Partner */}
            <Modal isOpen={isPartnerModalOpen} onClose={() => setIsPartnerModalOpen(false)} title="Nouveau Livreur">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Nom complet</label>
                        <Input value={newPartnerData.name} onChange={(e) => setNewPartnerData({ ...newPartnerData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Téléphone</label>
                        <Input value={newPartnerData.phone} onChange={(e) => setNewPartnerData({ ...newPartnerData, phone: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Zone de couverture</label>
                        <Input value={newPartnerData.zone} onChange={(e) => setNewPartnerData({ ...newPartnerData, zone: e.target.value })} placeholder="Ex: Dakar & Banlieue" />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Type</label>
                        <Select value={newPartnerData.type} onChange={(e) => setNewPartnerData({ ...newPartnerData, type: e.target.value })}>
                            <option value="Indépendant">Indépendant</option>
                            <option value="Agence">Agence</option>
                        </Select>
                    </div>
                    <Button className="w-full mt-4" onClick={handleCreatePartner}>Ajouter Livreur</Button>
                </div>
            </Modal>

            {/* Modal: New Client */}
            <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title="Nouveau Client">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Nom complet</label>
                        <Input value={newClientData.name} onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })} placeholder="Ex: Moussa Diop" />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Téléphone</label>
                        <Input value={newClientData.phone} onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })} placeholder="Ex: +221 77 123 45 67" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Ville</label>
                            <Input value={newClientData.city} onChange={(e) => setNewClientData({ ...newClientData, city: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Quartier</label>
                            <Input value={newClientData.district} onChange={(e) => setNewClientData({ ...newClientData, district: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Canal principal</label>
                        <Select value={newClientData.channel} onChange={(e) => setNewClientData({ ...newClientData, channel: e.target.value })}>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                        </Select>
                    </div>
                    <Button className="w-full mt-4" onClick={handleCreateClient}>Créer Client</Button>
                </div>
            </Modal>

        </div>
    );
}
