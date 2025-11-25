# Refactoring Walkthrough: SRS Compliance & Enhancements

I have refactored the application to align with the **NAFANKAP SRS & SDS** requirements and added requested enhancements.

## Key SRS Features Implemented

### 1. Unified CRM & Inbox (F-CRM / F-INBOX)
*   **Dossier Client View**: The `InboxView` now groups conversations by client.
*   **Omnichannel Tabs**: Within a client's dossier, you can switch between **WhatsApp**, **Facebook**, and **Instagram** tabs to see the specific conversation history for that channel without mixing timelines.
*   **Client Search**: Filter conversations by client name.

### 2. Inventory & Batch Management (F-STOCK)
*   **Lot (Batch) Tracking**: Products now track stock via specific **Batches** (Lots) containing purchase date, supplier, and unit cost.
*   **FIFO Allocation**: The `StockView` displays the detailed list of batches for each product, sorted by date (FIFO queue).

### 3. Order Processing & Margins (F-ORD / F-ANALYT)
*   **FIFO Logic**: When creating an order in `App.jsx`, the system automatically allocates stock from the oldest available batches.
*   **Real-time Margin Calculation**: The `OrdersView` calculates and displays the **Margin** for each order based on the specific batches used (Revenue - Cost of Goods Sold).
*   **Allocation Details**: In the Order Details modal, you can see exactly which batches were consumed for each item.

### 4. Order Management Enhancements
*   **Manual Status Change**: You can now manually change the status of an order (e.g., from "Nouveau" to "Confirmé" or "Annulé") directly from the Order Details modal.
*   **Driver Assignment**: Improved flow to assign or change a delivery partner.
*   **Price Override**: You can now manually edit the **Total Amount** of an order before generating the invoice, allowing for custom pricing or discounts.

### 5. Invoicing (F-BILL)
*   **PDF Preview**: You can now click **Aperçu** to view the invoice directly in the browser before downloading it.
*   **PDF Generation**: Click **PDF** to download the professional invoice file.
*   **Send Functionality**: An "Envoyer" button allows you to simulate sending the invoice via WhatsApp or Email (mocked for now).

### 6. Analytics (F-ANALYT)
*   **Correct Margin Calculation**: Fixed issues where margins were not calculating correctly due to missing cost data. Now uses the FIFO allocation costs.
*   **Supplier Stats**: Correctly links sold items to their suppliers to show which suppliers generate the most profit.
*   **Geo Analysis**: Correctly aggregates sales by city based on delivery addresses.

### 7. Data Model Updates
*   **Multi-tenancy**: Added `tenantId` to all data entities to support the multi-tenant architecture.
*   **Suppliers**: Added a dedicated Supplier entity linked to product batches.

## Project Structure

```
nafankap/
├── src/
│   ├── components/
│   │   ├── views/
│   │   │   ├── InboxView.jsx       # Updated for Dossier Client & Channels
│   │   │   ├── StockView.jsx       # Updated for Batches & Suppliers
│   │   │   ├── OrdersView.jsx      # Updated for Invoicing & Preview
│   │   │   ├── AnalyticsView.jsx   # Fixed margin & supplier calculations
│   │   │   └── ...
│   ├── data/
│   │   └── mockData.js             # Updated with SRS-compliant schema
│   ├── utils/
│   │   └── invoiceUtils.js         # PDF Generation Logic (jsPDF)
│   ├── App.jsx                     # Implements FIFO logic & State Management
│   └── ...
```

## How to Test SRS Features

1.  **Check FIFO Logic**:
    *   Go to **Stock**, note the batches for "Écouteurs sans fil Pro".
    *   Go to **Commandes**, create a new order for this product.
    *   Check the **Stock** again; the oldest batch quantity should decrease.
    *   Open the Order Details to see the "Allocation de stock".

2.  **Check Analytics**:
    *   Go to **Analytics**.
    *   Verify that "Marge Brute Réelle" displays a correct value (Sales - Cost of allocated batches).
    *   Check the **Performance Fournisseurs** tab to see the breakdown.

## Verification

The project builds successfully (`npm run build`). All business logic for the MVP scope of the SRS is implemented in the frontend state.
