import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, MoreHorizontal, Paperclip, Send, Phone, Facebook, Instagram } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

export const InboxView = ({ conversations, setConversations, openOrderModal, clients }) => {
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [activeChannelTab, setActiveChannelTab] = useState('whatsapp'); // whatsapp, facebook, instagram
    const [inputText, setInputText] = useState("");

    // Group conversations by Client
    const clientConversations = useMemo(() => {
        const grouped = {};
        conversations.forEach(conv => {
            if (!grouped[conv.clientId]) {
                grouped[conv.clientId] = {
                    client: clients.find(c => c.id === conv.clientId) || { name: conv.clientName, id: conv.clientId },
                    channels: {}
                };
            }
            grouped[conv.clientId].channels[conv.channel] = conv;
        });
        return Object.values(grouped);
    }, [conversations, clients]);

    const activeClientData = selectedClientId ? clientConversations.find(c => c.client.id === selectedClientId) : null;
    const activeConversation = activeClientData?.channels[activeChannelTab];

    const handleSendMessage = () => {
        if (!inputText.trim() || !activeConversation) return;

        const newMessage = {
            id: Date.now(),
            direction: 'OUT',
            type: 'text',
            content: inputText,
            date: new Date().toISOString()
        };

        // Update global state
        setConversations(prev => prev.map(c => {
            if (c.id === activeConversation.id) {
                return {
                    ...c,
                    messages: [...c.messages, newMessage],
                    lastMessagePreview: inputText,
                    lastMessageDate: new Date().toISOString()
                };
            }
            return c;
        }));

        setInputText("");
    };

    return (
        <div className="flex h-[calc(100vh-140px)] border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white">
            {/* Left: Client List */}
            <div className="w-full md:w-1/3 border-r flex flex-col">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input placeholder="Rechercher un client..." className="pl-9 bg-slate-50" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {clientConversations.map((item) => {
                        const lastConv = Object.values(item.channels).sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate))[0];
                        return (
                            <div key={item.client.id} onClick={() => setSelectedClientId(item.client.id)}
                                className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${selectedClientId === item.client.id ? 'bg-slate-100 border-l-4 border-l-slate-900' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="font-semibold text-sm flex items-center gap-2">
                                        <Avatar fallback={item.client.name.substring(0, 2).toUpperCase()} className="h-8 w-8" />
                                        {item.client.name}
                                    </div>
                                    <span className="text-[10px] text-slate-500">
                                        {lastConv ? new Date(lastConv.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-2 pl-10">
                                    <p className="text-xs text-slate-500 truncate max-w-[180px]">
                                        {lastConv?.lastMessagePreview}
                                    </p>
                                    <div className="flex gap-1">
                                        {item.channels['whatsapp'] && <div className="h-2 w-2 rounded-full bg-green-500" title="WhatsApp" />}
                                        {item.channels['facebook'] && <div className="h-2 w-2 rounded-full bg-blue-500" title="Facebook" />}
                                        {item.channels['instagram'] && <div className="h-2 w-2 rounded-full bg-purple-500" title="Instagram" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right: Dossier Client View (F-INBOX-02) */}
            <div className={`hidden md:flex flex-1 flex-col bg-slate-50 ${selectedClientId ? 'flex' : 'hidden'}`}>
                {activeClientData ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b bg-white shadow-sm z-10">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar fallback={activeClientData.client.name.substring(0, 2).toUpperCase()} />
                                    <div>
                                        <h3 className="font-semibold text-sm">{activeClientData.client.name}</h3>
                                        <p className="text-xs text-slate-500">{activeClientData.client.city}, {activeClientData.client.country}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => openOrderModal(activeClientData.client.id)}>
                                        <ShoppingBag className="h-3 w-3 mr-2" />
                                        Créer Commande
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Channel Tabs */}
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
                                <button onClick={() => setActiveChannelTab('whatsapp')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeChannelTab === 'whatsapp' ? 'bg-white shadow text-green-700' : 'text-slate-500 hover:text-slate-900'}`}>
                                    <Phone className="h-3 w-3" /> WhatsApp
                                </button>
                                <button onClick={() => setActiveChannelTab('facebook')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeChannelTab === 'facebook' ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-900'}`}>
                                    <Facebook className="h-3 w-3" /> Messenger
                                </button>
                                <button onClick={() => setActiveChannelTab('instagram')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeChannelTab === 'instagram' ? 'bg-white shadow text-purple-700' : 'text-slate-500 hover:text-slate-900'}`}>
                                    <Instagram className="h-3 w-3" /> Instagram
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-100/50">
                            {activeConversation ? (
                                activeConversation.messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.direction === 'OUT' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.direction === 'OUT'
                                            ? 'bg-slate-900 text-white rounded-br-none'
                                            : 'bg-white border text-slate-800 rounded-bl-none'}`}>
                                            <p>{msg.content}</p>
                                            <p className={`text-[10px] mt-1 text-right ${msg.direction === 'OUT' ? 'text-slate-300'
                                                : 'text-slate-400'}`}>{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <p>Aucune conversation sur ce canal.</p>
                                    <Button variant="link" className="mt-2">Démarrer une discussion</Button>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t bg-white">
                            <div className="flex gap-2 items-center">
                                <Button variant="ghost" size="icon">
                                    <Paperclip className="h-4 w-4 text-slate-500" />
                                </Button>
                                <Input placeholder={`Écrire sur ${activeChannelTab}...`} className="flex-1" value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    disabled={!activeConversation}
                                />
                                <Button size="icon" onClick={handleSendMessage} disabled={!activeConversation}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">
                        Sélectionnez un client pour voir le dossier
                    </div>
                )}
            </div>
        </div>
    );
};
