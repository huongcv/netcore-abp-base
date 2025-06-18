import DoctorRevenueReportStore from "@ord-store/Report/doctorRevenueReportStore";

class DoctorProductReportStore extends DoctorRevenueReportStore {

    getNamespaceLocale(): string {
        return "report_doctor-product"
    }

    protected getOtherFields(): string[] {
        return [
            'total',
            'fromDate', 'toDate',
            'order',
            "doctorName", "productCode", "productName", "lotNumber", "unitName", "qty", "price",
            "totalAmount", "discountAmount", "returnQty", "returnPrice", "returnTotalAmount", "totalReturnDiscount",
            "revenueAmount"
        ]
    }
}

export default DoctorProductReportStore;
