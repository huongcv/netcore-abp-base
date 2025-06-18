import StockMoveStore from "@ord-store/Stock/stockMoveStore";
import ImportStockListStore from "@ord-store/Stock/import/importStockStore";
import DetailStockMoveStore from "@ord-store/Stock/detailStockMoveStore";
import ExportStockListStore from "@ord-store/Stock/exportStockStore";
import TransferStockListStore from "@ord-store/Stock/transferStockStore";
import CheckStockListStore from "@ord-store/Stock/checkStockStore";
import StockSearchProductTableStore from "@ord-store/Stock/searchProductTableStore";
import StockSearchProductFromShopTemplateStore from "@ord-store/Stock/searchProductTableFromShopTemplateStore";
import InventoryStockStore from "@ord-store/Stock/inventoryStockStore";
import OrderStockListStore from "@ord-store/Stock/orderStockStore";
import GdpOrderStockListStore from "@ord-store/Stock/gdpOrderStockStore";
import ExportStockMoveStore from "./exportStockMoveStore";
import StockSearchProductTableServerSideStore from "@ord-store/Stock/searchProductTableServerSideStore";
import ExportCancelListStore from "@ord-store/Stock/exportCancelStore";
import ImportStockUpsertStore from "@ord-store/Stock/import/importStockUpsertStore";

export const stockStorePart = {
  stockMoveStore: new StockMoveStore(),
  importStockStore: new ImportStockListStore(),
  importStockUpsertStore: new ImportStockUpsertStore(),
  exportStockStore: new ExportStockListStore(),
  exportCancelListStore: new ExportCancelListStore(),
  transferStockListStore: new TransferStockListStore(),
  orderStockListStore: new OrderStockListStore(),
  gdpOrderStockListStore: new GdpOrderStockListStore(),
  detailStockStore: new DetailStockMoveStore(),
  exportStockMoveStore: new ExportStockMoveStore(),
  checkStockListStore: new CheckStockListStore(),
  stockSearchProductStore: new StockSearchProductTableStore(),
  StockSearchProductTableServerSideStore: new StockSearchProductTableServerSideStore(),
  stockSearchProductFromShopTemplate:
    new StockSearchProductFromShopTemplateStore(),
  inventoryStockStore: new InventoryStockStore(),
};
