import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (order, tenant, download = true) => {
    const doc = new jsPDF();

    // --- Header ---
    doc.setFontSize(20);
    doc.text(tenant.name, 14, 22);

    doc.setFontSize(10);
    doc.text(`${tenant.address || ''}`, 14, 30);
    doc.text(`${tenant.city}, ${tenant.country}`, 14, 35);
    doc.text(`Tel: ${tenant.phone}`, 14, 40);
    doc.text(`Email: ${tenant.email || ''}`, 14, 45);

    // --- Invoice Details ---
    doc.setFontSize(16);
    doc.text('FACTURE', 140, 22);

    doc.setFontSize(10);
    doc.text(`N° Facture: FAC-${order.id.split('-')[1]}`, 140, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 35);
    doc.text(`Client: ${order.clientName}`, 140, 45);
    doc.text(`Adresse: ${order.deliveryAddress.city}, ${order.deliveryAddress.district}`, 140, 50);

    // --- Table ---
    const tableColumn = ["Article", "Quantité", "Prix Unitaire", "Total"];
    const tableRows = [];

    order.items.forEach(item => {
        const itemData = [
            item.productName,
            item.qty,
            `${item.unitPrice.toLocaleString()} FCFA`,
            `${(item.unitPrice * item.qty).toLocaleString()} FCFA`
        ];
        tableRows.push(itemData);
    });

    // Delivery Fees
    if (order.deliveryFees > 0) {
        tableRows.push([
            "Frais de livraison",
            "1",
            `${order.deliveryFees.toLocaleString()} FCFA`,
            `${order.deliveryFees.toLocaleString()} FCFA`
        ]);
    }

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] }, // Slate-900
        styles: { fontSize: 10, cellPadding: 3 },
    });

    // --- Totals ---
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL À PAYER: ${order.totalAmount.toLocaleString()} FCFA`, 140, finalY);

    // --- Footer ---
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text("Merci de votre confiance !", 105, 280, null, null, "center");

    // Save or Return
    if (download) {
        doc.save(`Facture_${order.id}.pdf`);
        return null; // No need to return URL when downloading
    }

    // Create blob URL for preview
    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
};
