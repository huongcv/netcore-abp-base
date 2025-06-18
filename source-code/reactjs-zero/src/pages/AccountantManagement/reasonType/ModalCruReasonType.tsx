import FloatLabel from "@ord-components/forms/FloatLabel";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import { Checkbox, Col, Form, Input, Row } from "antd";
import { observer } from "mobx-react-lite/src/observer";
import { useTranslation } from "react-i18next";


const CreateOrUpdateReasonTypeForm = () => {
    const {t} = useTranslation('reason-type');
    const {t: tCommon} = useTranslation('common');
    const {reasonTypeStore} = useStore(); 

    const focusRef = useAutoFocus();

    return (<>
        <Row gutter={16}>
            <Col lg={16}>
                <FloatLabel label={reasonTypeStore.createOrUpdateModal.entityData?.reasonMoveType == 1 ? t('payerTitle') : t('receiptTitle')} required>
                    <Form.Item name='reasonTypeName' rules={[ValidateUtils.required, ValidateUtils.maxLength(200)]}>
                        <Input ref={focusRef}  />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col lg={8}>
                <Form.Item name='isActived' valuePropName="checked">
                    <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
                </Form.Item>
            </Col>
            <Form.Item name="reasonMoveType" initialValue={reasonTypeStore.createOrUpdateModal.entityData?.reasonMoveType} hidden />
        </Row>
    </>)
}
export default observer(CreateOrUpdateReasonTypeForm);
