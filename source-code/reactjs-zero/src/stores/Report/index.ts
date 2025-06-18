import ReportSellRevenueStore from "@ord-store/Report/ReportSellRevenueStore";
import ReportSellRevenueDetailsStore from "@ord-store/Report/ReportSellRevenueDetailsStore";
import CustomerRevenueReportStore from "@ord-store/Report/customerRevenueReportStore";
import CustomerRevenueReportDetailStore from "@ord-store/Report/customerRevenueReportDetailStore";
import ReportSellProductStore from "@ord-store/Report/ReportSellProductStore";
import CustomerDebtReportStore from "@ord-store/Report/customerDebtReportStore";
import ReportSellInComeStore from "@ord-store/Report/ReportSellIncomeStore";
import ReportSellProfitStore from "@ord-store/Report/ReportSellProfitStore";
import ReportStockImportExportInventoryStore from "@ord-store/Report/ReportStockImportExportInventoryStore";
import EmployeeRevenueReportStore from "@ord-store/Report/employeeRevenueReportStore";
import EmployeeRevenueReportDetailStore from "@ord-store/Report/employeeRevenueReportDetailStore";
import EmployeeProductReportStore from "@ord-store/Report/employeeProductReportStore";
import SupplierProductReportStore from "@ord-store/Report/supplierProductReportStore";
import SupplierImportReportStore from "@ord-store/Report/supplierImportReportStore";
import ReportStockDisposalReportStore from "@ord-store/Report/ReportStockDisposalReportStore";
import ReportStockCommodityExpiryStore from "@ord-store/Report/ReportStockCommodityExpiryStore";
import reportDailySummaryIncomeStore from "@ord-store/Report/ReportDailySummaryIncomeStore";
import ReportDailySummaryProductStore from "@ord-store/Report/ReportDailySummaryProductStore";
import ReportDailySummarySellStore from "@ord-store/Report/DailySummary/ReportDailySummarySellStore";
import ReportStockCommodityPlanStore from "@ord-store/Report/ReportStockCommodityPlanStore";
import FinancialReportStore from "@ord-store/Report/FinancialReportStore";
import SupplierDebtReportStore from "@ord-store/Report/supplierDebtReportStore";
import ReportDailyHandOverStore from "@ord-store/Report/ReportDailyHandOverStore";
import ReportDailySummaryShiftRevenueStore from "@ord-store/Report/ReportDailySummaryShiftRevenueStore";
import DoctorProductReportStore from "@ord-store/Report/doctorProductReportStore";
import DoctorProfitReportStore from "@ord-store/Report/doctorProfitReportStore";
import DoctorRevenueReportStore from "@ord-store/Report/doctorRevenueReportStore";
import PharmacyLogMedicationSalesReportStore from "@ord-store/Report/PharmacyLogMedicationSalesReportStore";
import PharmacyLogDrugStockInOutReportStore from "@ord-store/Report/PharmacyLogDrugStockInOutReportStore";
import PharmacyLogExpirationDateTrackingReportStore
    from "@ord-store/Report/PharmacyLogExpirationDateTrackingReportStore";
import PharmacyLogPatientInformationReportStore from "@ord-store/Report/PharmacyLogPatientInformationReportStore";
import PharmacyLogPrescriptionDrugSalesReportStore from "@ord-store/Report/PharmacyLogPrescriptionDrugSalesReportStore";
import PharmacyLogDrugRecallReportStore from "./PharmacyLogDrugRecallReportStore";
import PharmacyLogNonPrescriptionDrugSalesReportStore
    from "@ord-store/Report/PharmacyLogNonPrescriptionDrugSalesReportStore";
import PharmacyLogComplaintLogReportStore from "./PharmacyLogComplaintLogReportStore";
import TempHumidityTrackingStore from "./TempHumidityTrackingStore";
import PharmacyLogQualityInspectionReportStore from "./PharmacyLogQualityInspectionReportStore";
import PharmacyLogQualityInspectionSearchProductStore from "./PharmacyLogQualityInspectionSearchProductStore";
import CleaningTaskTrackingStore from "./CleaningTaskTrackingStore";
import PharmacyLogControlledDrugStockReportStore from "@ord-store/Report/PharmacyLogControlledDrugStockReportStore";
import PharmacyLogAdverseReactionReportStore from "./PharmacyLogAdverseReactionReportStore";
import PharmacyLogControlledDrugLossReportStore from "@ord-store/Report/PharmacyLogControlledDrugLossReportStore";
import TaxDeclrationReportStore from "./taxDeclrationReportStore";
import BusinessHouseHoldCashBookReportStore from "./BusinessHouseHoldCashBookReportStore";
import BusinessHouseHoldBankBookReportStore from "./BusinessHouseHoldBankBookReportStore";
import ProductBookStore from "@ord-store/Report/ProductBook/ProductBookStore";
import ProductionBusinessCostBookReportStore from "./ProductionBusinessCostBookReportStore";
import TaxLiabilityBookStore from "./TaxLiabilityBookStore";
import EmployeeSalaryPaymentBookReportStore from "./EmployeeSalaryPaymentBookReportStore";
import ProductRevenueBookStore from "@ord-store/Report/ProductRevenueBookStore";

export const reportStorePart = {
    reportDailySummaryIncomeStore: new reportDailySummaryIncomeStore(),
    reportSellRevenue: new ReportSellRevenueStore(),
    reportSellRevenueDetails: new ReportSellRevenueDetailsStore(),
    customerReportStore: new CustomerRevenueReportStore(),
    customerReportDetailStore: new CustomerRevenueReportDetailStore(),
    customerReportDebtStore: new CustomerDebtReportStore(),
    reportDailySummaryProductStore: new ReportDailySummaryProductStore(),
    reportSellProductStore: new ReportSellProductStore(),
    reportSellInComeStore: new ReportSellInComeStore(),
    reportStockDisposalReportStore: new ReportStockDisposalReportStore(),
    reportStockCommodityExpiryStore: new ReportStockCommodityExpiryStore(),
    reportStockCommodityPlanStore: new ReportStockCommodityPlanStore(),
    businessHouseHoldCashBookReportStore: new BusinessHouseHoldCashBookReportStore(),
    businessHouseHoldBankBookReportStore: new BusinessHouseHoldBankBookReportStore(),
    employeeSalaryPaymentBookReportStore: new EmployeeSalaryPaymentBookReportStore(),
    productionBusinessCostBookReportStore: new ProductionBusinessCostBookReportStore(),
    taxLiabilityBook: new TaxLiabilityBookStore(),


    reportPharmacyLogMedicationSalesStore:
        new PharmacyLogMedicationSalesReportStore(),
    reportPharmacyLogDrugStockInOutStore:
        new PharmacyLogDrugStockInOutReportStore(),
    reportPharmacyLogExpirationDateTrackingStore:
        new PharmacyLogExpirationDateTrackingReportStore(),
    reportPharmacyLogPatientInformationStore:
        new PharmacyLogPatientInformationReportStore(),
    reportPharmacyLogPrescriptionDrugSalesStore:
        new PharmacyLogPrescriptionDrugSalesReportStore(),
    reportPharmacyLogNonPrescriptionDrugSalesStore:
        new PharmacyLogNonPrescriptionDrugSalesReportStore(),
    reportPharmacyLogDrugRecallReportStore:
        new PharmacyLogDrugRecallReportStore(),
    reportPharmacyLogQualityInspectionReportStore:
        new PharmacyLogQualityInspectionReportStore(),
    reportPharmacyLogQualityInspectionSearchProductStore:
        new PharmacyLogQualityInspectionSearchProductStore(),
    reportPharmacyLogComplaintLogStore: new PharmacyLogComplaintLogReportStore(),
    reportPharmacyLogAdverseReactionStore:
        new PharmacyLogAdverseReactionReportStore(),
    reportPharmacyLogControlledDrugStockStore:
        new PharmacyLogControlledDrugStockReportStore(),
    reportPharmacyLogControlledDrugLossStore:
        new PharmacyLogControlledDrugLossReportStore(),

    reportSellProfit: new ReportSellProfitStore(),
    reportStockImportExportInventoryStore:
        new ReportStockImportExportInventoryStore(),
    employeeReportRevenue: new EmployeeRevenueReportStore(),
    employeeReportDetailRevenue: new EmployeeRevenueReportDetailStore(),
    employeeReportProduct: new EmployeeProductReportStore(),
    supplierReportProduct: new SupplierProductReportStore(),
    supplierReportImport: new SupplierImportReportStore(),
    supplierDebtReportStore: new SupplierDebtReportStore(),
    taxDeclrationReportStore: new TaxDeclrationReportStore(),

    reportDailySummarySellStore: new ReportDailySummarySellStore(),
    reportDailyHandOverStore: new ReportDailyHandOverStore(),
    reportDailySummaryShiftRevenueStore: new ReportDailySummaryShiftRevenueStore(),
    financialReportStore: new FinancialReportStore(),

    doctorProductReportStore: new DoctorProductReportStore(),
    doctorProfitReportStore: new DoctorProfitReportStore(),
    doctorRevenueReportStore: new DoctorRevenueReportStore(),
    tempHumidityTrackingStore: new TempHumidityTrackingStore(),
    cleaningTaskTrackingStore: new CleaningTaskTrackingStore(),
    productBookStore: new ProductBookStore(),
    productRevenueBookStore: new ProductRevenueBookStore(),
};
