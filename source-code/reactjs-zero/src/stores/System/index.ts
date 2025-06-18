import StockInventoryStore from "@ord-store/System/stockInventoryStore";
import EmployeeStore from "@ord-store/System/employeeStore";
import ShopTemplateStore from "@ord-store/System/shopTemplateStore";
import SearchProductShopTplTableStore from "@ord-store/System/searchProductShopTplTableStore";
import ShopSalesOrderSampleStore from "./shopSalesOrderSampleStore";
import ShopReceiptSampleStore from "./shopReceiptSample";
import ShopTemplatePrinterStore from "./shopTemplatePrinterStore";
import GeneralInfoSettingStore from "@ord-store/System/GeneralInfoSettingStore";

export const systemPart = {
  stockInventoryStore: new StockInventoryStore(),
  employeeStore: new EmployeeStore(),
  shopTemplateStore: new ShopTemplateStore(),
  shopTemplatePrinterStore: new ShopTemplatePrinterStore(), 
  searchProductShopTplTableStore: new SearchProductShopTplTableStore(),
  shopSalesOrderSampleStore: new ShopSalesOrderSampleStore(),
  shopReceiptSampleStore: new ShopReceiptSampleStore(),
  generalInfoSettingStore: new GeneralInfoSettingStore()
};
