import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import React, { useEffect } from "react";
import {Button, Dropdown, MenuProps, Modal, Space, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {CheckCircleOutlined, DownOutlined, PlusCircleOutlined, PlusOutlined, StopOutlined} from "@ant-design/icons";
import {ReasonTypeDtColumns} from "@pages/AccountantManagement/reasonType/datatable/Columns";
import {ReasonTypeSearchForm} from "@pages/AccountantManagement/reasonType/datatable/SearchForm";
import {useNavigate} from "react-router-dom";
import {ReturnIcon} from "@ord-components/icon/ReturnIcon";
import {MoveReasonTypeDto, ProductDto} from "@api/index.defs";
import CreateOrUpdateReasonTypeForm from "@pages/AccountantManagement/reasonType/ModalCruReasonType";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import {observer} from "mobx-react-lite";
import { useAccountantUtils } from "../Shared/accountant.utils";

const ReasonType = () => {
    const {t} = useTranslation('reason-type');
    const {reasonTypeStore: mainStore} = useStore();
    const navigate = useNavigate();
     const { clearDatasource } = useAccountantUtils();
    const columns: TableColumnsType<any> = TableUtil.getColumns([...ReasonTypeDtColumns], {
        actions: [

            {
                title: 'remove',
                hiddenIf: (d: MoveReasonTypeDto) => {
                    return !!d.isReasonTypeSystem || !d.isEnableEdit
                },
                onClick: (d) => {
                    mainStore.openRemoveById(d);
                }
            }
        ],
        viewAction: (d: MoveReasonTypeDto)=>{
            if(d.isReasonTypeSystem || !d.isEnableEdit) {
                mainStore.openViewDetailModal(d);
            } else {
                mainStore.openUpdateModal(d);
            }
        },
        ns: mainStore.getNamespaceLocale(),
    });

    const items: MenuProps['items'] = [
        {
            label: <a onClick={() => {

                mainStore.openCreateModalWithType(1)
            }} type={'text'}>
                <Space>
                    <PlusOutlined/>
                    {t('reasonType.addNewReceipt')}
                </Space>
            </a>,
            key: 1,
        },
        {
            label: <a onClick={() => {
                mainStore.openCreateModalWithType(2)
            }} type={'text'}>
                <Space>
                    <PlusOutlined/>
                    {t('reasonType.addNewPayment')}
                </Space>
            </a>,
            key: 2,
        }
    ];

    const topActions: IActionBtn[] = [
        {
            title: 'exportExcel',
            permission: 'Accountant.MoveReasonType',
            onClick: () => {
                mainStore.exportExcelPagedResult().then()
            }
        },

        {
            permission: 'Accountant.MoveReasonType.Create',
            content: <Dropdown menu={{items}} trigger={['hover']}>
                <Button type='primary'>
                    <Space>
                        <PlusCircleOutlined/>
                        {t('reasonType.actionReason')}
                        <DownOutlined/>
                    </Space>
                </Button>
            </Dropdown>
        },
        {
            title: 'back',
            content:
                <Button onClick={() => navigate('/accountant/cashbook/dashboard')}>
                    <Space>
                        <ReturnIcon/>
                        {t('actionBtn.back')}
                    </Space>
                </Button>,
        },
    ];

    return (
        <Modal
            width={1200}
            title={t('pageTitle')}
            open={mainStore.isShowListModal}
            onCancel={() => mainStore.setIsShowListModal(false)}
            wrapClassName="modal-custom-centered"
            footer={<FooterCrudModal
                hasAddNewContinue={false}
                isAddNewContinue={false}
                hiddenOk={true}
                onOk={() => {
                    mainStore.setIsShowListModal(false)
                }}
                onCancel={() => mainStore.setIsShowListModal(false)}
            />}>
            <OrdCrudPage stored={mainStore}
                            hiddenTopAction={true}
                            columns={columns}
                            searchForm={(f) => <ReasonTypeSearchForm/>}
                            onEntitySavedSuccess={(_) => {
                                clearDatasource(1, true)
                                clearDatasource(2, true)
                            }}
                            entityForm={(form) => <CreateOrUpdateReasonTypeForm/>}
            ></OrdCrudPage>
        </Modal>

    )
}

export default observer(ReasonType);
