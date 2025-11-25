import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (order, tenant, download = true) => {
    try {
        const doc = new jsPDF();

        // --- Header ---
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text(tenant.name || 'Entreprise', 14, 22);

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(tenant.address || '', 14, 30);
        doc.text(`${tenant.city || ''}, ${tenant.country || ''}`, 14, 35);
        doc.text(`Tel: ${tenant.phone || 'N/A'}`, 14, 40);
        doc.text(`Email: ${tenant.email || 'N/A'}`, 14, 45);

        // --- Invoice Details ---
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('FACTURE', 140, 22);

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const invoiceNumber = order.id ? order.id.split('-')[1] || order.id : '001';
        doc.text(`N° Facture: FAC-${invoiceNumber}`, 140, 30);

        const dateStr = new Date().toLocaleDateString('fr-FR');
        doc.text(`Date: ${dateStr}`, 140, 35);
        doc.text(`Client: ${order.clientName || 'Client'}`, 140, 45);

        const city = order.deliveryAddress?.city || '';
        const district = order.deliveryAddress?.district || '';
        doc.text(`Adresse: ${city}${district ? ', ' + district : ''}`, 140, 50);

        // --- Table ---
        const tableColumn = ["Article", "Quantite", "Prix Unitaire", "Total"];
        const tableRows = [];

        // Add items to table
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const itemData = [
                    item.productName || 'Produit',
                    String(item.qty || 0),
                    `${(item.unitPrice || 0).toLocaleString('fr-FR')} FCFA`,
                    `${((item.unitPrice || 0) * (item.qty || 0)).toLocaleString('fr-FR')} FCFA`
                ];
                tableRows.push(itemData);
            });
        }

        // Delivery Fees
        if (order.deliveryFees && order.deliveryFees > 0) {
            tableRows.push([
                "Frais de livraison",
                "1",
                `${order.deliveryFees.toLocaleString('fr-FR')} FCFA`,
                `${order.deliveryFees.toLocaleString('fr-FR')} FCFA`
            ]);
        }

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 60,
            theme: 'grid',
            headStyles: {
                fillColor: [15, 23, 42],
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 10,
                cellPadding: 3,
                overflow: 'linebreak',
                cellWidth: 'wrap'
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
        doc.setFont(undefined, 'bold');
        const totalAmount = order.totalAmount || 0;
        doc.text(`TOTAL A PAYER: ${totalAmount.toLocaleString('fr-FR')} FCFA`, 140, finalY);

        // --- Footer ---
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text("Merci de votre confiance !", 105, 280, { align: "center" });

        // Save or Return
        if (download) {
            const fileName = `Facture_${order.id || 'invoice'}.pdf`;
            doc.save(fileName);
            return null;
        }

        // Create blob URL for preview
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        return url;
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Erreur lors de la génération de la facture. Veuillez réessayer.');
        return null;
    }
};
