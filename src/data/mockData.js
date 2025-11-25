// NAFANKAP SRS COMPLIANT MOCK DATA

// 3.1 Tenants & Utilisateurs
export const INITIAL_TENANT = {
    id: "TEN-001",
    name: "Dakar Electronics",
    country: "Sénégal",
    city: "Dakar",
    district: "Mermoz",
    phone: "+221 77 000 00 00",
    email: "contact@dakarelec.sn",
    plan: "PRO",
    subscriptionStatus: "ACTIVE",
    currency: "FCFA"
};

export const INITIAL_USERS = [
    { id: "USR-001", tenantId: "TEN-001", name: "Amadou K.", email: "amadou@shop.com", phone: "+221770000001", role: "ADMIN", status: "Actif" },
    { id: "USR-002", tenantId: "TEN-001", name: "Sarah L.", email: "sarah@shop.com", phone: "+221770000002", role: "OPERATOR", status: "Actif" },
];

// 3.4 Fournisseurs
export const INITIAL_SUPPLIERS = [
    { id: 1, tenantId: "TEN-001", name: "TechImport SA", country: "Chine", city: "Shenzhen", phone: "+86 100 200", reliability: "Bon", notes: "Fournisseur principal écouteurs" },
    { id: 2, tenantId: "TEN-001", name: "Global Trade", country: "Dubaï", city: "Dubaï", phone: "+971 50 000", reliability: "Moyen", notes: "Bon pour les montres" },
];

// 3.5 Produits & Lots (F-PROD / F-STOCK)
export const INITIAL_PRODUCTS = [
    {
        id: 1,
        tenantId: "TEN-001",
        name: "Écouteurs sans fil Pro",
        description: "Écouteurs à réduction de bruit active.",
        price: 15000, // Prix de vente conseillé
        image: null,
        stock: 45, // Calculated from batches
        batches: [ // F-STOCK-01: Lots d'achat
            {
                id: "BATCH-101",
                productId: 1,
                supplierId: 1,
                supplierName: "TechImport SA",
                date: "2023-10-01",
                qtyPurchased: 50,
                qtyRemaining: 45,
                unitCost: 8000,
                location: "Dakar"
            }
        ]
    },
    {
        id: 2,
        tenantId: "TEN-001",
        name: "Montre Connectée Z",
        description: "Montre étanche avec GPS.",
        price: 25000,
        image: null,
        stock: 12,
        batches: [
            {
                id: "BATCH-102",
                productId: 2,
                supplierId: 2,
                supplierName: "Global Trade",
                date: "2023-11-10",
                qtyPurchased: 20,
                qtyRemaining: 12,
                unitCost: 15000,
                location: "Dakar"
            }
        ]
    },
    {
        id: 3,
        tenantId: "TEN-001",
        name: "Support Téléphone",
        description: "Support voiture universel.",
        price: 5000,
        image: null,
        stock: 100,
        batches: [
            {
                id: "BATCH-103",
                productId: 3,
                supplierId: 1,
                supplierName: "TechImport SA",
                date: "2023-09-15",
                qtyPurchased: 150,
                qtyRemaining: 100,
                unitCost: 1500,
                location: "Dakar"
            }
        ]
    }
];

// 3.2 Clients & Contacts (F-CRM)
export const INITIAL_CLIENTS = [
    {
        id: "CL-001",
        tenantId: "TEN-001",
        name: "Moussa Diop",
        country: "Sénégal",
        city: "Dakar",
        district: "Plateau",
        notes: "Client fidèle",
        totalSpent: 15000,
        lastOrderDate: "2023-11-24",
        contactMethods: [ // F-CRM-02
            { type: "whatsapp", value: "+221770000000", isPrimary: true },
            { type: "facebook", value: "123456789", isPrimary: false }
        ]
    },
    {
        id: "CL-002",
        tenantId: "TEN-001",
        name: "Fatou Ndiaye",
        country: "Sénégal",
        city: "Dakar",
        district: "Almadies",
        notes: "",
        totalSpent: 25000,
        lastOrderDate: "2023-11-24",
        contactMethods: [
            { type: "instagram", value: "fatou_style", isPrimary: true },
            { type: "whatsapp", value: "+221761111111", isPrimary: false }
        ]
    },
    {
        id: "CL-003",
        tenantId: "TEN-001",
        name: "Jean Kouassi",
        country: "Côte d'Ivoire",
        city: "Abidjan",
        district: "Cocody",
        notes: "Intéressé par l'export",
        totalSpent: 8500,
        lastOrderDate: "2023-11-23",
        contactMethods: [
            { type: "facebook", value: "jean.kouassi.99", isPrimary: true }
        ]
    }
];

// 3.3 Conversations & Messages (F-INBOX)
export const INITIAL_CONVERSATIONS = [
    {
        id: "CONV-001",
        tenantId: "TEN-001",
        clientId: "CL-001",
        clientName: "Moussa Diop",
        channel: "whatsapp",
        status: "OPEN",
        unreadCount: 2,
        lastMessageDate: "2023-11-25T10:30:00",
        lastMessagePreview: "Je prends. Livraison Plateau ?",
        messages: [
            { id: 1, direction: "IN", type: "text", content: "Bonjour, le prix svp ?", date: "2023-11-25T10:00:00" },
            { id: 2, direction: "OUT", type: "text", content: "Bonjour ! 15,000 FCFA.", date: "2023-11-25T10:05:00" },
            { id: 3, direction: "IN", type: "text", content: "Je prends. Livraison Plateau ?", date: "2023-11-25T10:30:00" }
        ]
    },
    {
        id: "CONV-002",
        tenantId: "TEN-001",
        clientId: "CL-002",
        clientName: "Fatou Ndiaye",
        channel: "instagram",
        status: "CLOSED",
        unreadCount: 0,
        lastMessageDate: "2023-11-24T15:00:00",
        lastMessagePreview: "Super merci !",
        messages: [
            { id: 1, direction: "OUT", type: "text", content: "Votre commande est partie.", date: "2023-11-24T14:00:00" },
            { id: 2, direction: "IN", type: "text", content: "Super merci !", date: "2023-11-24T15:00:00" }
        ]
    },
    {
        id: "CONV-003",
        tenantId: "TEN-001",
        clientId: "CL-003",
        clientName: "Jean Kouassi",
        channel: "facebook",
        status: "OPEN",
        unreadCount: 0,
        lastMessageDate: "2023-11-23T09:00:00",
        lastMessagePreview: "Vous livrez à Abidjan ?",
        messages: [
            { id: 1, direction: "IN", type: "text", content: "Vous livrez à Abidjan ?", date: "2023-11-23T09:00:00" }
        ]
    }
];

// 3.6 Commandes & Livraisons (F-ORD / F-DEL)
export const INITIAL_DELIVERY_PARTNERS = [
    { id: 1, tenantId: "TEN-001", name: "Moussa Express", phone: "+221 77 111 22 33", zone: "Dakar & Banlieue", type: "Indépendant" },
    { id: 2, tenantId: "TEN-001", name: "Tiak Tiak Pro", phone: "+221 77 444 55 66", zone: "National", type: "Agence" },
];

export const INITIAL_ORDERS = [
    {
        id: "CMD-001",
        tenantId: "TEN-001",
        clientId: "CL-001",
        clientName: "Moussa Diop",
        status: "Livré",
        date: "2023-11-24",
        deliveryAddress: { country: "Sénégal", city: "Dakar", district: "Plateau" },
        deliveryPartnerId: 1,
        deliveryFees: 1500,
        totalAmount: 16500, // 15000 + 1500
        items: [
            {
                productId: 1,
                productName: "Écouteurs sans fil Pro",
                qty: 1,
                unitPrice: 15000,
                allocations: [ // F-STOCK-02: Allocation de stock (FIFO)
                    { batchId: "BATCH-101", qty: 1, unitCost: 8000 }
                ]
            }
        ],
        invoiceUrl: null
    },
    {
        id: "CMD-002",
        tenantId: "TEN-001",
        clientId: "CL-002",
        clientName: "Fatou Ndiaye",
        status: "En livraison",
        date: "2023-11-24",
        deliveryAddress: { country: "Sénégal", city: "Dakar", district: "Almadies" },
        deliveryPartnerId: 2,
        deliveryFees: 2000,
        totalAmount: 27000,
        items: [
            {
                productId: 2,
                productName: "Montre Connectée Z",
                qty: 1,
                unitPrice: 25000,
                allocations: [
                    { batchId: "BATCH-102", qty: 1, unitCost: 15000 }
                ]
            }
        ],
        invoiceUrl: null
    },
    {
        id: "CMD-003",
        tenantId: "TEN-001",
        clientId: "CL-003",
        clientName: "Jean Kouassi",
        status: "Confirmé",
        date: "2023-11-23",
        deliveryAddress: { country: "Côte d'Ivoire", city: "Abidjan", district: "Cocody" },
        deliveryPartnerId: null,
        deliveryFees: 5000,
        totalAmount: 13500,
        items: [
            {
                productId: 3,
                productName: "Support Téléphone",
                qty: 1,
                unitPrice: 5000,
                allocations: [
                    { batchId: "BATCH-103", qty: 1, unitCost: 1500 }
                ]
            },
            {
                productId: 3,
                productName: "Support Téléphone",
                qty: 1,
                unitPrice: 3500, // Prix remisé
                allocations: [
                    { batchId: "BATCH-103", qty: 1, unitCost: 1500 }
                ]
            }
        ],
        invoiceUrl: null
    }
];
