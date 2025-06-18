import React, {useEffect} from 'react';
import {PartnerSettingWrapperProps, withPartnerSetting} from "@pages/Customer/withPartnerSetting";
import {Checkbox, Col, Form, Input, Row} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import validateUtils from "@ord-core/utils/validate.utils";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import {useSelectGolfEmpTypeEnum} from "@ord-components/forms/select/selectDataSource/golf/useSelectGolfEmpType";
import {IFormSettingShop_General} from "@pages/System/ShopSetting/setting-name.const";
import {useSelectPartnerGroup} from "@ord-components/forms/select/selectDataSource/useSelectPartnerGroup";

export interface IEmployeeEntityFormProps extends PartnerSettingWrapperProps {

}

const EmployeeEntityForm = (props: IEmployeeEntityFormProps) => {
    const {setting = {}} = props;
    const {
        isSingleEmployeeGroup: isSingleGroup = false,
        isEmployeeCodePrefixByGroup: isCodePrefixByGroup = false
    } = setting as IFormSettingShop_General;
    const {sessionStore} = useStore();
    const {t} = useTranslation('employee');
    const {t: tCommon} = useTranslation('common');
    const form = Form.useFormInstance();
    const id_w = Form.useWatch("id", form);
    const prefixCode_w = Form.useWatch("prefixCode", form);
    const focusRef = useAutoFocus();
    const isGolfShop = sessionStore.isGolfShop;
    const golfEmployeeType = useSelectGolfEmpTypeEnum();
    const dataPartnerGroupCustomer = useSelectPartnerGroup(4);

    useEffect(() => {
        if (id_w && id_w > 0 && isSingleGroup) {
            const currentGroupIds = form.getFieldValue("groupIds") as number[] | undefined;
            if (Array.isArray(currentGroupIds) && currentGroupIds.length > 0) {
                form.setFieldValue("groupIdHelper", currentGroupIds[0]);
            }
        }
    }, [id_w, isSingleGroup])

    const getCodeGroup = (groupId: string): string => {
        if (groupId) {
            const get = dataPartnerGroupCustomer.data.find(gc => gc.value == groupId)
            if (get && get.data) {
                return get.data.groupCode
            }
        }
        return ""
    }

    return (
        <>
            <Form.Item hidden noStyle name="id"></Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    {isSingleGroup && <FloatLabel label={t("groupId")} required={isCodePrefixByGroup}>
                        <Form.Item name="groupIdHelper"
                                   rules={isSingleGroup && isCodePrefixByGroup ? [validateUtils.required] : []}>
                            <OrdSelect
                                onChange={(value) => {
                                    form.setFieldValue("groupIds", value ? [value] : []);
                                    if (isCodePrefixByGroup) {
                                        const codeGroup = getCodeGroup(value);
                                        console.log("setPreFix", codeGroup)
                                        form.setFieldValue("prefixCode", codeGroup)
                                    }
                                }}
                                datasource={dataPartnerGroupCustomer}
                            ></OrdSelect>
                        </Form.Item>
                    </FloatLabel>}
                    {!isSingleGroup && <FloatLabel label={t("groupId")}>
                        <Form.Item name="groupIds">
                            <OrdSelect
                                datasource={dataPartnerGroupCustomer}
                                mode='multiple'
                            ></OrdSelect>
                        </Form.Item>
                    </FloatLabel>}

                    <Form.Item hidden noStyle name="groupIds"></Form.Item>
                    <Form.Item hidden noStyle name="prefixCode"></Form.Item>
                </Col>


                <Col span={8}>
                    <FloatLabel
                        label={t("code")}
                        required={id_w}
                    >
                        <Form.Item
                            name="code"
                            rules={
                                id_w
                                    ? [validateUtils.required, validateUtils.NoSpecialCharacter]
                                    : [validateUtils.NoSpecialCharacter]
                            }
                        >
                            <Input
                                addonBefore={isSingleGroup && isCodePrefixByGroup && !id_w ? prefixCode_w : undefined}
                                maxLength={20} className="uppercase"/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={4}>
                    <Form.Item name='isActived' valuePropName="checked" initialValue={true}>
                        <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <FloatLabel label={t('fullUserName')} required>
                        <Form.Item name='fullUserName' rules={[ValidateUtils.required]}>
                            <Input maxLength={200} ref={focusRef}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                {isGolfShop && <Col span={12}>
                    <FloatLabel label={t('employeeType')}>
                        <Form.Item name='categoryId'>
                            <OrdSelect datasource={golfEmployeeType}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>}
                <Col span={12}>
                    <FloatLabel label={t('email')}>
                        <Form.Item name='email' rules={[ValidateUtils.email]}>
                            <Input maxLength={200}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t('phoneNumber')}>
                        <Form.Item name='phoneNumber' rules={[ValidateUtils.phoneNumberVietNam]}>
                            <Input maxLength={200}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>
        </>
    );
};


export default withPartnerSetting<IEmployeeEntityFormProps>(EmployeeEntityForm);
