import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { PartnerGroupDto } from "@api/index.defs";
import { ProductPriceListDetailService } from "@api/ProductPriceListDetailService";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import TableUtil from "@ord-core/utils/table.util";
import uiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import { Button, Col, Form, Modal, Space, TableColumnsType } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { Row } from "antd/lib";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";

const ModalCustomerGroupInDetail = () => {
    const {
        customerApplyInDetailStore: mainStore,
        productPriceListDetailStore
    } = useStore();
    const { t } = useTranslation('customer-group');
    const { t: tEnum } = useTranslation('enum');
    const [cusForm] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<PartnerGroupDto[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[], records: PartnerGroupDto[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRecords(records);
    };

    const rowSelection: TableRowSelection<PartnerGroupDto> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onReset = () => {
        cusForm.resetFields();
        cusForm.submit();
    }

    const columns: TableColumnsType<PartnerGroupDto> = TableUtil.getColumns([
        {
            title: 'GroupCode',
            dataIndex: 'groupCode',
            width: 150,
        },
        {
            dataIndex: 'groupName',
            title: 'GroupName',
            width: 300,
        },
        {
            dataIndex: 'groupDiscountPercent',
            title: 'groupDiscountPercent',
            align: 'right',
            width: 150,
        },
        IsActivedColumn(),
        {
            title: "action",
            align: "center",
            width: 80,
            render: (v, record) => (
                <>
                    <Button
                        size={"small"}
                        onClick={() => handleRemove(record.id?.toString() as any)}
                        danger
                    >
                        <DeleteOutlined />
                    </Button>
                </>
            ),
        },
    ], {
        ns: 'customer-group'
    });

    const handleRemoveSelected = () => {
        const partnerPublishIds = selectedRecords.map(x => x.id);

        uiUtils.showConfirm({
            title: t('confirmRemovePartnerGroupTitle'),
            icon: "remove",
            content: t('confirmMultiRemovePartnerGroupMessage'),
            isDanger: true,
            onOk: async () => {
                try {
                    const response = await ProductPriceListDetailService.removePartnerGroupApplyToDetail({
                        body: partnerPublishIds.map(id => ({
                            priceListDetailsId: mainStore.createOrUpdateModal.entityData.id,
                            partnerGroupId: id
                        }))
                    });

                    if (response.isSuccessful) {
                        uiUtils.showSuccess(t('removeCustomerGroupFromDetailSuccess'));
                        await Promise.all([
                            mainStore.refreshGridData(),
                            productPriceListDetailStore.refreshGridData()
                        ]);
                        setSelectedRecords([]);
                        setSelectedRowKeys([]);
                    } else {
                        uiUtils.showError(response.message || t('removeCustomerGroupFromDetailFailed'));
                    }
                } catch (error) {
                    uiUtils.showError(t('removeCustomerGroupFromDetailFailed'));
                    console.error('Error removing partner group:', error);
                }
            }
        });
    };

    const handleRemove = (id: string) => {
        uiUtils.showConfirm({
            title: t('confirmRemovePartnerGroupTitle'),
            icon: 'remove',
            content: (
                <div>{t('confirmRemovePartnerGroupMessage')}</div>
            ),
            isDanger: true,
            onOk: async () => {
                ProductPriceListDetailService.removePartnerGroupApplyToDetail({
                    body: [{
                        priceListDetailsId: mainStore.entityUpdateData.id,
                        partnerGroupId: id,
                    }]
                }).then(res => {
                    if (res.isSuccessful) {
                        uiUtils.showSuccess(t('removeCustomerGroupFromDetailSuccess'))
                        mainStore.refreshGridData().then();
                        productPriceListDetailStore.refreshGridData().then();

                        setSelectedRecords([]);
                        setSelectedRowKeys([]);
                    } else {
                        uiUtils.showError(res.message || t('removeCustomerGroupFromDetailFailed'));

                    }
                })
            }
        })
    }

    const handleCloseModal = () => {
        mainStore.closeModal();
    }

    const handleOpenSelectCustomerModal = () => {
        mainStore.setIsShowSelectCustomerModal(true);
    }

    useHotkeys('F10', (event) => {
        handleCloseModal();
        event.preventDefault();
    }, { scopes: ['customerGroupInDetail'], enableOnFormTags: true })

    useHotkeys('F2', (event) => {
        handleOpenSelectCustomerModal();
        event.preventDefault();
    }, { scopes: ['customerGroupInDetail'], enableOnFormTags: true, enabled: !mainStore.isShowSelectCustomerGroupModal })

    return (
        <HotkeysProvider initiallyActiveScopes={['customerGroupInDetail']}>
            <Modal
                width={'60%'}
                title={t('cusGroupInDetail', {
                    groupName: mainStore.entityUpdateData.groupName ?? ""
                })}
                open={mainStore.createOrUpdateModal.visible}
                onCancel={() => handleCloseModal()}
                footer={
                    <Row>
                        <Col span={24} className="flex space-x-4 justify-end" >
                            <Button onClick={() => handleCloseModal()}>
                                <Space>
                                    <CloseOutlined />
                                </Space>
                                {t('actionBtn.back')}
                            </Button>
                            <Button type='primary'
                                onClick={() => handleOpenSelectCustomerModal()}
                            >
                                <Space>
                                    <PlusOutlined />
                                </Space>
                                {t('actionBtn.addNewCusGroup')}
                            </Button>
                        </Col>
                    </Row>
                }>
                <Form
                    form={cusForm}
                    className={'crud-search-box'}
                    layout='vertical'
                    onFinish={debounce((d) => {
                        mainStore.searchData(d);
                    }, 250)}
                    onFinishFailed={() => uiUtils.showCommonValidateForm()}>
                    <Form.Item hidden name={'hotKeyScopeId'} initialValue={'customerGroupInDetail'}></Form.Item>
                    <Row className="justify-between">
                        <Col md={15}>
                            <SearchFilterText span={18} onReset={onReset} placeHolder={t('customerGroupSearchText')} />
                        </Col>
                        <Col className="flex ml-auto" >
                            {selectedRowKeys.length > 0 && (
                                <Button onClick={handleRemoveSelected}>
                                    <Space>
                                        <DeleteOutlined className={'me-1'} />
                                        {t('actionBtn.removeCusGroup', {
                                            count: selectedRowKeys.length
                                        })}
                                    </Space>
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Form>
                <AntTableWithDataPaged
                    searchForm={cusForm}
                    searchData={mainStore.searchDataState}
                    columns={columns}
                    rowSelection={rowSelection}
                    getPageResult={(d) => {
                        return mainStore.apiService().getPaged({
                            body: {
                                ...d.body,
                                priceListDetailId: mainStore.createOrUpdateModal.entityData.id,
                            }
                        }, {})
                    }}
                    refreshDatasource={mainStore.refreshDataState}
                />
            </Modal>
        </HotkeysProvider>
    )
}

export default observer(ModalCustomerGroupInDetail)
