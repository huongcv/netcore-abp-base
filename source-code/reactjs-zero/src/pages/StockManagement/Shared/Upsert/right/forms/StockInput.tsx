import {useTranslation} from "react-i18next";
import {Checkbox, Col, Form, Input} from "antd";
import React from "react";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {
    StockInventoryLabel,
    StockInventoryRenderSelectItem,
    useSelectStock
} from "@ord-components/forms/select/selectDataSource/useSelectStock";
import UiUtils from "@ord-core/utils/ui.utils";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import {StockInventoryDto} from "@api/index.defs";
import {useSelectStockType} from "@ord-components/forms/select/selectDataSource/useSelectStockType";
import {StockInventoryService} from "@api/StockInventoryService";
import {OrdSelectAndAddNew} from "@ord-components/forms/select/OrdSelectAndAddNew";
import {CommonResultDto} from "@ord-core/service-proxies/dto";

const StockInput = (props: any) => {
    const {onChange} = props;
    const [t] = useTranslation('stock');
    const select_Ds = useSelectStock();
    const form = Form.useFormInstance();
    const inventoryId_disable_w = Form.useWatch('inventoryId_disable', form);
    const moveHashId_w = Form.useWatch('moveHashId', form);

    const apiSave = async (formValue: any) => {
        UiUtils.setBusy()
        try {
            const result = await StockInventoryService.createOrUpdate({
                body: {
                    ...formValue
                }
            });
            if (result.isSuccessful) {
                UiUtils.showSuccess(t('addNewStockSuccess', {
                    ...result.data
                }) as any);
            } else {
                ServiceProxyUtils.notifyErrorResultApi(result, "stock", {...formValue});
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
    const handlerDoneAdd = (value: StockInventoryDto) => {
        if (value) {
            // form.setFieldValue('inventoryId', value.id);
            onChange(value.id, value);
        }
    }
    return (
        <>
            <OrdSelectAndAddNew
                {...props}
                formContent={(<FormContent/>)}
                apiAddNew={apiSave}
                nameDataSource='Stock'
                renderSelectOptions={StockInventoryRenderSelectItem}
                optionRender={(option: any) => (<StockInventoryLabel dto={option.data?.data}/>)}
                datasource={select_Ds}
                modalSetting={{
                    width: 800,
                    style: {
                        top: 30
                    }
                }}
                onAddDone={handlerDoneAdd}
                disabled={moveHashId_w || inventoryId_disable_w || props?.disabled}
            />
            <div hidden>
                <Form.Item noStyle name={'inventoryId_disable'}></Form.Item>
            </div>
        </>

    );
}
export default StockInput;
const FormContent = () => {
    const [t] = useTranslation('stock');
    const [tCommon] = useTranslation();
    return (<>
        <Col span={6}>
            <FloatLabel label={t('inventoryType')}>
                <Form.Item name={'inventoryType'} rules={[ValidateUtils.required]}>
                    <OrdSelect datasource={useSelectStockType()}></OrdSelect>
                </Form.Item>
            </FloatLabel>
        </Col>
        <Col span={12}>
            <FloatLabel label={t('inventoryName')} required>
                <Form.Item name={'inventoryName'} rules={[ValidateUtils.required]}>
                    <Input/>
                </Form.Item>
            </FloatLabel>
        </Col>
        <Col span={6}>
            <FloatLabel label={t('inventoryCode')}>
                <Form.Item name={'inventoryCode'}>
                    <Input/>
                </Form.Item>
            </FloatLabel>
        </Col>
        <Col span={12}>
            <FloatLabel label={t('inventoryAddress')}>
                <Form.Item name={'inventoryAddress'}>
                    <Input/>
                </Form.Item>
            </FloatLabel>
        </Col>
        <Col span={6}>
            <FloatLabel label={t('inventoryTel')}>
                <Form.Item name={'inventoryTel'} rules={[ValidateUtils.phoneNumberVietNam]}>
                    <Input/>
                </Form.Item>
            </FloatLabel>
        </Col>
        <Col span={6}>
            <FloatLabel label={t('Email')}>
                <Form.Item name={'inventoryEmail'}>
                    <Input/>
                </Form.Item>
            </FloatLabel>
        </Col>
        <Col span={24}>
            <Form.Item name='isActived' valuePropName="checked" initialValue={true}>
                <Checkbox disabled>{tCommon('dang_hoat_dong')}</Checkbox>
            </Form.Item>
        </Col>
    </>);
}
