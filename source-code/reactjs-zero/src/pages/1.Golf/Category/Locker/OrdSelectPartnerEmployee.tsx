import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectEmployee } from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import { useSelectPartnerCustomer } from "@ord-components/forms/select/selectDataSource/useSelectPartnerCustomer";
import { propsSelectDataSource } from "./ModalLockerForm";

export const OrdSelectPartnerEmployee = (props: propsSelectDataSource) => {
  return (
    <OrdSelect
      datasource={useSelectEmployee()}
      allowClear
      placeholder={props.plac}
      disabled={props.disabled}
      {...props}
    />
  );
};
