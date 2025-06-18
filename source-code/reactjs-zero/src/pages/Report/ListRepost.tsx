import React, {ReactNode, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Card, Col, List, Row} from "antd";
import {RightOutlined} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import {useStore} from "@ord-store/index";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {ReportSellIcon} from "@ord-components/icon/ReportSellIcon";
import {ReportCustomerIcon} from "@ord-components/icon/ReportCustomerIcon";
import {ReportEmployeeIcon} from "@ord-components/icon/ReportEmployeeIcon";
import {ReportSupplierIcon} from "@ord-components/icon/ReportSupplierIcon";
import {ReportStockIcon} from "@ord-components/icon/ReportStockIcon";
import {ReportFinanceIcon} from "@ord-components/icon/ReportFinanceIcon";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {PACKAGE_TEST_CODE, ROLE_PHARMACY} from "@ord-core/AppConst";

const ns = "report";

interface IReportGroup {
    icon?: ReactNode;
    name: string;
    permission?: string;
    path?: string;
    details?: IReportGroup[];
}

function ListRepost({}) {
    const {sessionStore} = useStore();
    const {t} = useTranslation(ns);
    const navigate = useNavigate();
    const [data, setData] = useState<IReportGroup[]>();
    const isStandardPackage =  PACKAGE_TEST_CODE.some(x => x === sessionStore?.user?.packageRegistrationCode);
    
    const dataStatic: IReportGroup[] = [

        {
            icon: <ReportSupplierIcon></ReportSupplierIcon>,
            name: "ReportShop.EndOfDay",
            permission: PERMISSION_APP.report.endOfDay.group,
            details: [
                {
                    name: "ReportShop.EndOfDay.Sell",
                    path: "daily-summary/sell",
                    permission: PERMISSION_APP.report.endOfDay.sell,
                },
                {
                    name: "ReportShop.EndOfDay.Product",
                    path: "daily-summary/product",
                    permission: PERMISSION_APP.report.endOfDay.product,
                },
                {
                    name: "ReportShop.EndOfDay.Income",
                    path: "daily-summary/income",
                    permission: PERMISSION_APP.report.endOfDay.income,
                },
                {
                    name: "ReportShop.EndOfDay.ShiftRevenue",
                    path: "daily-summary/shift-revenue",
                    permission: PERMISSION_APP.report.endOfDay.shiftRevenue,
                },                
            ],
        },
        {
            icon: <ReportSellIcon></ReportSellIcon>,
            name: "ReportShop.Sell",
            permission: PERMISSION_APP.report.sell.group,
            details: [
                {
                    name: "ReportShop.Sell.Revenue",
                    path: "sale/revenue",
                    permission: PERMISSION_APP.report.sell.revenue,
                },
                {
                    name: "ReportShop.Sell.RevenueDetail",
                    path: "sale/revenue-details",
                    permission: PERMISSION_APP.report.sell.revenueDetail,
                },
                {
                    name: "ReportShop.Sell.Product",
                    path: "sale/product",
                    permission: PERMISSION_APP.report.sell.product,
                },
                {
                    name: "ReportShop.Sell.Income",
                    path: "sale/income",
                    permission: PERMISSION_APP.report.sell.income,
                },
                {
                    name: "ReportShop.Sell.Profit",
                    path: "sale/profit",
                    permission: PERMISSION_APP.report.sell.profit,
                },
            ],
        },
        {
            icon: <ReportCustomerIcon></ReportCustomerIcon>,
            name: "ReportShop.Customer",
            permission: isStandardPackage ? "StandardPackage" : PERMISSION_APP.report.customer.group,
            details: [
                {
                    name: "ReportShop.Customer.Revenue",
                    path: "customer/revenue",
                    permission: PERMISSION_APP.report.customer.revenue,
                },
                {
                    name: "ReportShop.Customer.RevenueDetail",
                    path: "customer/revenue-details",
                    permission: PERMISSION_APP.report.customer.revenueDetail,
                },
                {
                    name: "ReportShop.Customer.Debt",
                    path: "customer/debt",
                    permission: PERMISSION_APP.report.customer.debt,
                },
            ],
        },
        {
            icon: <ReportCustomerIcon></ReportCustomerIcon>,
            name: "ReportShop.Doctor",
            permission: isStandardPackage ? "StandardPackage" : PERMISSION_APP.report.doctor.group,
            details: [
                {
                    name: "ReportShop.Doctor.Revenue", // Doanh thu
                    path: "doctor/revenue",
                    permission: PERMISSION_APP.report.doctor.revenue + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.Doctor.Profit", // Lợi nhuận
                    path: "doctor/profit",
                    permission: PERMISSION_APP.report.doctor.profit + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.Doctor.Product", // Hàng hóa
                    path: "doctor/product",
                    permission: PERMISSION_APP.report.doctor.product + " and " + ROLE_PHARMACY,
                },
            ],
        },
        {
            icon: <ReportEmployeeIcon></ReportEmployeeIcon>,
            name: "ReportShop.Employee",
            permission: isStandardPackage ? "StandardPackage" : PERMISSION_APP.report.employee.group,
            details: [
                {
                    name: "ReportShop.Employee.Revenue",
                    path: "employee/revenue",
                    permission: PERMISSION_APP.report.employee.revenue,
                },
                {
                    name: "ReportShop.Employee.RevenueDetail",
                    path: "employee/revenue-details",
                    permission: PERMISSION_APP.report.employee.revenueDetail,
                },
                {
                    name: "ReportShop.Employee.Product",
                    path: "employee/revenue-product",
                    permission: PERMISSION_APP.report.employee.product,
                },
            ],
        },
        {
            icon: <ReportSupplierIcon></ReportSupplierIcon>,
            name: "ReportShop.Supplier",
            permission: isStandardPackage ? "StandardPackage" : PERMISSION_APP.report.supplier.group,
            details: [
                {
                    name: "ReportShop.Supplier.Move",
                    path: "supplier/supplier-import",
                    permission: PERMISSION_APP.report.supplier.move,
                },
                {
                    name: "ReportShop.Supplier.Product",
                    path: "supplier/supplier-product",
                    permission: PERMISSION_APP.report.supplier.product,
                },
                {
                    name: "ReportShop.Supplier.Debt",
                    path: "supplier/supplier-debt",
                    permission: PERMISSION_APP.report.supplier.debt,
                },
            ],
        },
        {
            icon: <ReportStockIcon></ReportStockIcon>,
            name: "ReportShop.Stock",
            permission: isStandardPackage ? "StandardPackage" : PERMISSION_APP.report.stock.group,
            details: [
                {
                    name: "ReportShop.Stock.ImportAndExport",
                    path: "stock/import-export-inventory",
                    permission: PERMISSION_APP.report.stock.importAndExport,
                },
                {
                    name: "ReportShop.Stock.Destroy",
                    path: "stock/disposal-report",
                    permission: PERMISSION_APP.report.stock.destroy,
                },
                {
                    name: "ReportShop.Stock.Expiry",
                    path: "stock/commodity-expiry",
                    permission: PERMISSION_APP.report.stock.expiry,
                },
                {
                    name: "ReportShop.Stock.Forecast",
                    path: "stock/commodity-plan",
                    permission: PERMISSION_APP.report.stock.forecast,
                },
            ],
        },
        {
            icon: <ReportFinanceIcon></ReportFinanceIcon>,
            name: "ReportShop.Financial",
            permission: isStandardPackage ? "StandardPackage" : PERMISSION_APP.report.financial,
            details: [
                {
                    name: "ReportShop.Financial",
                    path: 'financial/financial-details',
                    permission: PERMISSION_APP.report.financial,
                }
            ]
        },
        {
            icon: <ReportSupplierIcon></ReportSupplierIcon>,
            name: "ReportShop.PharmacyLog",
            permission: isStandardPackage ? "StandardPackage" : PERMISSION_APP.report.pharmacyLog.group + " and " + ROLE_PHARMACY,
            details: [
                {
                    name: "ReportShop.PharmacyLog.MedicationSales",
                    path: "pharmacy-log/medication-sales",
                    permission: PERMISSION_APP.report.pharmacyLog.medicationSales + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.DrugStockInOut",
                    path: "pharmacy-log/drug-stock-in-out",
                    permission: PERMISSION_APP.report.pharmacyLog.drugStockInOut + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.ExpirationDateTracking",
                    path: "pharmacy-log/expiration-date-tracking",
                    permission: PERMISSION_APP.report.pharmacyLog.expirationDateTracking + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.DrugRecallTracking",
                    path: "pharmacy-log/drug-recall-tracking",
                    permission: PERMISSION_APP.report.pharmacyLog.drugRecallTracking + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.TemperatureHumidity",
                    path: "pharmacy-log/temperature-humidity",
                    permission: PERMISSION_APP.report.pharmacyLog.temperatureHumidity + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.SanitationMonitoring",
                    path: "pharmacy-log/sanitation-monitoring",
                    permission: PERMISSION_APP.report.pharmacyLog.sanitationMonitoring + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.PatientInformation",
                    path: "pharmacy-log/patient-information",
                    permission: PERMISSION_APP.report.pharmacyLog.patientInformation + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.ComplaintHandling",
                    path: "pharmacy-log/complaint-handling",
                    permission: PERMISSION_APP.report.pharmacyLog.complaintHandling + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.AdverseDrugReaction",
                    path: "pharmacy-log/adverse-drug-reaction",
                    permission: PERMISSION_APP.report.pharmacyLog.adverseDrugReaction + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.PrescriptionDrugSales",
                    path: "pharmacy-log/prescription-drug-sales",
                    permission: PERMISSION_APP.report.pharmacyLog.prescriptionDrugSales + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.NonPrescriptionDrugSales",
                    path: "pharmacy-log/non-prescription-drug-sales",
                    permission: PERMISSION_APP.report.pharmacyLog.nonPrescriptionDrugSales + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.QualityInspection",
                    path: "pharmacy-log/quality-inspection",
                    permission: PERMISSION_APP.report.pharmacyLog.qualityInspection + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.ControlledDrugsStock",
                    path: "pharmacy-log/controlled-drugs-stock",
                    permission: PERMISSION_APP.report.pharmacyLog.controlledDrugsStock + " and " + ROLE_PHARMACY,
                },
                {
                    name: "ReportShop.PharmacyLog.ControlledDrugsLoss",
                    path: "pharmacy-log/controlled-drugs-loss",
                    permission: PERMISSION_APP.report.pharmacyLog.controlledDrugsLoss + " and " + ROLE_PHARMACY,
                },
            ],
        },
        {
            icon: <ReportFinanceIcon></ReportFinanceIcon>,
            name: "ReportShop.Tax",
            permission: PERMISSION_APP.report.tax.group,
            details: [
                {
                    name: "ReportShop.Tax.TaxDeclration",
                    path: 'tax/tax-declaration',
                    permission: PERMISSION_APP.report.tax.taxDeclration,
                },
            ]
        },
        {
            icon: <ReportFinanceIcon></ReportFinanceIcon>,
            name: "ReportShop.BusinessHouseHold",
            permission: PERMISSION_APP.report.businessHouseHold.group,
            details: [
                {
                    name: "ReportShop.BusinessHouseHold.ProductRevenueBook",
                    path: 'business-house-hold/product-revenue-book',
                    permission: PERMISSION_APP.report.businessHouseHold.productRevenueBook,
                },
                {
                    name: "ReportShop.BusinessHouseHold.ProductBook",
                    path: 'business-house-hold/product-book',
                    permission: PERMISSION_APP.report.businessHouseHold.productRevenueBook,

                },
                {
                    name: "ReportShop.BusinessHouseHold.ProductionBusinessCostBook",
                    path: 'business-house-hold/production-business-cost-book',
                    permission: PERMISSION_APP.report.businessHouseHold.productionBusinessCostBook,
                },
                {
                    name: "ReportShop.BusinessHouseHold.TaxLiabilityBook",
                    path: 'business-house-hold/tax-liability',
                    permission: PERMISSION_APP.report.businessHouseHold.taxLiabilityBook,
                },
                {
                    name: "ReportShop.BusinessHouseHold.EmployeeSalaryPaymentBook",
                    path: 'business-house-hold/employee-salary-payment-book',
                    permission: PERMISSION_APP.report.businessHouseHold.employeeSalaryPaymentBook,
                },
                {
                    name: "ReportShop.BusinessHouseHold.CashBook",
                    path: 'business-house-hold/cash-book',
                    permission: PERMISSION_APP.report.businessHouseHold.cashBook,
                },
                {
                    name: "ReportShop.BusinessHouseHold.BankBook",
                    path: 'business-house-hold/bank-book',
                    permission: PERMISSION_APP.report.businessHouseHold.bankBook,
                },
            ]
        },
    ];


    useEffect(() => {
        setData(
            dataStatic
                .filter((f) =>
                    f.permission
                        ? checkPermissionUser(sessionStore.appSession, f.permission)
                        : true
                )
                .map((data) => {
                    if (data.details)
                        data.details = data.details.filter((x) =>
                            x.permission
                                ? checkPermissionUser(sessionStore.appSession, x.permission)
                                : true
                        );
                    return data;
                })
                .filter(x => x.details && x.details?.length > 0)
        );
    }, []);
    return (
        <>
            <PageTopTitleAndAction></PageTopTitleAndAction>

            <Row gutter={[16, 16]}>
                {data?.map((item, idx) => {
                    return (
                        <Col key={idx} sm={24} md={24} lg={8}>
                            <Card
                                styles={{
                                    body: {
                                        padding: "0",
                                    },
                                    header: {
                                        height: "52px",
                                        backgroundColor: "#334F7B",
                                        color: "white",
                                    },
                                }}
                                title={
                                    <div className="flex align-center">
                                        {item.icon}
                                        <span className="font-bold ml-1">{t(item.name)}</span>
                                    </div>
                                }
                                className="h-[100%] bg-white"
                            >
                                <List
                                    className={"list-report px-3 h-full max-h-72 overflow-y-auto"}
                                    style={{
                                        background: "white",
                                        scrollbarWidth: "thin",
                                        scrollbarColor: "#334F7B #fafafa",
                                    }}
                                    dataSource={item.details}
                                    size="small"
                                    renderItem={(item2, index) => {
                                        return (
                                            <Link to={item2.path ?? ""}>
                                                <List.Item
                                                    className={"cursor-pointer h-[48px]"}
                                                    actions={[<RightOutlined/>]}
                                                >
                                                    <div style={{width: "100%"}}>
                                                        {t(item2.name)}
                                                    </div>
                                                </List.Item>
                                            </Link>
                                        );
                                    }}
                                />
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </>
    );
}

export default ListRepost;
