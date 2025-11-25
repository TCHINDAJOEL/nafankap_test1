import React, { useState } from 'react';
import { Plus, Search, Filter, Package, Truck, AlertCircle, ChevronDown, ChevronUp, Edit2, Save, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';

export const StockView = ({ products, setProducts, suppliers, setSuppliers, setIsProductModalOpen, setIsSupplierModalOpen, tenant }) => {
    const [activeTab, setActiveTab] = useState('products'); // products, suppliers
    const [expandedProductId, setExpandedProductId] = useState(null);

    // État pour l'édition de produit
    const [editingProduct, setEditingProduct] = useState(null);
    const [editProductData, setEditProductData] = useState(null);

    // État pour l'édition de fournisseur
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [editSupplierData, setEditSupplierData] = useState(null);

    const toggleExpand = (id) => {
        if (expandedProductId === id) setExpandedProductId(null);
        else setExpandedProductId(id);
    };

    // Gestion de l'édition de produit
    const handleEditProduct = (product, e) => {
        e.stopPropagation();
        setEditingProduct(product.id);
        setEditProductData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock
        });
    };

    const handleSaveProduct = (productId) => {
        setProducts(products.map(p =>
            p.id === productId
                ? { ...p, ...editProductData }
                : p
        ));
        setEditingProduct(null);
        setEditProductData(null);
    };

    const handleCancelEditProduct = () => {
        setEditingProduct(null);
        setEditProductData(null);
    };

    // Gestion de l'édition de fournisseur
    const handleEditSupplier = (supplier) => {
        setEditingSupplier(supplier.id);
        setEditSupplierData({
            name: supplier.name,
            country: supplier.country,
            city: supplier.city,
            phone: supplier.phone,
            reliability: supplier.reliability,
            notes: supplier.notes
        });
    };

    const handleSaveSupplier = (supplierId) => {
        setSuppliers(suppliers.map(s =>
            s.id === supplierId
                ? { ...s, ...editSupplierData }
                : s
        ));
        setEditingSupplier(null);
        setEditSupplierData(null);
    };

    const handleCancelEditSupplier = () => {
        setEditingSupplier(null);
        setEditSupplierData(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Gestion des Stocks</h2>
                <div className="flex gap-2">
                    <Button variant={activeTab === 'products' ? 'default' : 'outline'} onClick={() => setActiveTab('products')}>
                        Produits
                    </Button>
                    <Button variant={activeTab === 'suppliers' ? 'default' : 'outline'} onClick={() => setActiveTab('suppliers')}>
                        Fournisseurs
                    </Button>
                </div>
            </div>

            {activeTab === 'products' && (
                <>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input placeholder="Rechercher un produit..." className="pl-9 w-64" />
                            </div>
                            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                        </div>
                        <Button onClick={() => setIsProductModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Nouveau Produit
                        </Button>
                    </div>

                    <Card>
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-3">Produit</th>
                                    <th className="px-4 py-3">Prix Vente</th>
                                    <th className="px-4 py-3">Stock Total</th>
                                    <th className="px-4 py-3">Lots (Batches)</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {products.map((product) => (
                                    <React.Fragment key={product.id}>
                                        <tr className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toggleExpand(product.id)}>
                                            <td className="px-4 py-3 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center">
                                                        <Package className="h-4 w-4 text-slate-500" />
                                                    </div>
                                                    <div>
                                                        <div>{product.name}</div>
                                                        <div className="text-xs text-slate-500">{product.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{product.price.toLocaleString()} FCFA</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={product.stock > 10 ? 'success' : 'destructive'}>
                                                    {product.stock} en stock
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {product.batches.length} lot(s)
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => handleEditProduct(product, e)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(product.id)}>
                                                        {expandedProductId === product.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedProductId === product.id && (
                                            <tr className="bg-slate-50/50">
                                                <td colSpan="5" className="px-4 py-4">
                                                    <div className="pl-11">
                                                        <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">Détail des lots (FIFO)</h4>
                                                        <table className="w-full text-xs border rounded-lg bg-white overflow-hidden">
                                                            <thead className="bg-slate-100 border-b">
                                                                <tr>
                                                                    <th className="px-3 py-2 text-left">ID Lot</th>
                                                                    <th className="px-3 py-2 text-left">Date Achat</th>
                                                                    <th className="px-3 py-2 text-left">Fournisseur</th>
                                                                    <th className="px-3 py-2 text-left">Coût Unitaire</th>
                                                                    <th className="px-3 py-2 text-left">Qte Initiale</th>
                                                                    <th className="px-3 py-2 text-left">Qte Restante</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y">
                                                                {product.batches.map(batch => (
                                                                    <tr key={batch.id}>
                                                                        <td className="px-3 py-2 font-mono">{batch.id}</td>
                                                                        <td className="px-3 py-2">{batch.date}</td>
                                                                        <td className="px-3 py-2">{batch.supplierName}</td>
                                                                        <td className="px-3 py-2">{batch.unitCost.toLocaleString()} FCFA</td>
                                                                        <td className="px-3 py-2">{batch.qtyPurchased}</td>
                                                                        <td className="px-3 py-2 font-bold text-slate-900">{batch.qtyRemaining}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </>
            )}

            {activeTab === 'suppliers' && (
                <>
                    <div className="flex justify-end mb-4">
                        <Button onClick={() => setIsSupplierModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Nouveau Fournisseur
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suppliers.map(supplier => (
                            <Card key={supplier.id} className="p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                            {supplier.name.substring(0, 1)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{supplier.name}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{supplier.city}, {supplier.country}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline">{supplier.reliability}</Badge>
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-3">
                                    <p><span className="font-medium">Tel:</span> {supplier.phone}</p>
                                    <p><span className="font-medium">Note:</span> {supplier.notes}</p>
                                </div>
                                <div className="flex justify-end mt-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditSupplier(supplier)}
                                    >
                                        <Edit2 className="h-4 w-4 mr-1" /> Modifier
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {/* Modal: Édition Produit */}
            <Modal
                isOpen={!!editingProduct}
                onClose={handleCancelEditProduct}
                title="Modifier le Produit"
            >
                {editProductData && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Nom du produit</label>
                            <Input
                                value={editProductData.name}
                                onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Description</label>
                            <Input
                                value={editProductData.description}
                                onChange={(e) => setEditProductData({ ...editProductData, description: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Prix de vente (FCFA)</label>
                                <Input
                                    type="number"
                                    value={editProductData.price}
                                    onChange={(e) => setEditProductData({ ...editProductData, price: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Stock total</label>
                                <Input
                                    type="number"
                                    value={editProductData.stock}
                                    onChange={(e) => setEditProductData({ ...editProductData, stock: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={handleCancelEditProduct}>
                                Annuler
                            </Button>
                            <Button onClick={() => handleSaveProduct(editingProduct)}>
                                <Save className="h-4 w-4 mr-2" /> Enregistrer
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal: Édition Fournisseur */}
            <Modal
                isOpen={!!editingSupplier}
                onClose={handleCancelEditSupplier}
                title="Modifier le Fournisseur"
            >
                {editSupplierData && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Nom de l'entreprise</label>
                            <Input
                                value={editSupplierData.name}
                                onChange={(e) => setEditSupplierData({ ...editSupplierData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Pays</label>
                                <Input
                                    value={editSupplierData.country}
                                    onChange={(e) => setEditSupplierData({ ...editSupplierData, country: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Ville</label>
                                <Input
                                    value={editSupplierData.city}
                                    onChange={(e) => setEditSupplierData({ ...editSupplierData, city: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Téléphone</label>
                            <Input
                                value={editSupplierData.phone}
                                onChange={(e) => setEditSupplierData({ ...editSupplierData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Fiabilité</label>
                            <Select
                                value={editSupplierData.reliability}
                                onChange={(e) => setEditSupplierData({ ...editSupplierData, reliability: e.target.value })}
                            >
                                <option value="Bon">Bon</option>
                                <option value="Moyen">Moyen</option>
                                <option value="Mauvais">Mauvais</option>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Notes</label>
                            <Input
                                value={editSupplierData.notes}
                                onChange={(e) => setEditSupplierData({ ...editSupplierData, notes: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={handleCancelEditSupplier}>
                                Annuler
                            </Button>
                            <Button onClick={() => handleSaveSupplier(editingSupplier)}>
                                <Save className="h-4 w-4 mr-2" /> Enregistrer
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
