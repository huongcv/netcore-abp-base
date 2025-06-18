import {useTranslation} from "react-i18next";
import {Checkbox, Col, Form, Input} from "antd";
import React from "react";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import {ACCOUNT_MOVE_TYPE, MoveReasonTypeDto} from "@api/index.defs";
import {CommonResultDto} from "@ord-core/service-proxies/dto";
import {OrdSelectAndAddNew} from "@ord-components/forms/select/OrdSelectAndAddNew";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectPartnerType} from "@ord-components/forms/select/selectDataSource/useSelectPartnerType";
import {
    ComboKeyMoveReasonType,
    MoveReasonTypeLabel,
    MoveReasonTypeRenderSelectItem,
    useSelectMoveReasonType
} from "@ord-components/forms/select/selectDataSource/useSelectMoveReasonType";
import { AccountMoveReasonTypeService } from "@api/AccountMoveReasonTypeService";

interface IMoveReasonTypeProp {
    reason_move_type: ACCOUNT_MOVE_TYPE,
    is_only_other_type?: boolean, 
    onChange?: (value: any, option: IOrdSelectOption | IOrdSelectOption[]) => void;
    disabled?: boolean, 
    autoFocus?: boolean, 
}

const MoveReasonTypeInput = (props: IMoveReasonTypeProp) => {
    const {onChange} = props;
    const [t] = useTranslation('reason-type');
    const {t: tCommon} = useTranslation('common');
    // const [dataSource, setDataSource] = useState<SelectDataSource>({
    //     data:[],
    //     isPending: false
    // })
    // useEffect(() => {
    //     setDataSource(useSelectMoveReasonType(props.reasonMoveType))
    // }, []);
    const apiSave = async (formValue: any) => {
        UiUtils.setBusy()
        try {
            const inputVal: MoveReasonTypeDto = {
                ...formValue,
                reasonMoveType: props.reason_move_type,
                isActived: true,
                isReasonTypeSystem: false,
                reasonTypeEnumId: props.reason_move_type == 1 ? 6 : 18 /// Thu khác hoặc chi khác (nên đên nghiệp vụ này vào api createOrUpdate
            }
            const result = await AccountMoveReasonTypeService.createOrUpdate({
                body: inputVal
            });
            if (result.isSuccessful) {
                let messageKey = ""; 
                if(props.reason_move_type == 1) {
                    messageKey = "addNewReasonTypePayerSuccess"; 
                } else {
                    messageKey = "addNewReasonTypeReceiveSuccess"; 
                }
                UiUtils.showSuccess(tCommon(messageKey, {
                    ...result.data
                }) as any);
            } else {
                ServiceProxyUtils.notifyErrorResultApi(result, "reason-type", {...formValue});
            }
            return result;
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
        return {
            isSuccessful: false
        } as CommonResultDto<any>;
    }
    const handlerDoneAdd = (value: MoveReasonTypeDto) => {
        if (value) {
            const op: IOrdSelectOption = {
                value: value.id,
                title: value.reasonTypeName,
                data: value
            }
            if (onChange)
                onChange(value.id, op);
        }
    }
    return (
        <>
            <OrdSelectAndAddNew
                {...props}
                autoFocus={props.autoFocus}
                formContent={(<FormContent reason_move_type={props.reason_move_type as number}/>)}
                apiAddNew={apiSave}
                nameDataSource={ComboKeyMoveReasonType(props.reason_move_type)}
                renderSelectOptions={MoveReasonTypeRenderSelectItem}
                optionRender={(option: any) => (<MoveReasonTypeLabel dto={option.data?.data}/>)}
                datasource={useSelectMoveReasonType(props.reason_move_type, props.is_only_other_type)}
                modalSetting={{
                    width: 800,
                    style: {
                        top: 30
                    },
                    title: props.reason_move_type == 1 ? t('title.createReceiptType') : t('title.createPaymentVoucher')
                }}
                onAddDone={handlerDoneAdd}
                allowClear={true}
            />

        </>

    );
}
export default MoveReasonTypeInput;

const FormContent = ({reason_move_type}: {reason_move_type: number}) => {
    const [t] = useTranslation('reason-type');
    const [tCommon] = useTranslation();
    return (<>
       <Col lg={16}>
       <FloatLabel label={reason_move_type == 1 ? t('payerTitle') :  t('receiptTitle')} required>
            <Form.Item name='reasonTypeName' rules={[ValidateUtils.required]}>
                <Input maxLength={200}/>
            </Form.Item>
        </FloatLabel>
       </Col>
        <Col lg={8}>
            <Form.Item name='isActived' valuePropName="checked" initialValue={true}>
                <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
            </Form.Item>
        </Col>
    </>);
}
