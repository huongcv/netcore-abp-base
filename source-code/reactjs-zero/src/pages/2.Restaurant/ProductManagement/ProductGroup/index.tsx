import React from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {Button, Dropdown} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {ProductGroupDtColumns} from "@pages/ProductManagement/ProductGroup/datatable/columns";
import {ProductGroupSearchForm} from "@pages/ProductManagement/ProductGroup/datatable/SearchForm";
import {CheckCircleOutlined, FileExcelOutlined, SettingOutlined, StopOutlined, UploadOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {ProductGroupCreateOrUpdateForm} from "@pages/ProductManagement/ProductGroup/forms/CreateOrUpdateForm";
import UiUtils from "@ord-core/utils/ui.utils";
import {ProductGroupService} from "@api/ProductGroupService";
import {ProductGroupDto} from "@api/index.defs";

export const ProductGroupColumns = (mainStore: any) => {
    const {t} = useTranslation("product-group-list");
    const {selectDataSourceStore} = useStore();

    const handleOnClickChangeIsActiveProduct = async (
        id: number,
        isActived: boolean
    ) => {
        try {
            UiUtils.setBusy();
            const result = await ProductGroupService.updateChangeIsActive({
                id,
                isActived,
            });
            if (result.isSuccessful) {
                UiUtils.showSuccess(t(`updateIsActiveSuccessfully`));
                mainStore.refreshGridData(true);

                if (!!selectDataSourceStore) {
                    selectDataSourceStore.clearByName("ProductGroup");
                }

            } else {
                UiUtils.showError(t(result.message ?? ""));
            }
        } catch (err: any) {
            console.error(err);
            UiUtils.showError('Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            UiUtils.clearBusy();
        }
    };

    return TableUtil.getColumns(
        [...ProductGroupDtColumns], {
            actions: [
                {
                    title: "",
                    content: (d: ProductGroupDto) => {
                        return d.isActived ? (
                            <div
                                style={{color: "#f5413d"}}
                                onClick={() => {
                                    handleOnClickChangeIsActiveProduct(Number(d.id), false);
                                }}
                            >
                                <StopOutlined style={{fontSize: 20}}/>{" "}
                                <span style={{marginLeft: "2px"}}>
              {t("inActive")}
            </span>
                            </div>
                        ) : (
                            <div
                                style={{color: "#1AB01A"}}
                                onClick={() => {
                                    handleOnClickChangeIsActiveProduct(Number(d.id), true);
                                }}
                            >
                                <CheckCircleOutlined style={{fontSize: 20}}/>{" "}
                                <span style={{marginLeft: "2px"}}>
              {t("active")}
            </span>
                            </div>
                        );
                    },
                    permission: "Product",
                },
                {
                    title: 'remove',
                    onClick: async (d) => {
                        mainStore.openRemoveById(d);

                        if (!!selectDataSourceStore) {
                            selectDataSourceStore.clearByName("ProductGroup");
                        }
                    },
                    permission: 'ProductGroup.Remove'
                }
            ],
            viewAction: (d) => {
                mainStore.openUpdateModal(d);
            },
            viewActionPermission: 'ProductGroup.Create',
            ns: mainStore.getNamespaceLocale()
        });
}

const ProductGroup: React.FC = () => {
    const {productGroupStore: mainStore, selectDataSourceStore} = useStore();
    const {t} = useTranslation("product-group-list");
    const columns = ProductGroupColumns(mainStore);
    const topActions: IActionBtn[] = [
        {
            title: 'addNew',
            permission: 'ProductGroup.Create',
            onClick: () => {
                mainStore.openCreateModal();
            }
        }, {
            title: 'tool',
            content: (<>
                <Dropdown menu={{
                    items: [
                        {
                            key: '-1',
                            label: (
                                <Link to={'/product-group/import-excel'}>
                                    <a>
                                        <UploadOutlined className={'me-1'}/>{t('importExcel')}
                                    </a>
                                </Link>

                            ),
                        },
                        {
                            key: '0',
                            label: (
                                <a onClick={() => {
                                    mainStore.exportExcelPagedResult().then();
                                }}>
                                    <FileExcelOutlined className={'me-1'}/>{t('exportExcel')}

                                </a>
                            ),
                        },
                    ]
                }}>
                    <Button icon={<SettingOutlined/>}>{t('toolAction')}</Button>
                </Dropdown>

            </>)
        }
    ];
    const onEntitySavedSuccess = async () => {
        selectDataSourceStore.clearByName('ProductGroup');
    }
    return (
        <>
            <OrdCrudPage stored={mainStore}
                         topActions={topActions}
                         columns={columns}
                         searchForm={(f) => <ProductGroupSearchForm/>}
                         entityForm={form => <ProductGroupCreateOrUpdateForm/>}
                         onEntitySavedSuccess={onEntitySavedSuccess}
            ></OrdCrudPage>
        </>)
        ;
}
export default (ProductGroup);

