import React, {lazy, Suspense, useEffect} from "react";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {Checkbox, Col, Form, FormInstance, Input, Row, Spin, TableColumnsType} from "antd";
import {Trans, useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import TableUtil from "@ord-core/utils/table.util";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {ShopDto, TenantDto} from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {observer} from "mobx-react-lite";
import ShopFormSearch from "@pages/Admin/Shop/ShopFormSearch";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {AppstoreAddOutlined, CheckOutlined} from "@ant-design/icons";
import {useSelectPackageTrial} from "@ord-components/forms/select/selectDataSource/useSelectPackage";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {debounce} from "lodash";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import {TopAction} from "@ord-components/crud/TopAction";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import UiUtils from "@ord-core/utils/ui.utils";
import {useSelectShopTypeEnum} from "@ord-components/forms/select/selectDataSource/useSelectShopTypeEnum";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectBusinessType} from "@ord-components/forms/select/selectDataSource/useSelectBusinessTypeEnum";

export const CreateOrUpdateForm = (props: {
    form: FormInstance,
    tenant?: TenantDto
}) => {
    const {t} = useTranslation('shop-list');
    const {t: tCommon} = useTranslation('common');
    const form = Form.useFormInstance();
    const packageOptions = useSelectPackageTrial();
    const {shopListStore: mainStore} = useStore();
    const isUpdate = !!mainStore.entityUpdateData?.id;

    useEffect(() => {
        if (props.tenant) {
            form.setFieldsValue({
                tenantId: props.tenant.id,
                tenant: {
                    ...props.tenant
                }
            });
        }
    }, [props.tenant]);

    return (<>
        <FloatLabel label={t('code')} required>
            <Form.Item name='code' rules={[ValidateUtils.required, ValidateUtils.NoSpecialCharacter]}>
                <Input disabled={isUpdate} maxLength={10}/>
            </Form.Item>
        </FloatLabel>
        <FloatLabel label={t('name')}>
            <Form.Item name='name' rules={[ValidateUtils.required]}>
                <Input maxLength={100}/>
            </Form.Item>
        </FloatLabel>
        <FloatLabel label={t('type')} required>
            <Form.Item name='type' rules={[ValidateUtils.required]}>
                <OrdSelect allowClear disabled={isUpdate} datasource={useSelectShopTypeEnum()}
                ></OrdSelect>
            </Form.Item>
        </FloatLabel>
        <FloatLabel label={t('businessType')} required>
            <Form.Item name='businessType' rules={[ValidateUtils.required]}>
                <OrdSelect allowClear disabled={isUpdate} datasource={useSelectBusinessType()}
                ></OrdSelect>
            </Form.Item>
        </FloatLabel>
        <FloatLabel label={t('PhoneNumber')}>
            <Form.Item name='phone' rules={[ValidateUtils.phoneNumberVietNam]}>
                <Input maxLength={200}/>
            </Form.Item>
        </FloatLabel>
        <FloatLabel label={t('Email')}>
            <Form.Item name='email' rules={[ValidateUtils.email]}>
                <Input maxLength={200}/>
            </Form.Item>
        </FloatLabel>
        <FloatLabel label={tCommon('Address')}>
            <Form.Item name='address'>
                <Input maxLength={200}/>
            </Form.Item>
        </FloatLabel>
        {/* {
            // 
            mainStore.createOrUpdateModal.mode === 'addNew' && code_w && 
                <Row gutter={16}>
                    <Col span={12}>
                        <FloatLabel label={t('userNameAdminShop')} required>
                            <Form.Item name='userNameAdminShop'
                                rules={[ValidateUtils.required, ValidateUtils.userName]}
                                initialValue={'shop_admin'}
                            >
                                <Input addonBefore={code_w ? (code_w + '_') : ''} maxLength={200} />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={12}>
                        <FloatLabel label={t('passwordAdminShop')} required>
                            <Form.Item name='passwordAdminShop'
                                rules={[ValidateUtils.required, ValidateUtils.password]}>
                                <Input maxLength={200} />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>
        } */}

        <div hidden={isUpdate}>
            <FloatLabel label={t('packageTrial')}>
                <Form.Item name='packageRegistrationId'>
                    <OrdSelect allowClear datasource={packageOptions}
                    ></OrdSelect>
                </Form.Item>
            </FloatLabel>
            <Form.Item name='isMain' valuePropName="checked">
                <Checkbox>{t('isMain')}</Checkbox>
            </Form.Item>
        </div>
        <Form.Item name='isActived' valuePropName="checked">
            <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
        </Form.Item>

        <div hidden>
            <Form.Item name='tenantId'/>
            <Form.Item name={['tenant', 'code']}/>
            <Form.Item name={['tenant', 'name']}/>
            <Form.Item name='inventoryMainId' noStyle hidden/>
        </div>
    </>)
}

const Shop = (props: {
    tenant?: TenantDto | undefined
}) => {
    const {t: tCommon} = useTranslation(['common']);
    const {shopListStore: mainStore, shopPackageRegistrationStore: shopPackageRegistrationStore} = useStore();
    const [searchFormRef] = Form.useForm();
    const [formEntity] = Form.useForm();
    const srcEnum = useSelectShopTypeEnum();
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'code',
            dataIndex: 'code',
            width: 200,
            sorter: true
        },
        {
            dataIndex: 'name',
            title: 'name',
        },

        {
            dataIndex: 'type',
            title: 'type',
            width: 300,
            render: (_) => {
                return <DisplayTextFormSelectDataSource value={_}
                                                        datasource={srcEnum}/>
            }
        },
        {
            dataIndex: 'isMain',
            title: 'isMain',
            width: 150,
            align: 'center',
            render: (_) => {
                return _ ? <CheckOutlined></CheckOutlined> : ''
            }
        },
        IsActivedColumn()
    ], {
        actions: [
            {
                title: 'view',
                onClick: (d) => {
                    mainStore.openViewDetailModal(d);
                }
            },
            {
                title: 'edit',
                onClick: (d) => {
                    mainStore.openUpdateModal(d);
                }
            },
            {
                title: 'remove',
                onClick: (d) => {
                    mainStore.openRemoveById(d);
                }
            },
            {
                title: 'subscribe.package',
                icon: <AppstoreAddOutlined/>,

                onClick: (d) => {
                    const record = d as ShopDto;
                    shopPackageRegistrationStore.openCreateModal({
                        ...record,
                        id: 0,
                        shopId: record.id,
                    });
                }
            },

        ],
        ns: mainStore.getNamespaceLocale()
    });
    useEffect(() => {
        if (!!mainStore.removeRecord) {
            const {removeRecord} = mainStore;
            UiUtils.showConfirm({
                title: tCommon('confirmDelete'),
                icon: "remove",
                content: (<Trans ns={mainStore.getNamespaceLocale()}
                                 i18nKey="confirmRemove"
                                 values={removeRecord}
                                 components={{italic: <i/>, bold: <strong/>}}></Trans>),
                onOk: (d) => {
                    mainStore.removeEntity().then(() => {

                    });
                },
                onCancel: () => {
                    mainStore.closeRemoveById();
                }
            });
        }

    }, [mainStore.removeRecord]);
    const topActions: IActionBtn[] = [
        {
            title: 'exportExcel',
            permission: PERMISSION_APP.masterData.shop,
            onClick: () => {
                mainStore.exportExcelPagedResult().then();
            }
        },
        {
            title: 'addNew',
            permission: PERMISSION_APP.masterData.shop + '.Create',
            onClick: () => {
                mainStore.openCreateModal();
            }
        }
    ];
    const LazyModalSubscribePackage = lazy(() => import('@pages/Admin/Shop/ModalSubscribePackage'));
    return (
        <>
            <Form form={searchFormRef} layout={"vertical"} onFinish={debounce((d) => {
                mainStore.searchData(d);
            }, 250)}>
                <Row gutter={16}>
                    <ShopFormSearch
                        onReset={() => {
                            searchFormRef.resetFields();
                            mainStore.refreshGridData(true).then()
                        }}
                        tenant={{...props.tenant}}></ShopFormSearch>
                    <Col {...useResponsiveSpan(14)}>
                        <div className='text-right'>
                            <TopAction topActions={topActions}/>
                        </div>
                    </Col>

                </Row>
            </Form>
            <AntTableWithDataPaged searchForm={searchFormRef}
                                   className={'table-padding'}
                                   getPageResult={(d) => {
                                       return mainStore.apiService().getPaged({
                                           body: {
                                               ...d.body,
                                           }
                                       }, {})
                                   }}
                                   columns={columns}
                                   searchData={mainStore.searchDataState}
                                   refreshDatasource={mainStore.refreshDataState}
            />

            <Suspense fallback={<Spin/>}>
                {shopPackageRegistrationStore.createOrUpdateModal.visible &&
                    <LazyModalSubscribePackage tenant={props.tenant} onCruSuccess={() => {
                        mainStore.refreshGridData(true).then()
                    }}></LazyModalSubscribePackage>}
            </Suspense>
            <OrdCreateOrUpdateModal stored={mainStore}
                                    entityForm={() => <CreateOrUpdateForm tenant={props.tenant}
                                                                          form={formEntity}></CreateOrUpdateForm>}/>
        </>)
        ;
};
export default observer(Shop);

