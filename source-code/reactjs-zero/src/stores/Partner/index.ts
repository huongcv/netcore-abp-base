import CustomerGroupStore from "@ord-store/Partner/customerGroupStateStore";
import CustomerStore from "@ord-store/Partner/customerStateStore";
import CustomerSupplierStore from "@ord-store/Partner/customerSupplierStore";
import MembershipVoucherStore from "@ord-store/Partner/membershipVoucherStore";
import PartnerDoctorStore from "@ord-store/Partner/partnerDoctorStore";
import PartnerTransactionStore from "@ord-store/Partner/partnerTransactionStore";
import CustomerDebtStore from "./customerDebtStore";
import SupplierDebtStore from "./supplierDebtStore";
import SupplierGroupStore from "./supplierGroupStateStore";
import DoctorGroupStore from "./doctorGroupStateStore";
import PartnerLoyaltyTierStore from "./partnerLoyaltyTierHistory";
import PartnerLoyaltyTransactionStore from "./partnerLoyaltyTransactionStore";
import CustomerApplyInDetailStore from "./customerApplyInDetailStore";
import EmployeeGroupStore from "./employeeGroupStateStore";

export const partnerStorePart = {
    customerStore: new CustomerStore(),
    customerGroupStore: new CustomerGroupStore(),
    employeeGroupStore: new EmployeeGroupStore(),
    supplierGroupStore: new SupplierGroupStore(),
    doctorGroupStore: new DoctorGroupStore(),
    partnerTransactionStore: new PartnerTransactionStore(),
    partnerLoyaltyTierStore: new PartnerLoyaltyTierStore(),
    partnerLoyaltyTransactionStore: new PartnerLoyaltyTransactionStore(),
    customerDebtStore: new CustomerDebtStore(),
    supplierDebtStore: new SupplierDebtStore(),
    customerSupplierStore: new CustomerSupplierStore(),
    partnerDoctorStore: new PartnerDoctorStore(),
    membershipVoucherStore: new MembershipVoucherStore(),
    customerApplyInDetailStore: new CustomerApplyInDetailStore(),
}
