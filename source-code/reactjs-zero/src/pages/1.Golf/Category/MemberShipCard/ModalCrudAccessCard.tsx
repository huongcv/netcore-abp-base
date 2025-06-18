import { GolfAccessCardColorService } from "@api/GolfAccessCardColorService";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useAccessCardStatusEnum } from "@ord-components/forms/select/selectDataSource/golf/useSelectAccessCardStatusEnum";
import { useAccessCardTypeEnum } from "@ord-components/forms/select/selectDataSource/golf/useSelectAccessCardTypeEnum";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import utils from "@ord-core/utils/utils";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { Checkbox, Col, Form, Input, Row } from "antd";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {QrcodeOutlined} from "@ant-design/icons";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";

const ModalCrudAccessCard = () => {
    const { t } = useTranslation('golf_access_card');
    const { t: tCommon } = useTranslation("common");
    const form = Form.useFormInstance();
    const [accessCardColorCombo, setAccessCardColorCombo] = useState<SelectDataSource>();
    const uidInputRef = useAutoFocus();

    const debounceSetFieldsValue = useMemo(
        () =>
            debounce((value) => {
                form.setFieldsValue({
                    groupCode: ValidateUtils.filterGroupCode(value),
                });
            }, 300),
        [form]
    );

    useEffect(() => {
        return () => {
            debounceSetFieldsValue.cancel();
        };
    }, [debounceSetFieldsValue]);


    useEffect(() => {
        getAccessCardColor();
    }, []);

    const getAccessCardColor = async () => {
        const result = await GolfAccessCardColorService.getComboOptions({});
        setAccessCardColorCombo({ 
            data: utils.mapCommonSelectOption(result).map(option => ({
                ...option,
                label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                            style={{
                                width: '16px',
                                height: '16px',
                                backgroundColor: option.label,
                                border: '1px solid #d9d9d9',
                                borderRadius: '4px'
                            }}
                        />
                        <span>{option.label}</span>
                    </div>
                )
            })), 
            isPending: false 
        });
    };

    return (
        <>
            <Row gutter={16}>
               
                <Col span={12}>
                    <FloatLabel label={t("uid")} required>
                        <Form.Item name="uid" rules={[ValidateUtils.required, ValidateUtils.maxLength(100)]}>
                            <Input ref={uidInputRef} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                {/*AccessCode*/}
                <Col span={12}>
                    <FloatLabel label={t("printedNumber")} required>
                        <Form.Item name="printedNumber" rules={[ValidateUtils.required, ValidateUtils.maxLength(50)]}>
                            <Input />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                {/*<Col span={12}>*/}
                {/*    <FloatLabel label={t("accessCode")} >*/}
                {/*        <Form.Item name="accessCode">*/}
                {/*            <Input.Password prefix={<QrcodeOutlined/>} />*/}
                {/*        </Form.Item>*/}
                {/*    </FloatLabel>*/}
                {/*</Col>*/}


                <Col span={12}>
                    <FloatLabel label={t("cardType")} required>
                        <Form.Item name="cardType" rules={[ValidateUtils.required]} initialValue={3}> 
                            <OrdSelect
                                datasource={useAccessCardTypeEnum()}
                                allowClear
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("accessCardColor")} >
                        <Form.Item name="accessCardColorId" >
                            <OrdSelect datasource={accessCardColorCombo || { data: [], isPending: false }} placeholder={t('')} allowClear></OrdSelect>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("accessStatus")} required>
                        <Form.Item name="accessStatus" rules={[ValidateUtils.required]} initialValue={1}>
                            <OrdSelect
                                datasource={useAccessCardStatusEnum()}
                                allowClear
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={24}>
                    <FloatLabel label={t("description")} >
                        <Form.Item name="description" rules={[ValidateUtils.maxLength(50)]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col lg={8}>
                    <Form.Item
                        name="isActived"
                        initialValue={true}
                        valuePropName="checked">
                        <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item hidden noStyle name="id">
                <Input hidden />
            </Form.Item>
        </>
    );
};
export default ModalCrudAccessCard;
