import ReportStockImportExportInventoryStore from "@ord-store/Report/ReportStockImportExportInventoryStore";

class InventoryStockStore extends ReportStockImportExportInventoryStore {

    getNamespaceLocale(): string {
        return "stock_inventory"
    }

}

export default InventoryStockStore;
