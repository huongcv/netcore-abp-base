import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {PERMISSION_APP} from "@ord-core/config/permissions";

export const REPORT_TREE_DATA: OrdPermissionTreeDataNode[] = [
    {
        name: PERMISSION_APP.report.pharmacyLog.group,
        children: [
            { name: PERMISSION_APP.report.pharmacyLog.medicationSales },
            { name: PERMISSION_APP.report.pharmacyLog.drugStockInOut },
            { name: PERMISSION_APP.report.pharmacyLog.expirationDateTracking },
            { name: PERMISSION_APP.report.pharmacyLog.drugRecallTracking },
            { name: PERMISSION_APP.report.pharmacyLog.temperatureHumidity },
            { name: PERMISSION_APP.report.pharmacyLog.sanitationMonitoring },
            { name: PERMISSION_APP.report.pharmacyLog.patientInformation },
            { name: PERMISSION_APP.report.pharmacyLog.complaintHandling },
            { name: PERMISSION_APP.report.pharmacyLog.adverseDrugReaction },
            { name: PERMISSION_APP.report.pharmacyLog.prescriptionDrugSales },
            { name: PERMISSION_APP.report.pharmacyLog.nonPrescriptionDrugSales },
            { name: PERMISSION_APP.report.pharmacyLog.qualityInspection },
            { name: PERMISSION_APP.report.pharmacyLog.controlledDrugsStock },
            { name: PERMISSION_APP.report.pharmacyLog.controlledDrugsLoss },
        ],
    },
    {
        name: PERMISSION_APP.report.endOfDay.group,
        children: [
            { name: PERMISSION_APP.report.endOfDay.sell },
            { name: PERMISSION_APP.report.endOfDay.product },
            { name: PERMISSION_APP.report.endOfDay.income },
            { name: PERMISSION_APP.report.endOfDay.shiftRevenue },
        ],
    },
    {
        name: PERMISSION_APP.report.sell.group,
        children: [
            { name: PERMISSION_APP.report.sell.revenue },
            { name: PERMISSION_APP.report.sell.revenueDetail },
            { name: PERMISSION_APP.report.sell.product },
            { name: PERMISSION_APP.report.sell.income },
            { name: PERMISSION_APP.report.sell.profit },
        ],
    },
    {
        name: PERMISSION_APP.report.customer.group,
        children: [
            { name: PERMISSION_APP.report.customer.revenue },
            { name: PERMISSION_APP.report.customer.revenueDetail },
            { name: PERMISSION_APP.report.customer.debt },
        ],
    },
    {
        name: PERMISSION_APP.report.doctor.group,
        children: [
            { name: PERMISSION_APP.report.doctor.revenue },
            { name: PERMISSION_APP.report.doctor.profit },
            { name: PERMISSION_APP.report.doctor.product },
        ],
    },
    {
        name: PERMISSION_APP.report.employee.group,
        children: [
            { name: PERMISSION_APP.report.employee.revenue },
            { name: PERMISSION_APP.report.employee.revenueDetail },
            { name: PERMISSION_APP.report.employee.product },
        ],
    },
    {
        name: PERMISSION_APP.report.supplier.group,
        children: [
            { name: PERMISSION_APP.report.supplier.move },
            { name: PERMISSION_APP.report.supplier.product },
            { name: PERMISSION_APP.report.supplier.debt },
        ],
    },
    {
        name: PERMISSION_APP.report.stock.group,
        children: [
            { name: PERMISSION_APP.report.stock.importAndExport },
            { name: PERMISSION_APP.report.stock.destroy },
            { name: PERMISSION_APP.report.stock.expiry },
            { name: PERMISSION_APP.report.stock.forecast },
        ],
    },
    {
        name: PERMISSION_APP.report.financial,
    },
    {
        name: PERMISSION_APP.report.tax.group,
        children: [
            { name: PERMISSION_APP.report.tax.taxDeclration },
        ],
    },
    {
        name: PERMISSION_APP.report.businessHouseHold.group,
        children: [
            { name: PERMISSION_APP.report.businessHouseHold.productRevenueBook },
            { name: PERMISSION_APP.report.businessHouseHold.productBook },
            { name: PERMISSION_APP.report.businessHouseHold.productionBusinessCostBook },
            { name: PERMISSION_APP.report.businessHouseHold.taxLiabilityBook },
            { name: PERMISSION_APP.report.businessHouseHold.employeeSalaryPaymentBook },
            { name: PERMISSION_APP.report.businessHouseHold.cashBook },
            { name: PERMISSION_APP.report.businessHouseHold.bankBook },
        ],
    },
];
