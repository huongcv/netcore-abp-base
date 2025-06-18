import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import { AssignShopTree } from "@pages/System/Users/actions/tenants/assignShopLazy";
import { Col, Form, Input, Row } from "antd";
import { Rule } from "antd/es/form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


export const AccountInfoForm = () => {
    const { t } = useTranslation('employee');
    const { t: tCommon } = useTranslation('common');
    const { employeeStore: mainStore } = useStore();
    const { sessionStore } = useStore();
    const { mode, entityData } = mainStore.createOrUpdateModal;
    const isAddNew: boolean = !entityData?.id || mode == "addNew";
    const [rules, setRules] = useState<Rule[]>([ValidateUtils.required]);

    useEffect(() => {
        if (isAddNew) {
            setRules(pre => {
                return [
                    ...pre,
                    ValidateUtils.userName
                ]
            })
        }
    }, [])

    return <>
        <Row gutter={64}>
            <Col span={12}>
                <Row gutter={12}>
                    <p style={{ marginBottom: 15, marginLeft: 15, fontWeight: "600" }}>{t('cruAction.accountTitle')}</p>
                    <Col span={24}>
                        <FloatLabel label={t('userName')} required>
                            <Form.Item
                                tooltip={(<ul>
                                    <li>{tCommon('userNameTooltip.1')}</li>
                                    <li>{tCommon('userNameTooltip.2')}</li>
                                    <li>{tCommon('userNameTooltip.3')}</li>
                                </ul>)}
                                name='userName' rules={rules}>
                                <Input
                                    addonBefore={(isAddNew && sessionStore.currentShopCode ? sessionStore.currentShopCode + '_' : '')}
                                    autoComplete="none" maxLength={30} disabled={!isAddNew} />

                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    {mode !== 'viewDetail' && <Col span={24}>
                        <FloatLabel label={t('passwordHash')} required={isAddNew}>
                            <Form.Item
                                name='passwordHash'
                                rules={[isAddNew ? ValidateUtils.required : ValidateUtils.alwaysValid, ValidateUtils.password]}>
                                <Input autoComplete="none"
                                    placeholder={mode === 'update' ? t('emptyIfNotChangePassword') : ''}
                                    maxLength={100} />
                            </Form.Item>
                        </FloatLabel>

                    </Col>}

                </Row>

            </Col>
            <Col span={12}>
                <p style={{ marginBottom: 15, marginLeft: 15, fontWeight: "600" }}>{t('roleTitleInShop')}</p>
                <AssignShopTree
                    disabled={mode === 'viewDetail'}
                    userId={entityData?.userId}></AssignShopTree>
            </Col>
        </Row>
    </>
}
