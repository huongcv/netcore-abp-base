import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { lazy } from "react";
import {AppExtendCode} from "@ord-core/AppConst";

export const ReportRouter: OrdRouterItem[] = [
  {
    path: AppExtendCode.proShop +"/report",
    lazyComponent: lazy(() => import("@pages/Report/ListRepost")),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },

  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/medication-sales",
    lazyComponent: lazy(
      () => import("@pages/Report/PharmacyLog/ReportMedicationSales")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/drug-recall-tracking",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/DrugRecall/ReportPharmacyLogDrugRecall"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/drug-stock-in-out",
    lazyComponent: lazy(
      () => import("@pages/Report/PharmacyLog/ReportPharmacyLogDrugStockInOut")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/expiration-date-tracking",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/ReportPharmacyLogExpirationDateTracking"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/patient-information",
    lazyComponent: lazy(
      () =>
        import("@pages/Report/PharmacyLog/ReportPharmacyLogPatientInformation")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/prescription-drug-sales",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/ReportPharmacyLogPrescriptionDrugSales"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/non-prescription-drug-sales",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/ReportPharmacyLogNonPrescriptionDrugSales"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/quality-inspection",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/QualityInspection/ReportPharmacyLogQualityInspection"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/quality-inspection/create",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/QualityInspection/CruQualityInspectionReport"
        )
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/quality-inspection/update/:hashId",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/QualityInspection/CruQualityInspectionReport"
        )
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/medication-sales",
    lazyComponent: lazy(
      () => import("@pages/Report/PharmacyLog/ReportMedicationSales")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/drug-recall-tracking",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/DrugRecall/ReportPharmacyLogDrugRecall"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  // báo cáo phản ứng có hại của thuốc
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/adverse-drug-reaction",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/AdverseReaction/ReportPharmacyAdverseReaction"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/adverse-drug-reaction/create-update",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/AdverseReaction/Form/CreateOrUpdateFormAdverseReaction"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/adverse-drug-reaction/create-update/:id",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/AdverseReaction/Form/CreateOrUpdateFormAdverseReaction"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },

  // end router báo cáo phản ứng có hại của thuốc
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/drug-stock-in-out",
    lazyComponent: lazy(
      () => import("@pages/Report/PharmacyLog/ReportPharmacyLogDrugStockInOut")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path:AppExtendCode.proShop + "/report/pharmacy-log/expiration-date-tracking",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/ReportPharmacyLogExpirationDateTracking"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/patient-information",
    lazyComponent: lazy(
      () =>
        import("@pages/Report/PharmacyLog/ReportPharmacyLogPatientInformation")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/prescription-drug-sales",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/ReportPharmacyLogPrescriptionDrugSales"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    // báo cáo khuyến nại
    path: AppExtendCode.proShop +"/report/pharmacy-log/complaint-handling",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/ComplaintLog/ReportPharmacyComplaintLog"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/non-prescription-drug-sales",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/ReportPharmacyLogNonPrescriptionDrugSales"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path:AppExtendCode.proShop + "/report/pharmacy-log/temperature-humidity",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/TempHumidityTracking/TempHumidityTracking"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/sanitation-monitoring",
    lazyComponent: lazy(
      () => import("@pages/Report/PharmacyLog/CleaningTaskTracking/index")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },

  {
    path: AppExtendCode.proShop +"/report/daily-summary/sell",
    lazyComponent: lazy(
      () => import("@pages/Report/DailySummary/ReportDailySummarySell")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/daily-summary/product",
    lazyComponent: lazy(
      () => import("@pages/Report/DailySummary/ReportDailySummaryProduct")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/daily-summary/income",
    lazyComponent: lazy(
      () => import("@pages/Report/DailySummary/ReportDailySummaryIncome")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/daily-summary/hand-over",
    lazyComponent: lazy(
      () => import("@pages/Report/DailySummary/ReportDailyHandOver")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/daily-summary/shift-revenue",
    lazyComponent: lazy(
      () => import("@pages/Report/DailySummary/ReportDailySummaryShiftRevenue")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },

  {
    path: AppExtendCode.proShop +"/report/sale/revenue",
    lazyComponent: lazy(() => import("@pages/Report/Sell/ReportSellRevenue")),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/sale/product",
    lazyComponent: lazy(() => import("@pages/Report/Sell/ReportSellProduct")),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/sale/income",
    lazyComponent: lazy(() => import("@pages/Report/Sell/ReportIncome")),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/sale/profit",
    lazyComponent: lazy(
      () => import("@pages/Report/Sell/ReportSellProfit/ReportSellProfit")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/customer/revenue",
    lazyComponent: lazy(
      () => import("@pages/Report/Customer/ReportCustomerRevenue")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/customer/revenue-details",
    lazyComponent: lazy(
      () => import("@pages/Report/Customer/ReportCustomerRevenueDetail")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/customer/debt",
    lazyComponent: lazy(
      () => import("@pages/Report/Customer/ReportCustomerDebt")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/sale/revenue-details",
    lazyComponent: lazy(
      () => import("@pages/Report/Sell/ReportSellRevenueDetails")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/stock/import-export-inventory",
    lazyComponent: lazy(
      () => import("@pages/Report/Stock/ReportStockImportExportInventory")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/stock/disposal-report",
    lazyComponent: lazy(
      () => import("@pages/Report/Stock/ReportStockDisposalReport")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/stock/commodity-expiry",
    lazyComponent: lazy(
      () => import("@pages/Report/Stock/ReportStockCommodityExpiry")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop + "/report/stock/commodity-plan",
    lazyComponent: lazy(
      () => import("@pages/Report/Stock/ReportStockCommodityPlan")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/employee/revenue",
    lazyComponent: lazy(
      () => import("@pages/Report/Employee/ReportEmployeeRevenue")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/employee/revenue-details",
    lazyComponent: lazy(
      () => import("@pages/Report/Employee/ReportEmployeeRevenueDetail")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/employee/revenue-product",
    lazyComponent: lazy(
      () => import("@pages/Report/Employee/ReportEmployeeProduct")
    ),
  },

  {
    path: AppExtendCode.proShop +"/report/doctor/revenue",
    lazyComponent: lazy(
      () => import("@pages/Report/Doctor/Revenue/ReportDoctorRevenue")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/doctor/profit",
    lazyComponent: lazy(
      () => import("@pages/Report/Doctor/Profit/ReportDoctorProfit")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/doctor/product",
    lazyComponent: lazy(
      () => import("@pages/Report/Doctor/ReportDoctorProduct")
    ),
  },

  {
    path: AppExtendCode.proShop +"/report/supplier/supplier-product",
    lazyComponent: lazy(
      () => import("@pages/Report/Supplier/ReportSupplierProduct")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/supplier/supplier-import",
    lazyComponent: lazy(
      () => import("@pages/Report/Supplier/ReportSupplierImport")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/supplier/supplier-debt",
    lazyComponent: lazy(
      () => import("@pages/Report/Supplier/ReportSupplierDebt")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/financial/financial-details",
    lazyComponent: lazy(
      () => import("@pages/Report/Financial/ReportFinancialDetails")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/medication-sales",
    lazyComponent: lazy(
      () => import("@pages/Report/PharmacyLog/ReportMedicationSales")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/drug-recall-tracking",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/DrugRecall/ReportPharmacyLogDrugRecall"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop +"/report/pharmacy-log/drug-stock-in-out",
    lazyComponent: lazy(
      () => import("@pages/Report/PharmacyLog/ReportPharmacyLogDrugStockInOut")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop + "/report/pharmacy-log/expiration-date-tracking",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/ReportPharmacyLogExpirationDateTracking"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop + "/report/pharmacy-log/patient-information",
    lazyComponent: lazy(
      () =>
        import("@pages/Report/PharmacyLog/ReportPharmacyLogPatientInformation")
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop + "/report/pharmacy-log/prescription-drug-sales",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/ReportPharmacyLogPrescriptionDrugSales"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop + "/report/pharmacy-log/non-prescription-drug-sales",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/ReportPharmacyLogNonPrescriptionDrugSales"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop + "/report/pharmacy-log/quality-inspection",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/QualityInspection/ReportPharmacyLogQualityInspection"
        )
    ),
    // permission: PERMISSION_APP.saleInvoice.sell,
  },
  {
    path: AppExtendCode.proShop + "/report/pharmacy-log/quality-inspection/create",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/QualityInspection/CruQualityInspectionReport"
        )
    ),
  },
  {
    path: AppExtendCode.proShop + "/report/pharmacy-log/quality-inspection/create/:timeType/:executionTime",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/QualityInspection/CruQualityInspectionReport"
        )
    ),
  },
  {
    path: AppExtendCode.proShop + "/report/pharmacy-log/quality-inspection/update/:hashId",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/Report/PharmacyLog/QualityInspection/CruQualityInspectionReport"
        )
    ),
  },
  {
    path: AppExtendCode.proShop + "/report/pharmacy-log/quality-inspection/view/:hashId/:readonly",
    lazyComponent: lazy(
        () =>
            import(
                "@pages/Report/PharmacyLog/QualityInspection/CruQualityInspectionReport"
                )
    ),
  },
  {
    path: AppExtendCode.proShop + "/report/pharmacy-log/controlled-drugs-stock",
    lazyComponent: lazy(
        () =>
            import(
                "@pages/Report/PharmacyLog/ReportPharmacyLogControlledDrugStock"
                )
    ),
  },
  {
    path: AppExtendCode.proShop + "/report/pharmacy-log/controlled-drugs-loss",
    lazyComponent: lazy(
        () =>
            import(
                "@pages/Report/PharmacyLog/ReportPharmacyLogControlledDrugLoss"
                )
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/tax/tax-declaration",
    lazyComponent: lazy(
      () => import("@pages/Report/Tax/TaxDeclaration/TaxDeclarationList")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/tax/tax-declaration/:id",
    lazyComponent: lazy(
      () => import("@pages/Report/Tax/TaxDeclaration/form/BusinessTaxForm")
    ),
  },
   {
    path: AppExtendCode.proShop +"/report/tax/tax-declaration",
    lazyComponent: lazy(
      () => import("@pages/Report/Tax/TaxDeclaration/TaxDeclarationList")
    ),
  },
   {
    path: AppExtendCode.proShop +"/report/tax/tax-declaration",
    lazyComponent: lazy(
      () => import("@pages/Report/Tax/TaxDeclaration/TaxDeclarationList")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/business-house-hold/cash-book",
    lazyComponent: lazy(
      () => import("@pages/Report/BusinessHouseHold/CashBook/CashBookReport")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/business-house-hold/product-book",
    lazyComponent: lazy(
        () => import("@pages/Report/BusinessHouseHold/ProductBook/ProductBook")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/business-house-hold/product-revenue-book",
    lazyComponent: lazy(
        () => import("@pages/Report/BusinessHouseHold/ProductRevenueBook/index")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/business-house-hold/bank-book",
    lazyComponent: lazy(
      () => import("@pages/Report/BusinessHouseHold/BankBook/BankBookReport")
    ),
  },
  {
    path: AppExtendCode.proShop +"/report/business-house-hold/production-business-cost-book",
    lazyComponent: lazy(
      () => import("@pages/Report/BusinessHouseHold/ProductionBusinessCostBook/ProductionBusinessCostBookReport")
    ),
  },
   {
    path: AppExtendCode.proShop +"/report/business-house-hold/tax-liability",
    lazyComponent: lazy(
      () => import("@pages/Report/BusinessHouseHold/TaxLiabilityBook/TaxLiabilityBookReport")
    ),
  },
   {
    path: AppExtendCode.proShop +"/report/business-house-hold/employee-salary-payment-book",
    lazyComponent: lazy(
      () => import("@pages/Report/BusinessHouseHold/EmployeeSalaryPaymentBook/EmployeeSalaryPaymentBookReport")
    ),
  },
];
