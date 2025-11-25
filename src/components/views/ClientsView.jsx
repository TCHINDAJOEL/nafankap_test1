import React, { useState } from 'react';
import { Plus, ChevronRight, Phone, MapPin, MessageSquare, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const ClientsView = ({ clients, setIsClientModalOpen }) => {
    const [selectedClient, setSelectedClient] = useState(null);

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
                <Button onClick={() => setIsClientModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Nouveau Client
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b">
                    <Input placeholder="Rechercher par nom, téléphone..." className="max-w-sm" />
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-4 py-3">Client</th>
                            <th className="px-4 py-3">Téléphone</th>
                            <th className="px-4 py-3">Ville / Quartier</th>
                            <th className="px-4 py-3 text-right">Total Achat</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id} className="border-b hover:bg-slate-50 transition-colors cursor-pointer"
                                onClick={() => setSelectedClient(client)}>
                                <td className="px-4 py-3 font-medium flex items-center gap-3">
                                    <Avatar fallback={client.name.substring(0, 2).toUpperCase()}
                                        className="h-8 w-8 text-xs" />
                                    {client.name}
                                </td>
                                <td className="px-4 py-3 text-slate-500">{client.phone}</td>
                                <td className="px-4 py-3">{client.city} <span className="text-slate-400">/
                                    {client.district}</span></td>
                                <td className="px-4 py-3 text-right font-medium">{client.totalSpent.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <ChevronRight className="h-4 w-4 text-slate-400 inline" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* Client Detail Modal (Fiche Client) */}
            <Modal isOpen={!!selectedClient} onClose={() => setSelectedClient(null)} title="Fiche Client">
                {selectedClient && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar fallback={selectedClient.name.substring(0, 2).toUpperCase()}
                                className="h-16 w-16 text-xl" />
                            <div>
                                <h2 className="text-xl font-bold">{selectedClient.name}</h2>
                                <p className="text-sm text-slate-500">Client depuis 2023</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-lg border">
                                <div
                                    className="flex items-center gap-2 text-slate-500 mb-1 text-xs uppercase font-semibold">
                                    <Phone className="h-3 w-3" /> Téléphone
                                </div>
                                <p className="font-medium">{selectedClient.phone}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border">
                                <div
                                    className="flex items-center gap-2 text-slate-500 mb-1 text-xs uppercase font-semibold">
                                    <MapPin className="h-3 w-3" /> Adresse
                                </div>
                                <p className="font-medium">{selectedClient.city}, {selectedClient.district}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2 text-sm">Canaux de contact</h4>
                            <div className="flex gap-2">
                                {selectedClient.channels.map(c => (
                                    <Badge key={c} variant="outline" className="capitalize px-3 py-1">
                                        {c === 'whatsapp' && <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />}
                                        {c === 'instagram' && <span className="h-2 w-2 rounded-full bg-purple-500 mr-2" />}
                                        {c === 'facebook' && <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />}
                                        {c}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-3 text-sm">Dernières Activités</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Dernière commande</span>
                                    <span className="font-medium">{selectedClient.lastOrder}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Total dépensé</span>
                                    <span
                                        className="font-bold text-green-600">{selectedClient.totalSpent.toLocaleString()}
                                        FCFA</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button className="flex-1">
                                <MessageSquare className="mr-2 h-4 w-4" /> Message
                            </Button>
                            <Button variant="outline" className="flex-1">
                                <FileText className="mr-2 h-4 w-4" /> Factures
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
