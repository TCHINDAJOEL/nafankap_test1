import React, { useState } from 'react';
import { Building, Smartphone, Phone, Facebook, UserPlus, Trash2, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const SettingsView = ({ users, setUsers }) => {
    const [settingsTab, setSettingsTab] = useState('general');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [newUserData, setNewUserData] = useState({ email: '', role: 'OPERATOR' });

    const handleCreateUser = () => {
        if (!newUserData.email) return;
        const newUser = {
            id: users.length + 1,
            name: "Invité",
            email: newUserData.email,
            role: newUserData.role,
            status: "En attente"
        };
        setUsers([...users, newUser]);
        setIsUserModalOpen(false);
        setNewUserData({ email: '', role: 'OPERATOR' });
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Paramètres</h2>

            <div className="flex gap-2 mb-6 border-b pb-1 overflow-x-auto">
                <button onClick={() => setSettingsTab('general')} className={`px-4 py-2 text-sm font-medium
                  border-b-2 transition-colors ${settingsTab === 'general' ? 'border-slate-900 text-slate-900' :
                        'border-transparent text-slate-500'}`}>Général</button>
                <button onClick={() => setSettingsTab('users')} className={`px-4 py-2 text-sm font-medium border-b-2
                  transition-colors ${settingsTab === 'users' ? 'border-slate-900 text-slate-900' :
                        'border-transparent text-slate-500'}`}>Utilisateurs (F-TENANT)</button>
                <button onClick={() => setSettingsTab('billing')} className={`px-4 py-2 text-sm font-medium
                  border-b-2 transition-colors ${settingsTab === 'billing' ? 'border-slate-900 text-slate-900' :
                        'border-transparent text-slate-500'}`}>Abonnement (F-SUB)</button>
            </div>

            {settingsTab === 'general' && (
                <div className="grid gap-6">
                    {/* Shop Profile */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Building className="h-5 w-5" /> Profil Boutique
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Nom de la boutique</label>
                                <Input defaultValue="Dakar Electronics" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Pays</label>
                                <Input defaultValue="Sénégal" disabled />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Ville</label>
                                <Input defaultValue="Dakar" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Quartier</label>
                                <Input defaultValue="Mermoz" />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button>Enregistrer</Button>
                        </div>
                    </Card>

                    {/* Integrations */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Smartphone className="h-5 w-5" /> Intégrations Canaux
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <Phone className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">WhatsApp Cloud API</p>
                                        <p className="text-xs text-slate-500">Connecté: +221 77 000 00 00</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm"
                                    className="text-red-500 hover:text-red-600">Déconnecter</Button>
                            </div>
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <Facebook className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Facebook Messenger</p>
                                        <p className="text-xs text-slate-500">Connecté: Page Dakar Elec</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm"
                                    className="text-red-500 hover:text-red-600">Déconnecter</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {settingsTab === 'users' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Utilisateurs & Rôles</h3>
                            <p className="text-sm text-slate-500">Gérez l'accès à votre boutique.</p>
                        </div>
                        <Button onClick={() => setIsUserModalOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4" /> Inviter Membre
                        </Button>
                    </div>

                    <Card>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Utilisateur</th>
                                    <th className="px-4 py-3">Rôle</th>
                                    <th className="px-4 py-3">Statut</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="border-b hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{u.name}</p>
                                                <p className="text-xs text-slate-500">{u.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={u.role === 'ADMIN' ? 'default' : 'outline'}>{u.role}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={u.status === 'Actif' ? 'success' : 'warning'}>{u.status}</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4 text-slate-400" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>

                    {/* Modal Invite User */}
                    <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Inviter un collaborateur">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Email</label>
                                <Input value={newUserData.email} onChange={(e) => setNewUserData({
                                    ...newUserData, email:
                                        e.target.value
                                })} placeholder="collegue@boutique.com" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Rôle</label>
                                <Select value={newUserData.role} onChange={(e) => setNewUserData({
                                    ...newUserData, role:
                                        e.target.value
                                })}>
                                    <option value="OPERATOR">Opérateur (Ventes & Clients)</option>
                                    <option value="ADMIN">Administrateur (Tout accès)</option>
                                </Select>
                            </div>
                            <Button className="w-full mt-4" onClick={handleCreateUser}>Envoyer Invitation</Button>
                        </div>
                    </Modal>
                </div>
            )}

            {settingsTab === 'billing' && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" /> Abonnement
                    </h3>
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border">
                        <div>
                            <p className="font-bold text-slate-900">Plan Pro (Mensuel)</p>
                            <p className="text-sm text-slate-500">Prochain paiement le 24 Déc 2025</p>
                        </div>
                        <Badge variant="success">ACTIF</Badge>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Button variant="outline">Gérer via Lemon Squeezy</Button>
                        <Button variant="outline">Payer par Wave/OM</Button>
                    </div>
                </Card>
            )}
        </div>
    );
};
