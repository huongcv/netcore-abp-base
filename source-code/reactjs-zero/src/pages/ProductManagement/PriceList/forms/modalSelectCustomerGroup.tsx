import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { CustomerGroupService } from "@api/CustomerGroupService";
import { PartnerGroupDto } from "@api/index.defs";
import { ProductPriceListDetailService } from "@api/ProductPriceListDetailService";

import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import tableUtil from "@ord-core/utils/table.util";
import uiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import { Button, Col, Form, Modal, Row, Space, Table, TableColumnsType, Tabs } from "antd";
import { TableRowSelection } from "antd/lib/table/interface";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";

const ModalSelectCustomerGroup = () => {
    const { t } = useTranslation('customer-group');
    const { t: tCommon } = useTranslation("common");
    const { t: tEnum } = useTranslation("enum");
    const { customerApplyInDetailStore: mainStore, productPriceListDetailStore } = useStore();
    const [cusForm] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<PartnerGroupDto[]>([]);

    const formatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    });

    const onSelectChange = (newSelectedRowKeys: React.Key[], records: PartnerGroupDto[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRecords(records);
    };

    const rowSelection: TableRowSelection<PartnerGroupDto> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const columns: TableColumnsType<PartnerGroupDto> = tableUtil.getColumns(
        [
            {
                title: 'GroupCode',
                dataIndex: 'groupCode',
                width: 150,
            },
            {
                title: 'GroupName',
                dataIndex: 'groupName',
                width: 300,
            },
            {
                dataIndex: 'groupDiscountPercent',
                title: 'groupDiscountPercent',
                align: 'right',
                width: 150,
            },
            IsActivedColumn()
        ],
        {
            ns: 'customer-group',
        }
    );

    useEffect(() => {
        if (mainStore) {
            cusForm.setFields([
                {
                    name: 'filter',
                    value: ""
                },
            ])
            mainStore.setSearchFormRef(cusForm);
        }
    }, []);

    const handleAddCustomerGroupToDetail = () => {
        let partnerPublishIds = selectedRecords.map(x => x.id);
        uiUtils.setBusy();
        ProductPriceListDetailService.addPartnerGroupApplyToDetail({
            body: partnerPublishIds.map(id => ({
                priceListDetailsId: mainStore.createOrUpdateModal.entityData.id,
                partnerGroupId: id
            }))
        }).then(res => {
            if (res.isSuccessful) {
                uiUtils.showSuccess(t('addCustomerGroupFromDetailSuccess'))
                mainStore.refreshGridData().then();
                productPriceListDetailStore.refreshGridData().then();
                mainStore.setIsShowSelectCustomerModal(false);
            } else {
                uiUtils.showError(res.message || 'addCustomerGroupFromDetailFaild');
            }
        }).finally(() => {
            uiUtils.clearBusy();
        })
    }

    const onReset = () => {
        cusForm.resetFields();
        cusForm.submit();
    }

    useHotkeys('F8', (event) => {
        if (mainStore.isShowSelectCustomerGroupModal) {
            handleAddCustomerGroupToDetail();
            event.preventDefault();
        }

    }, { scopes: ['selectCustomerGroup'], enableOnFormTags: true, enabled: selectedRowKeys.length > 0 })

    useHotkeys('F10', (event) => {
        mainStore.setIsShowSelectCustomerModal(false);
        event.preventDefault();
    }, { scopes: ['selectCustomerGroup'], enableOnFormTags: true })

    return <>
        <HotkeysProvider initiallyActiveScopes={['selectCustomerGroup']}>
            <Modal
                title={t('addPartnerToGroup', {
                    groupName: mainStore.entityUpdateData.groupName
                })}
                width={'60%'}
                open={mainStore.isShowSelectCustomerGroupModal}
                onCancel={() => mainStore.setIsShowSelectCustomerModal(false)}
                footer={
                    <Space wrap>
                        <Button onClick={() => mainStore.setIsShowSelectCustomerModal(false)}>
                            <Space>
                                <CloseOutlined />
                            </Space>
                            {t('actionBtn.back')}
                        </Button>
                        <Button type={'primary'} icon={<SaveOutlined />} onClick={handleAddCustomerGroupToDetail} disabled={selectedRowKeys.length === 0}>
                            {t('actionBtn.save')}
                        </Button>
                    </Space>
                }>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab={t('allPartnerGroups')} key="1">
                        <Form form={cusForm} className={'crud-search-box'}
                            layout='vertical'
                            onFinish={debounce((d) => {
                                productPriceListDetailStore.searchData(d);
                            }, 250)}
                            onFinishFailed={() => uiUtils.showCommonValidateForm()}>
                            <Form.Item hidden name={'hotKeyScopeId'} initialValue={'selectCustomerGroup'}></Form.Item>
                            <Row justify="space-between">
                                <Col {...useResponsiveSpan(15)}>
                                    <SearchFilterText
                                        ignoreAutoFocus={true}
                                        span={18}
                                        onReset={onReset}
                                        placeHolder={t('customerGroupSearchText')}
                                    ></SearchFilterText>
                                </Col>
                            </Row>
                        </Form>
                        <AntTableWithDataPaged
                            searchForm={cusForm}
                            columns={columns}
                            rowSelection={rowSelection}
                            searchData={mainStore.searchDataState}
                            getPageResult={(d) => {
                                return CustomerGroupService.getPagedInPriceListDetailToAdd({
                                    body: {
                                        ...d.body,
                                        priceListDetailId: mainStore.entityUpdateData.id,
                                    }
                                }, {})
                            }}

                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={`${t('selectedPartnerGroups')} (${selectedRecords.length})`} key="2">
                        <Table
                            bordered={true}
                            columns={columns}
                            dataSource={selectedRecords}
                            rowKey="key"
                            pagination={false}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </Modal>
        </HotkeysProvider>
    </>
}

export default observer(ModalSelectCustomerGroup);
