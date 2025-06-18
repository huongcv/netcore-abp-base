import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectPartnerCustomer } from "@ord-components/forms/select/selectDataSource/useSelectPartnerCustomer";
import { propsSelectDataSource } from "./ModalLockerForm";

export const OrdSelectPartnerCustomer = (props: propsSelectDataSource) => {
  return (
    <OrdSelect
      datasource={useSelectPartnerCustomer()}
      allowClear
      placeholder={props.plac}
      disabled={props.disabled}
      {...props}
    />
  );
};
