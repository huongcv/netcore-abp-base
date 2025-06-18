import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectEmployee } from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import { useSelectGolfLockerStatus } from "@ord-components/forms/select/selectDataSource/useSelectGolfLockerStatus";
import { useSelectPartnerCustomer } from "@ord-components/forms/select/selectDataSource/useSelectPartnerCustomer";
import { propsSelectDataSource } from "./ModalLockerForm";

export const OrdSelectGolfLockerStatus = (props: propsSelectDataSource) => {
  return (
    <OrdSelect
      datasource={useSelectGolfLockerStatus()}
      allowClear
      placeholder={props.plac}
      disabled={props.disabled}
      {...props}
    />
  );
};
