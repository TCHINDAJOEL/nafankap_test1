import React, { useState, useMemo } from 'react';
import { ShoppingBag, TrendingUp, Package, Users, BarChart3, Globe, MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Select } from '../ui/Select';
import { SimpleLineChart } from '../charts/SimpleLineChart';
import { SimpleBarChart } from '../charts/SimpleBarChart';
import { generateChartData } from '../../utils/chartUtils';

export const AnalyticsView = ({ orders, products, suppliers }) => {
    // F-ANALYT-02: Filtres Géographiques & Temporels
    const [period, setPeriod] = useState('30d');
    const [geoFilter, setGeoFilter] = useState({ city: 'all', district: 'all' });
    const [activeAnalyticsTab, setActiveAnalyticsTab] = useState('overview'); // overview, suppliers, geo

    // Filter Data Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchCity = geoFilter.city === 'all' || order.deliveryAddress?.city === geoFilter.city;
            const matchDistrict = geoFilter.district === 'all' || order.deliveryAddress?.district === geoFilter.district;
            return matchCity && matchDistrict;
        });
    }, [orders, geoFilter]);

    // Recalculate KPI based on Filtered Data
    const analyticsKPI = useMemo(() => {
        const sales = filteredOrders.reduce((acc, o) => acc + o.totalAmount, 0);
        const count = filteredOrders.length;
        const margin = filteredOrders.reduce((acc, o) => {
            const cost = o.items.reduce((s, i) => {
                // Calculate cost from allocations
                const itemCost = i.allocations ? i.allocations.reduce((ac, alloc) => ac + (alloc.unitCost * alloc.qty), 0) : 0;
                return s + itemCost;
            }, 0);
            return acc + (o.totalAmount - cost);
        }, 0);
        return { sales, count, margin };
    }, [filteredOrders]);

    // F-ANALYT-03: Statistiques par Fournisseur
    const supplierStats = useMemo(() => {
        const stats = {};

        // Initialize
        suppliers.forEach(s => {
            stats[s.id] = { id: s.id, name: s.name, totalPurchased: 0, totalSales: 0, totalMargin: 0, ordersCount: 0 };
        });

        // Calculate from products & orders
        // 1. Calculate Purchased Volume (Mock based on current stock + sold items)
        products.forEach(p => {
            if (stats[p.supplierId]) {
                const initialStockCost = p.batches ? p.batches.reduce((sum, b) => sum + (b.qtyPurchased * b.unitCost), 0) : 0;
                stats[p.supplierId].totalPurchased += initialStockCost;
            }
        });

        // 2. Calculate Sales & Margin from Orders
        orders.forEach(o => {
            o.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product && stats[product.supplierId]) {
                    const lineTotal = item.unitPrice * item.qty;
                    // Calculate cost from allocations
                    const lineCost = item.allocations ? item.allocations.reduce((ac, alloc) => ac + (alloc.unitCost * alloc.qty), 0) : 0;

                    stats[product.supplierId].totalSales += lineTotal;
                    stats[product.supplierId].totalMargin += (lineTotal - lineCost);
                    stats[product.supplierId].ordersCount += 1;
                }
            });
        });

        return Object.values(stats).sort((a, b) => b.totalMargin - a.totalMargin); // Sort by Best Margin
    }, [orders, products, suppliers]);

    // F-ANALYT-02: Geo Data for Charts
    const geoData = useMemo(() => {
        const cityMap = {};
        orders.forEach(o => {
            const city = o.deliveryAddress?.city || 'Inconnu';
            if (!cityMap[city]) cityMap[city] = 0;
            cityMap[city] += o.totalAmount;
        });
        return Object.keys(cityMap).map(city => ({ label: city, value: cityMap[city] })).sort((a, b) => b.value - a.value);
    }, [orders]);

    // Chart Data Generation
    const salesChartData = useMemo(() => {
        const daysMap = { '7d': 7, '30d': 30, '3m': 90, '1y': 365 };
        return generateChartData(daysMap[period]);
    }, [period]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header & Filters (F-ANALYT-02) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Analytics & Marges (F-ANALYT)</h2>
                    <p className="text-sm text-slate-500">Analysez la rentabilité par zone et fournisseur.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Select className="w-32 h-9 text-xs" value={geoFilter.city} onChange={(e) =>
                        setGeoFilter({ ...geoFilter, city: e.target.value })}
                    >
                        <option value="all">Toutes Villes</option>
                        <option value="Dakar">Dakar</option>
                        <option value="Abidjan">Abidjan</option>
                    </Select>
                    <div className="bg-slate-100 rounded-md p-1 flex">
                        {['7d', '30d', '3m'].map(p => (
                            <button key={p} onClick={() => setPeriod(p)}
                                className={`px-3 py-1 text-xs font-medium rounded transition-all ${period === p ?
                                    'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                            >
                                {p.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Global KPI Cards (F-ANALYT-04) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between pb-2">
                        <p className="text-sm font-medium text-slate-500">Chiffre d'affaires</p>
                        <ShoppingBag className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="text-2xl font-bold">{analyticsKPI.sales.toLocaleString()} FCFA</div>
                    <p className="text-xs text-slate-400 mt-1">Sur la sélection</p>
                </Card>
                <Card className="p-6 border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between pb-2">
                        <p className="text-sm font-medium text-slate-500">Marge Brute Réelle</p>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-700">{analyticsKPI.margin.toLocaleString()} FCFA
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="success">{(analyticsKPI.sales > 0 ? (analyticsKPI.margin /
                            analyticsKPI.sales * 100).toFixed(1) : 0)}%</Badge>
                        <span className="text-xs text-slate-400">de rentabilité</span>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between pb-2">
                        <p className="text-sm font-medium text-slate-500">Volume Commandes</p>
                        <Package className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="text-2xl font-bold">{analyticsKPI.count}</div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between pb-2">
                        <p className="text-sm font-medium text-slate-500">Panier Moyen</p>
                        <Users className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="text-2xl font-bold">{analyticsKPI.count > 0 ? Math.round(analyticsKPI.sales /
                        analyticsKPI.count).toLocaleString() : 0} FCFA</div>
                </Card>
            </div>

            {/* Analytic Tabs */}
            <div className="flex gap-4 border-b">
                <button onClick={() => setActiveAnalyticsTab('overview')} className={`pb-2 text-sm font-medium
                  border-b-2 transition-colors ${activeAnalyticsTab === 'overview' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500'}`}>Vue d'ensemble</button>
                <button onClick={() => setActiveAnalyticsTab('suppliers')} className={`pb-2 text-sm font-medium
                  border-b-2 transition-colors ${activeAnalyticsTab === 'suppliers' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500'}`}>Performance Fournisseurs (F-ANALYT-03)</button>
                <button onClick={() => setActiveAnalyticsTab('geo')} className={`pb-2 text-sm font-medium border-b-2
                  transition-colors ${activeAnalyticsTab === 'geo' ? 'border-slate-900 text-slate-900' :
                        'border-transparent text-slate-500'}`}>Géographie (F-ANALYT-02)</button>
            </div>

            {/* Tab Content */}
            {activeAnalyticsTab === 'overview' && (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <BarChart3 className="h-4 w-4 text-slate-500" /> Evolution des Ventes
                        </h3>
                        <div className="h-[250px] w-full">
                            <SimpleLineChart data={salesChartData} dataKey="daily" color="#3b82f6" fillArea={true} />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Globe className="h-4 w-4 text-slate-500" /> Top Zones (Ventes)
                        </h3>
                        <SimpleBarChart data={geoData} labelKey="label" valueKey="value" unit="F" />
                    </Card>
                </div>
            )}

            {activeAnalyticsTab === 'suppliers' && (
                <Card>
                    <div className="p-4 border-b bg-slate-50">
                        <h3 className="font-semibold text-slate-900">Classement Rentabilité Fournisseurs</h3>
                        <p className="text-xs text-slate-500">Basé sur la marge réelle générée par les produits vendus.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white text-slate-500 border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Fournisseur</th>
                                    <th className="px-4 py-3 font-medium text-right">Vol. Achat (Est.)</th>
                                    <th className="px-4 py-3 font-medium text-right">Vol. Ventes</th>
                                    <th className="px-4 py-3 font-medium text-right">Marge Totale</th>
                                    <th className="px-4 py-3 font-medium text-right">% Marge</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {supplierStats.map(stat => (
                                    <tr key={stat.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium">{stat.name}</td>
                                        <td className="px-4 py-3 text-right text-slate-500">
                                            {stat.totalPurchased.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">{stat.totalSales.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right font-bold text-green-600">
                                            +{stat.totalMargin.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Badge variant="outline">{stat.totalSales > 0 ? Math.round((stat.totalMargin /
                                                stat.totalSales) * 100) : 0}%</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {activeAnalyticsTab === 'geo' && (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4">Répartition par Ville</h3>
                        <SimpleBarChart data={geoData} labelKey="label" valueKey="value" unit="FCFA"
                            color="bg-blue-500" />
                    </Card>
                    <Card className="p-6 flex flex-col items-center justify-center text-center text-slate-500">
                        <MapPin className="h-12 w-12 mb-2 opacity-20" />
                        <p>La carte interactive des livraisons sera disponible prochainement.</p>
                    </Card>
                </div>
            )}

        </div>
    );
};
