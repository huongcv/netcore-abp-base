import {
    DownOutlined,
    FileExcelOutlined,
    PlusOutlined,
    UnorderedListOutlined,
    UploadOutlined
} from "@ant-design/icons";
import { CustomerGroupService } from "@api/CustomerGroupService";
import { DoctorGroupService } from "@api/DoctorGroupService";
import {
    PartnerGroupDto,
    PartnerGroupPagedRequestDto
} from "@api/index.defs";
import { SupplierGroupService } from "@api/SupplierGroupService";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { SearchIsActived } from "@ord-components/forms/search/SearchIsActived";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import { CommonListStore } from "@ord-core/base/CommonListStore";
import TableUtil from "@ord-core/utils/table.util";
import Utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
import CreateOrUpdateFormCusGroup from "@pages/Partner/CustomerGroup/CreateOrUpdateFormCusGroup";
import CreateOrUpdateFormSupGroup from "@pages/Partner/CustomerSupplierGroup/CreateOrUpdateFormSusGroup";
import CreateOrUpdateFormDoctorGroup from "@pages/Partner/DoctorGroup/CreateOrUpdateFormDoctorGroup";
import CreateOrUpdateCaddyGroupForm from "@pages/1.Golf/Category/GolfCaddyGroup/index";
import {
    Button,
    Dropdown,
    Modal,
    Space,
    TableColumnsType
} from "antd";
import { observe } from "mobx";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { GolfCaddyGroupService } from "@api/GolfCaddyGroupService";
import { AppExtendCode } from "@ord-core/AppConst";
import { EmployeeGroupService } from "@api/EmployeeGroupService";
import CreateOrUpdateEmployeeGroupForm from "@pages/HumanResource/Employee/CreateOrUpdateEmployeeGroupForm";

type Props = {
    partnerType: number;
    isCustomerGroupGolf?: boolean 
    store: CommonListStore<PartnerGroupDto>;
};

const EntityForm = ({ partnerType,isCustomerGroupGolf }: { partnerType: number,isCustomerGroupGolf?: boolean }) => {
    const FormComponent = useMemo(() => {
        const map: Record<number, JSX.Element> = {
            1: <CreateOrUpdateFormCusGroup isCustomerGroupGolf={isCustomerGroupGolf} />,
            2: <CreateOrUpdateFormSupGroup />,
            3: <CreateOrUpdateFormDoctorGroup />,
            //4: <CreateOrUpdateCaddyGroupForm />
            4: <CreateOrUpdateEmployeeGroupForm />
        };
        return map[partnerType] ?? <CreateOrUpdateFormCusGroup />;
    }, [partnerType]);

    return FormComponent;
};

const PartnerGroupBtn = ({ partnerType, store, isCustomerGroupGolf }: Props) => {
    const {
        customerStore,
        employeeGroupStore,
        selectDataSourceStore,
        customerSupplierStore,
        partnerDoctorStore,
        golfCaddyStore, 
        sessionStore
    } = useStore();
    const [t] = useTranslation(store.getNamespaceLocale());
    const [openListModal, setOpenListModal] = useState(false);

    const refreshPartnerData = useCallback((type: number) => {
        const map: Record<number, () => void> = {
            1: customerStore.refreshGridData,
            2: customerSupplierStore.refreshGridData,
            //4: golfCaddyStore.refreshGridData,
            4: employeeGroupStore.refreshGridData,
            6: partnerDoctorStore.refreshGridData
        };
        map[type]?.();
    }, []);

    const PartnerGroupService = useMemo(() => {
        const map: Record<number, any> = {
            1: CustomerGroupService,
            2: SupplierGroupService,
            //4: GolfCaddyGroupService, code cũ của caddy nhưng h đã thay đổi nghiệp vụ
            4: EmployeeGroupService,
            6: DoctorGroupService,
        };
        return map[partnerType] ?? CustomerGroupService;
    }, [partnerType]);

    const getImportPath = (): string => {
        let prefixRouter = ""; 
        if(sessionStore.isGolfShop) {
            prefixRouter = AppExtendCode.golf
        }
        else {
            prefixRouter = AppExtendCode.proShop; 
        }

        console.log(prefixRouter);
        switch (partnerType) {
            case 1: return  "/app/" + prefixRouter + "/customer-group/import-excel";
            case 2: return "/app/" + prefixRouter + "/supplier-group/import-excel";
            case 3: return "/app/" + prefixRouter + "/doctor-group/import-excel";
            default: return "/app/" + prefixRouter + "/customer-group/import-excel";
        }
    };

    const items = useMemo(() => {
        const baseItem = [
            {
                key: "0",
                label: (
                    <a onClick={() => store.openCreateModal({ groupType: partnerType })}>
                        <PlusOutlined className="me-1 mr-2" />
                        {t("partnerGroupAction.addNew")}
                    </a>
                )
            },
            {
                key: "1",
                label: (
                    <a onClick={() => setOpenListModal(true)}>
                        <IconlyLight type="Paper.svg" width={16} className="me-1 mr-2" />
                        {t("partnerGroupAction.list")}
                    </a>
                )
            }
        ]
        if(partnerType !== 4 ) {
            baseItem.push({
            key: "2",
            label: (
                <Link to={getImportPath()}>
                    <UploadOutlined className="me-1 mr-2" />
                    {t("partnerGroupAction.importExcel")}
                </Link>
            )
            })
            baseItem.push({
                key: "3",
                label: (
                    <span
                        onClick={() => {
                            const params: PartnerGroupPagedRequestDto = {
                                ...store.searchFormRef?.getFieldsValue(),
                                groupType: partnerType
                            };
                            store.exportExcelPagedResult(params);
                        }}
                    >
                        <FileExcelOutlined className="me-1 mr-2" />
                        {t("partnerGroupAction.exportExcel")}
                    </span>
                )
            })
        }
        return baseItem;
    }, [partnerType]);

    const columns: TableColumnsType<any> = useMemo(() => TableUtil.getColumns([
        {
            title: "ma",
            dataIndex: "groupCode",
            width: 150
        },
        {
            dataIndex: "groupName",
            title: "ten",
            width: 150,
            ellipsis: true,
            render: (value) => <div className="max-w-60 text-ellipsis overflow-hidden">{value}</div>
        },
        {
            dataIndex: "groupDiscountPercent",
            title: "groupDiscountPercent",
            width: 150,
            ellipsis: true,
            hidden: partnerType != 1, 
            render: (value) => <div className="max-w-60 text-ellipsis overflow-hidden">{value}</div>
        },
        {
            dataIndex: "notes",
            title: "notes",
            width: 200,
            ellipsis: true,
            render: (value) => <div className="max-w-xl text-ellipsis overflow-hidden">{value}</div>
        },
        IsActivedColumn()
    ], {
        actions: [
            {
                title: "view",
                onClick: (d) => {
                    store.openViewDetailModal(d);
                },
            },
            {
                title: "edit",
                onClick: (d) => {
                    store.openUpdateModal(d);
                },
            },
            {
                title: "remove",
                onClick: (d) => {
                    store.openRemoveById(d);
                },
            },
        ],
        ns: store.getNamespaceLocale()
    }), []);

    const handleCancel = () => setOpenListModal(false);

    const handleOnReset = useCallback(() => {
        store.searchFormRef?.resetFields();
        setTimeout(() => {
            store.searchFormRef?.setFieldValue("groupType", partnerType);
        }, 0);
    }, [store.searchFormRef, partnerType]);

    const handleSavedSuccess = useCallback(() => {
        const key = `PartnerGroup_${partnerType}`;
        selectDataSourceStore.clearByName(key);
        selectDataSourceStore.getOptions(key, async () => {
            const result = await PartnerGroupService.getComboOptions();
            return Utils.mapCommonSelectOption(result);
        });
        refreshPartnerData(partnerType);
    }, [partnerType]);

    useEffect(() => {
        if (openListModal) {
            store.searchFormRef?.resetFields();
            store.searchFormRef?.setFieldValue("groupType", partnerType);
            store.refreshGridData();
        }
    }, [openListModal, partnerType]);

    return (
        <>
            <Dropdown menu={{ items }}>
                <Button icon={<UnorderedListOutlined />}>
                    {t("partnerGroup." + partnerType)}
                    <DownOutlined />
                </Button>
            </Dropdown>

            <Modal
                open={openListModal}
                style={{ top: 5 }}
                width={1300}
                onCancel={handleCancel}
                title={t("partnerGroupAction.listOfGroup")}
                footer={
                    <Space wrap>
                        <ModalCloseBtn onClick={handleCancel} />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                handleCancel();
                                store.openCreateModal();
                            }}
                        >
                            {t("partnerGroupAction.addNew")}
                        </Button>
                    </Space>
                }
            >
                <OrdCrudPage
                    stored={store}
                    hiddenTopAction
                    columns={columns}
                    tableBordered
                    searchForm={() =>
                        <>
                            <SearchIsActived />
                            <SearchFilterText span={8} onReset={handleOnReset} />
                        </>
                    }
                    onEntitySavedSuccess={handleSavedSuccess}
                />
            </Modal>

            <OrdCreateOrUpdateModal
                stored={store}
                entityForm={() => <EntityForm partnerType={partnerType} />}
                onSavedSuccess={handleSavedSuccess}
            />
        </>
    );
};

export default observer(PartnerGroupBtn);
