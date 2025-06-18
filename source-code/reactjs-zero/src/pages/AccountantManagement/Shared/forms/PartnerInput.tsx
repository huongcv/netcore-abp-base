import {PARTNER_TYPE, PartnerDto} from "@api/index.defs";
import {IBaseOrdSelectProp, IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {IOrdSelectAndAddNewActions, OrdSelectAndAddNew} from "@ord-components/forms/select/OrdSelectAndAddNew";
import {ComboKeyPartner, useSelectPartner} from "@ord-components/forms/select/selectDataSource/useSelectPartner";
import {
    PartnerCustomerLabel,
    PartnerCustomerRenderSelectItem
} from "@ord-components/forms/select/selectDataSource/useSelectPartnerCustomer";
import {ProfileIcon} from "@ord-components/icon/ProfileIcon";
import {Wallet2Icon} from "@ord-components/icon/Wallet2Icon";
import {CommonResultDto} from "@ord-core/service-proxies/dto";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {PartnerCustomerEntityForm} from "@pages/Customer/Form/PartnerCustomerEntityForm";
import {PartnerSupplierEntityForm} from "@pages/Partner/CustomerSupplier/Forms/PartnerSupplierEntityForm";
import {usePartnerUtils} from "@pages/Partner/Shared/partner.utils";
import PartnerAvatar from "@pages/Partner/Shared/PartnerAvatar";
import {Checkbox, Form, Tabs} from "antd";
import {TabsProps} from "antd/lib";
import {useTranslation} from "react-i18next";
import "./index.scss";
import {CustomerService} from "@api/CustomerService";
import {SupplierService} from "@api/SupplierService";
import {PartnerDoctorEntityForm} from "@pages/Partner/Doctor/Forms/PartnerDoctorEntityForm";
import {WorkIcon} from "@ord-components/icon/WorkIcon";
import {PartnerDoctorService} from "@api/PartnerDoctorService";
import {EmployeeService} from "@api/EmployeeService";
import {useEffect, useRef, useState} from "react";
import {EmployeeCreateOrUpdateForm} from "@pages/HumanResource/Employee/ModalCruEmployee";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";

export interface IPartnerInputProp extends IBaseOrdSelectProp {
    onChange?: (value: any, option: any) => void;
    partner_type: PARTNER_TYPE | undefined;
    hiddenAddNewBtn?: boolean,
    onReady?: (params: {
        addNewAction?: IOrdSelectAndAddNewActions,
        dataSource?: SelectDataSource
    }) => void;
}

const PartnerInput = (props: IPartnerInputProp) => {
    const [t] = useTranslation('customer');
    const {t: tCommon} = useTranslation('common');
    const {clearDatasource} = usePartnerUtils()
    const [value, setValue] = useState<any>(props.value);

    const apiSave = async (formValue: any) => {
        UiUtils.setBusy()
        try {
            const input: PartnerDto = {
                ...formValue,
                type: props.partner_type,
            }
            let apiService;
            if (props.partner_type == 2) {
                apiService = SupplierService;
            } else if (props.partner_type == 1) {
                apiService = CustomerService;
            } else if (props.partner_type == 4) {
                apiService = EmployeeService;
            } else if (props.partner_type == 6) {
                apiService = PartnerDoctorService;
            } else {
                apiService = CustomerService;
            }

            const result = await apiService.createOrUpdate({
                body: input
            });

            if (result.isSuccessful) {
                let messageKey = "";
                if (props.partner_type == 1) {
                    messageKey = "addNewCustomerSuccess"
                } else if (props.partner_type == 2) {
                    messageKey = "addNewSupplierSuccess"
                } else if (props.partner_type == 4) {
                    messageKey = "addNewEmployeeSuccess"
                } else if (props.partner_type == 6) {
                    messageKey = "addNewDoctorSuccess"
                } else {
                    messageKey = "addNewPartnerSuccess";
                }

                UiUtils.showSuccess(tCommon(messageKey, {
                    ...result.data
                }) as any);

                clearDatasource(props.partner_type);
            } else {
                ServiceProxyUtils.notifyErrorResultApi(result, "customer", {...formValue});
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
            const op: IOrdSelectOption = {
                value: value.id,
                title: value.name,
                data: value
            }
            if (props.onChange)
                props.onChange(value.id, op);
        }
    }
    const FormContent = () => {
        switch (props.partner_type) {
            case 1:
                return <FormContentCustomer></FormContentCustomer>
            case 2:
                return <FormContentSupplier></FormContentSupplier>
            case 4:
                return <FromContentEmployee></FromContentEmployee>
            case 6:
                return <FormContentDoctor></FormContentDoctor>
            default:
                return <FormContentCustomer></FormContentCustomer>
        }
    }
    const isDisable = () => {
        if (!props.partner_type) {
            return true;
        } else {
            return props.disabled
        }
    }
    const dataSource = useSelectPartner(props.partner_type);
    useEffect(() => {
        setValue(props.value);
    }, [props.value]);


    const onChange = (value: any, option: any) => {
        props.onChange?.(value, option);
    }


    const selectRef = useRef<IOrdSelectAndAddNewActions | null>(null);
    const searchByCodePhone = (searchVal: string, dataSource: SelectDataSource) => {
        if (searchVal) {
            const fts = Utils.toLowerCaseNonAccentVietnamese(searchVal.trim().toLowerCase())
            const find = dataSource.data.find(f => (
                Utils.toLowerCaseNonAccentVietnamese((f.data as PartnerDto).code) == fts
                || Utils.toLowerCaseNonAccentVietnamese((f.data as PartnerDto).phone)) == fts)
            if (find) {
                // setValue(find.value);
                // onChange(find.value as any, find);
                // setSearchVal('')
                return find;
            } else {
                // UiUtils.showInfo(t("notFoundPartner"));
                return null;
            }
        }

    };
    return (
        <>
            <OrdSelectAndAddNew
                {...props}
                className={props.className + (props.usingqrsearch ? ' partner-qr-search' : '')}
                value={value}
                onChange={onChange}
                disabled={isDisable()}
                formContent={(<FormContent/>)}
                apiAddNew={apiSave}
                nameDataSource={ComboKeyPartner(props.partner_type)}
                renderSelectOptions={PartnerCustomerRenderSelectItem}
                optionRender={(option: any) => (<PartnerCustomerLabel dto={option.data?.data}/>)}
                datasource={dataSource}
                onInputKeyDown={($event) => {
                    if ($event.key == "Enter" && props.usingqrsearch) {
                        // case  máy quet sau khi quét xong tự nhấn enter sẽ chặn
                        $event.preventDefault();
                        $event.stopPropagation();
                    }
                }}
                onReady={(actions) => {
                    selectRef.current = actions;
                    if (props.onReady) {
                        props.onReady({
                            addNewAction: actions,
                            dataSource: dataSource
                        });
                    }
                }}
                modalSetting={{
                    width: 1200,
                    style: {
                        top: 30
                    }
                }}
                onAddDone={handlerDoneAdd}
                allowClear={true}
            >
            </OrdSelectAndAddNew>

        </>

    );
}
export default PartnerInput;

const FormContentCustomer = () => {
    const {t} = useTranslation(['customer-supplier']);
    const form = Form.useFormInstance();

    useEffect(() => {
        form.setFieldsValue({
            isActived: true,
        })
    }, [])

    const itemTab: TabsProps["items"] = [
        {
            icon: <ProfileIcon/>,
            key: "1",
            label: t("customerInfo"),
            children: (
                <>
                    <PartnerCustomerEntityForm
                    ></PartnerCustomerEntityForm>
                </>
            ),
        },
        {
            icon: <Wallet2Icon/>,
            key: '2',
            label: t('transactionHistory'),
            disabled: true,
        },
    ];
    return <>
        <Tabs
            className={'tab-cru-customer'}
            tabBarExtraContent={{
                left: <div className={'text-center'}>
                    <PartnerAvatar></PartnerAvatar>
                    <Form layout='vertical' className='mt-1'>
                        <Form.Item className='my-1 block' name='isActive'
                                   valuePropName="checked"
                                   initialValue={true}>
                            <Checkbox disabled>{t('isActived')}</Checkbox>
                        </Form.Item>
                    </Form>
                </div>
            }}
            tabPosition={'left'} items={itemTab}>
        </Tabs>
    </>
}

const FormContentSupplier = () => {
    const [t] = useTranslation('customer-supplier');
    const form = Form.useFormInstance();

    useEffect(() => {
        form.setFieldsValue({
            isActived: true,
        })
    }, [])

    const itemTab: TabsProps["items"] = [
        {
            icon: <ProfileIcon/>,
            key: "1",
            label: t("customerInfo"),
            children: (
                <>
                    <PartnerSupplierEntityForm
                    ></PartnerSupplierEntityForm>
                </>
            ),
        },
        {
            icon: <Wallet2Icon/>,
            key: '2',
            label: t('transactionHistory'),
            disabled: true,
        },
    ];
    return <>
        <Tabs
            className={'tab-cru-customer'}
            tabBarExtraContent={{
                left: <div className={'text-center'}>
                    <PartnerAvatar></PartnerAvatar>
                    <Form layout='vertical' className='mt-1'>

                        <Form.Item className='my-1 block' name='isActive'
                                   valuePropName="checked"
                                   initialValue={true}>
                            <Checkbox disabled>{t('isActived')}</Checkbox>
                        </Form.Item>
                    </Form>
                </div>
            }}
            tabPosition={'left'} items={itemTab}>
        </Tabs>
    </>
}

const FormContentDoctor = () => {
    const {t} = useTranslation(["partner-doctor"]);
    const form = Form.useFormInstance();


    useEffect(() => {
        form.setFieldsValue({
            isActived: true,
        })
    }, [])

    const itemTab: TabsProps["items"] = [
        {
            icon: <ProfileIcon/>,
            key: "1",
            label: t("customerInfo"),
            children: (
                <>
                    <PartnerDoctorEntityForm/>
                </>
            ),
        },
        {
            icon: <WorkIcon/>,
            key: "2",
            label: t("prescriptionHistory"),
            disabled: true,
        },
    ];
    return <>
        <Tabs
            className={'tab-cru-customer'}
            tabBarExtraContent={{
                left: <div className={'text-center'}>
                    <PartnerAvatar></PartnerAvatar>
                    <Form layout='vertical' className='mt-1'>

                        <Form.Item className='my-1 block' name='isActive'
                                   valuePropName="checked"
                                   initialValue={true}>
                            <Checkbox disabled>{t('isActived')}</Checkbox>
                        </Form.Item>
                    </Form>
                </div>
            }}
            tabPosition={'left'} items={itemTab}>
        </Tabs>
    </>
}
const FromContentEmployee = () => {
    const form = Form.useFormInstance();
    useEffect(() => {
        form.setFieldsValue({
            type: 4,
            isActived: 1,
        })
    }, [])

    return <div className="employee-form"><EmployeeCreateOrUpdateForm/></div>
}


