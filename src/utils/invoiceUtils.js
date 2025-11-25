import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Helper function to format numbers
const formatAmount = (amount) => {
    if (!amount) return '0';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const generateInvoicePDF = (order, tenant, download = true) => {
    try {
        console.log('Génération PDF - Commande:', order);
        console.log('Génération PDF - Tenant:', tenant);

        const doc = new jsPDF();

        // --- Header ---
        doc.setFontSize(20);
        doc.text(tenant.name || 'Entreprise', 14, 22);

        doc.setFontSize(10);
        if (tenant.address) doc.text(tenant.address, 14, 30);
        if (tenant.city || tenant.country) {
            doc.text(`${tenant.city || ''}, ${tenant.country || ''}`, 14, 35);
        }
        doc.text(`Tel: ${tenant.phone || 'N/A'}`, 14, 40);
        doc.text(`Email: ${tenant.email || 'N/A'}`, 14, 45);

        // --- Invoice Details ---
        doc.setFontSize(16);
        doc.text('FACTURE', 140, 22);

        doc.setFontSize(10);
        const invoiceNumber = order.id ? order.id.split('-')[1] || order.id : '001';
        doc.text(`No Facture: FAC-${invoiceNumber}`, 140, 30);

        const dateStr = new Date().toLocaleDateString('fr-FR');
        doc.text(`Date: ${dateStr}`, 140, 35);
        doc.text(`Client: ${order.clientName || 'Client'}`, 140, 45);

        const city = order.deliveryAddress?.city || '';
        const district = order.deliveryAddress?.district || '';
        if (city || district) {
            doc.text(`Adresse: ${city}${district ? ', ' + district : ''}`, 140, 50);
        }

        // --- Table ---
        const tableColumn = ["Article", "Quantite", "Prix Unitaire", "Total"];
        const tableRows = [];

        console.log('Items:', order.items);

        // Add items to table
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const qty = item.qty || 0;
                const unitPrice = item.unitPrice || 0;
                const total = unitPrice * qty;

                const itemData = [
                    item.productName || 'Produit',
                    String(qty),
                    `${formatAmount(unitPrice)} FCFA`,
                    `${formatAmount(total)} FCFA`
                ];
                tableRows.push(itemData);
            });
        }

        // Delivery Fees
        if (order.deliveryFees && order.deliveryFees > 0) {
            tableRows.push([
                "Frais de livraison",
                "1",
                `${formatAmount(order.deliveryFees)} FCFA`,
                `${formatAmount(order.deliveryFees)} FCFA`
            ]);
        }

        console.log('Table rows:', tableRows);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 60,
            theme: 'grid',
            headStyles: {
                fillColor: [15, 23, 42],
                textColor: [255, 255, 255],
                fontSize: 10
            },
            styles: {
                fontSize: 10,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 30, halign: 'center' },
                2: { cellWidth: 40, halign: 'right' },
                3: { cellWidth: 40, halign: 'right' }
            }
        });

        // --- Totals ---
        const finalY = doc.lastAutoTable.finalY + 10;

        doc.setFontSize(12);
        const totalAmount = order.totalAmount || 0;
        doc.text(`TOTAL A PAYER: ${formatAmount(totalAmount)} FCFA`, 140, finalY);

        // --- Footer ---
        doc.setFontSize(8);
        doc.text("Merci de votre confiance !", 105, 280, null, null, 'center');

        // Save or Return
        if (download) {
            const fileName = `Facture_${order.id || 'invoice'}.pdf`;
            console.log('Téléchargement du fichier:', fileName);
            doc.save(fileName);
            return null;
        }

        // Create blob URL for preview
        console.log('Création du blob pour aperçu');
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        console.log('URL blob créée:', url);
        return url;
    } catch (error) {
        console.error('Erreur détaillée lors de la génération du PDF:', error);
        console.error('Stack trace:', error.stack);
        alert(`Erreur lors de la génération de la facture: ${error.message}`);
        return null;
    }
};
