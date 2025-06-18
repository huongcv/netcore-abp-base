import { SupplierService } from "@api/SupplierService";
import { PartnerDto } from "@api/index.defs";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { OrdSelectAndAddNew } from "@ord-components/forms/select/OrdSelectAndAddNew";
import {
    PartnerSupplierLabel,
    PartnerSupplierRenderSelectItem,
    useSelectPartnerSupplier,
} from "@ord-components/forms/select/selectDataSource/useSelectPartnerSupplier";
import { Discount2Icon } from "@ord-components/icon/Discount2Icon";
import { ProfileIcon } from "@ord-components/icon/ProfileIcon";
import { Wallet2Icon } from "@ord-components/icon/Wallet2Icon";
import { WorkIcon } from "@ord-components/icon/WorkIcon";
import { CommonResultDto } from "@ord-core/service-proxies/dto";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
import { PartnerSupplierEntityForm } from "@pages/Partner/CustomerSupplier/Forms/PartnerSupplierEntityForm";
import PartnerAvatar from "@pages/Partner/Shared/PartnerAvatar";
import { Checkbox, Form, Tabs, TabsProps, Typography } from "antd";
import { useTranslation } from "react-i18next";
import '../../index.scss';

const {Text} = Typography;
const PartnerSupplierInput = (props: any) => {
    const {onChange} = props;
    const [t] = useTranslation('stock');
    const {t: ts} = useTranslation(['customer-supplier']);
    const moveHashId_w = Form.useWatch('moveHashId');
    const select_Ds = useSelectPartnerSupplier();
    const {selectDataSourceStore} = useStore(); 

    const clearDatasource = () => {
            const key = `AllPartnerSupplier`;
            selectDataSourceStore.clearByName(key);
            selectDataSourceStore.getOptions(key, async () => {
                const result = await SupplierService.getComboOptions();
                return utils.mapCommonSelectOption(result);
            });
    } 

    const apiSave = async (formValue: any) => {
        UiUtils.setBusy()
        try {
            const result = await SupplierService.createOrUpdate({
                body: {
                    ...formValue,
                    isActived: true, 
                }
            });
            if (result.isSuccessful) {
                UiUtils.showSuccess(t('addNewPartnerSuccess', {
                    ...result.data
                }) as any);
                clearDatasource();
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
    const handlerDoneAdd = (value: PartnerDto) => {
        if (value) {
            onChange(value.id, value);
        }
    }

    const itemTab: TabsProps["items"] = [
        {
            icon: <ProfileIcon/>,
            key: '1',
            label: ts('customerInfo'),
            children: <>
                <PartnerSupplierEntityForm/>
            </>
        },
        {
            icon: <Wallet2Icon/>,
            key: '2',
            label: ts('transactionHistory'),
            disabled: true,
        },
        {
            icon: <WorkIcon/>,
            key: '3',
            disabled: true,
            label: ts('debtInfo'),
        },
    ]

    return (
        <>

            {
                moveHashId_w ?
                    <OrdSelect datasource={select_Ds}
                               {...props}
                               allowClear={true}
                               renderSelectOptions={PartnerSupplierRenderSelectItem}
                               optionRender={(option: any) => (<PartnerSupplierLabel dto={option.data?.data}/>)}

                    ></OrdSelect> :
                    <OrdSelectAndAddNew
                        {...props}
                        allowClear={true}
                        formContent={
                            <Tabs
                                className={'tab-cru-customer'}
                                tabBarExtraContent={{
                                    left: <div className={'text-center'}>
                                        <PartnerAvatar ></PartnerAvatar>
                                        <Form layout='vertical' className='mt-1'>
                                            <Form.Item>
                                                <Text className={'uppercase supplier-name'} ellipsis
                                                      style={{width: 120}}>

                                                </Text>
                                            </Form.Item>
                                            <Form.Item className='my-1 block' name='isActive'
                                                       valuePropName="checked"
                                                       initialValue={true}>
                                                <Checkbox disabled>{ts('isActived')}</Checkbox>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                }}
                                tabPosition={'left'} items={itemTab}>
                            </Tabs>
                        }
                        apiAddNew={apiSave}
                        nameDataSource='PartnerSupplier'
                        renderSelectOptions={PartnerSupplierRenderSelectItem}
                        optionRender={(option: any) => (<PartnerSupplierLabel dto={option.data?.data}/>)}
                        datasource={select_Ds}
                        modalSetting={{
                            width: 1200,
                            style: {
                                top: 30
                            }
                        }}
                        onAddDone={handlerDoneAdd}
                    />

            }
        </>

    )
        ;
}
export default PartnerSupplierInput;

