import ProductGroupListStore from "@ord-store/Product/productGroupStore";
import ProductListStore from "@ord-store/Product/productStore";
import ProductDetailStored from "@ord-store/Product/productDetailStore";
import ProductUnitStore from "@ord-store/Product/productUnitStore";
import ProductStockDetailStore from "@ord-store/Product/productStockDetailStore";
import ProductPriceListStore from "@ord-store/Product/productPriceListStore";
import ProductPriceListDetailStore from "@ord-store/Product/productPriceListDetailStore";
import ProductListPrintBarcodeStore from "@ord-store/Product/productListPrintBarcodeStore";
import ProductImportExcelStore from "@ord-store/Product/productImportExcelStore";
import ProductDiscountStore from "./productDiscountStore";
import ProductSalesPromotionStore from "./productSalesPromotionStore";
import PromotionFormStore from "./promotionFormStore";
import DiscountListPrintBarcodeStore from "./discountListPrintBarcodeStore";

export const productStorePart = {
  productGroupStore: new ProductGroupListStore(),
  productStore: new ProductListStore(),
  productDetailStore: new ProductDetailStored(),
  productUnitStore: new ProductUnitStore(),
  productStockDetailStore: new ProductStockDetailStore(),
  productPriceListStore: new ProductPriceListStore(),
  productPriceListDetailStore: new ProductPriceListDetailStore(),
  productListPrintBarCode: new ProductListPrintBarcodeStore(),
  productImportExcelStore: new ProductImportExcelStore(),
  productDiscountStore: new ProductDiscountStore(),
  ProductSalesPromotionStore: new ProductSalesPromotionStore(),
  promotionFormStore: new PromotionFormStore(),
  discountListPrintBarcodeStore: new DiscountListPrintBarcodeStore(),
};
