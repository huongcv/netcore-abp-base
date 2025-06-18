import { RedEnvelopeOutlined } from "@ant-design/icons";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { Checkbox, Col, Form, Input, Row, Space, Tabs, TabsProps } from "antd";
import { useTranslation } from "react-i18next";
import { FormConfigAllowanceModify } from "./FormConfigAllowanceModify";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { useStore } from "@ord-store/index";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectGolfEmpTypeEnum } from "@ord-components/forms/select/selectDataSource/golf/useSelectGolfEmpType";
import EmployeeEntityForm from "@pages/HumanResource/Employee/EmployeeEntityForm";

export const EmployeeCreateOrUpdateForm = () => {
    const { sessionStore } = useStore();
    const { t } = useTranslation('employee');

    const form = Form.useFormInstance();
    


    const items: TabsProps['items'] = [
        // {
        //     key: '1',
        //     label: <Space><UserOutlined />{t('cruAction.accountInfo')}</Space>,
        //     children: <AccountInfoForm />
        // },
        {
            key: '2',
            label: <Space><RedEnvelopeOutlined />{t('cruAction.employeeAllowance')}</Space>,
            children: <FormConfigAllowanceModify form={form} />
        },

    ];

    return (<>
       <EmployeeEntityForm></EmployeeEntityForm>

        <Tabs
            items={items}
            type="card"
        />
    </>)
}
