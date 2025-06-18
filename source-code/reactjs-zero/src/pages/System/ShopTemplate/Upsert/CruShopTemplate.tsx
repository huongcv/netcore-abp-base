import React, {useEffect, useState} from 'react';
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {TopAction} from "@ord-components/crud/TopAction";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {Button, Card, Checkbox, Col, Form, Input, Row, Space} from "antd";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router-dom";
import UiUtils from "@ord-core/utils/ui.utils";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectShopTemplateType} from "@ord-components/forms/select/selectDataSource/useSelectShopTemplateType";
import GridProductItems from "@pages/System/ShopTemplate/Upsert/gridProduct/GridProductItems";
import {observer} from "mobx-react-lite";

const CruShopTemplate = () => {
    const {shopTemplateStore: mainStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');
    const navigate = useNavigate();
    const {hashId, type} = useParams();
    const [cusForm] = Form.useForm();
    const [formDisable, setFormDisable] = useState<boolean>(false)
    useEffect(() => {
        if (!hashId && type) {
            if (type === "sample-sales-order") {
                cusForm.setFieldValue('type', 1);
            } else if (type == 'sample-receipt') {
                cusForm.setFieldValue('type', 2);
            }
        } else if (hashId) {
            mainStore.getByHashId(hashId)
                .then(res => {
                    cusForm.setFieldsValue(res);
                    if (type != 'update') {
                        setFormDisable(true);
                    }
                })
        }
    }, [type, hashId]);

    const onSave = async () => {
        try {
            const data = await cusForm.validateFields();
            UiUtils.setBusy();
            try {
                console.log("data", data)
                const isCreate = !hashId;
                const apiCru = isCreate ?
                    mainStore.createEntity({
                        ...data,
                    }) : mainStore.updateEntity({
                        ...data,
                    });
                await apiCru.then(result => {
                    if (result) {
                        UiUtils.showSuccess(t(isCreate ? 'addNewSuccess' : 'updateSuccess', {
                            ...data
                        }) as any);
                        navigate(-1);
                        // cusForm.resetFields();
                        // cusForm.setFieldsValue(prop.stored.getInitModal()?.entityData);
                        // mainStore.closeModal(true);
                        // fetchSyncDataPartners().then();
                    }
                })
            } catch (e) {

            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }
    }
    const topActions: IActionBtn[] = [
        {
            title: t('actionBtn.CustomerGroup'),
            permission: PERMISSION_APP.customer.customerGroup,
            content: <>
                <Button onClick={() => navigate(-1)}>
                    <Space>
                        <ArrowLeftOutlined/>
                    </Space>
                    {t('actionBtn.back')}
                </Button>
            </>
        },
        {
            permission: 'Partner.Customer.Create',
            content:
                <>
                    <Button hidden={formDisable} type='primary' onClick={onSave}>
                        <SaveOutlined></SaveOutlined>
                        {t('save')}
                    </Button>
                </>

        },
    ];
    return (
        <div>
            <PageTopTitleAndAction usingCustom={true}
                                   mainTitle={hashId ? t('pageTitleUpdate') : t('pageTitleCreate', {name: t(type ?? "")})}
                                   items={[t('pageTitleLvl1'), t('pageTitleLvl2', {type: t(type ?? "")})]}>
                <TopAction topActions={topActions}/>
            </PageTopTitleAndAction>
            <div className='ord-container-box'>
                <Form form={cusForm}
                      disabled={formDisable}
                      layout={'vertical'}>
                    <Form.Item hidden name='id'>
                        <Input/>
                    </Form.Item>
                    <Row gutter={[16, 16]}>
                        <Col span={4}>
                            <FloatLabel label={t('type')}>
                                <Form.Item name='type'>
                                    <OrdSelect disabled datasource={useSelectShopTemplateType()}></OrdSelect>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col span={16}>
                            <FloatLabel label={t('name')}>
                                <Form.Item name='name'>
                                    <Input maxLength={200}/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col span={4}>
                            <FloatLabel>
                                <Form.Item name="isActived" valuePropName="checked" initialValue={true}>
                                    <Checkbox>{t('isActive')}</Checkbox>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col span={24}>
                            <FloatLabel label={t('notes')}>
                                <Form.Item name="notes">
                                    <Input.TextArea maxLength={200} rows={1}/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                    </Row>

                </Form>
            </div>
            <Card title={t('addProductToShopTemplate')}>
                <GridProductItems
                    form={cusForm} disable={formDisable}></GridProductItems>
                {/*<SearchProduct />*/}
            </Card>


        </div>
    );
};

export default observer(CruShopTemplate);