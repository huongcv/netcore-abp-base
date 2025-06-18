import React, {useState} from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {Button, Form, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {ProductSearch} from "@pages/ProductManagement/Product/datatable/ProductSearch";
import {ProductDto, ProductUnitDto} from "@api/index.defs";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {BarcodeOutlined, CheckCircleOutlined, StopOutlined,} from "@ant-design/icons";
import ProductStockDetail from "@pages/ProductManagement/Product/stock-detail";
import ProductToolAction from "@pages/ProductManagement/Product/Tools/Index";
import UiUtils from "@ord-core/utils/ui.utils";
import {ProductService} from "@api/ProductService";
import ProductGroupBtn from "@pages/ProductManagement/Product/ProductGroupBtn";
import ProductUpsertForm from "@pages/ProductManagement/Product/forms/ProductUpsertForm";
import {useTranslation} from "react-i18next";
import {ProductInventoryStockQtyCell} from "@pages/ProductManagement/Product/datatable/ProductInventoryStockQtyCell";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {ImgFromFileId} from "@ord-components/common/img/ImgFromFileId";
import PrintBarcodeProductModal from "@pages/ProductManagement/Product/Tools/PrintBarcodeProductModal";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import {ProductStatusCounter} from "@pages/ProductManagement/Product/datatable/ProductStatusCounter";
import {ProductStatusColumn} from "@pages/ProductManagement/Product/datatable/ProductStatusColumn";
import {TemplateProductService} from "@api/TemplateProductService";
import {observer} from "mobx-react-lite";

export const MAX_VALUE_PRICE = 9_999_999_999.99999;

const Product: React.FC = () => {
    const {
        productStore: mainStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());

    const gridActions: ITableAction<ProductDto>[] = [
        {
            title: "",
            content: (d: ProductDto) => {
                return d.isActived ? (
                    <div
                        style={{color: "#f5413d"}}
                        onClick={() => {
                            handleOnClickChangeIsActiveProduct(Number(d.id), false).then();
                        }}
                    >
                        <StopOutlined style={{fontSize: 20}}/>{" "}
                        <span style={{marginLeft: "2px"}}>
              {t("changeIsActive.unActive")}
            </span>
                    </div>
                ) : (
                    <div
                        style={{color: "#1AB01A"}}
                        onClick={() => {
                            handleOnClickChangeIsActiveProduct(Number(d.id), true).then();
                        }}
                    >
                        <CheckCircleOutlined style={{fontSize: 20}}/>{" "}
                        <span style={{marginLeft: "2px"}}>
              {t("changeIsActive.active")}
            </span>
                    </div>
                );
            },
            permission: "Product",
            hiddenIf: (d) => {
                return d.isTemplateProduct === true;
            },
        },
        {
            title: "remove",
            onClick: (d) => {
                mainStore.openRemoveById(d);
            },
            permission: "Product.Remove",
            hiddenIf: (d) => {
                return d.isEditable === false || d.isTemplateProduct === true;
            },
        },
    ];

    const handleButtonClick = (record: ProductDto) => {
        if (record.isTemplateProduct) {
            openForCopyTemplate(record).then();
        } else {
            openEdit(record).then();
        }
    };

    const openForCopyTemplate = async (record: ProductDto) => {
        UiUtils.setBusy();
        try {
            const response = await TemplateProductService.getTemplateForCreate({
                idHash: record.idHash,
            });

            if(!response.isSuccessful) {
                UiUtils.showError(t('errorMessage'))
                console.error(response);
            }

            const {productDto, listProductUnit} = response.data!;
            const unitItems: ProductUnitDto[] = listProductUnit?.filter(x => !x.isBasicUnit)
                .map(x => ({
                    ...x,
                    productUnitId: x.id
                })) || [];

            const editData = {
                ...productDto,
                unitItems: unitItems,
            };
            mainStore.openCopyModal(editData);
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    };
    const isProductTemplate = Form.useWatch('type', mainStore.searchFormRef) == -1;

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                dataIndex: 'imageUrl',
                title: '',
                width: 50,
                align: 'center',
                render: (v) => {
                    return <ImgFromFileId
                        style={{width: '32px', height: '32px', borderRadius: '6px'}}
                        preview={false} fileId={v}></ImgFromFileId>
                }
            },
            {
                dataIndex: 'productCode',
                title: 'code',
                width: 120,
                render: (_, record) => {
                    return (<>
                        <a className="font-semibold underline"
                           onClick={() => handleButtonClick(record)}>{_}</a>
                    </>)
                }
            },
            {
                title: 'name',
                dataIndex: 'productName',
                width: 300,
                render: (t: string) => {
                    return <TextLineClampDisplay content={t}></TextLineClampDisplay>
                }
            },
            {
                dataIndex: 'qtyInventory',
                title: 'qtyInventory',
                width: 100,
                align: 'end',
                hidden: isProductTemplate,
                render: (text, dto) => <ProductInventoryStockQtyCell product={dto}/>
            },
            {
                dataIndex: 'basicUnitName',
                title: 'basicUnitNameShort',
                width: 120,
            },
            {
                dataIndex: 'productPrice',
                title: 'ProductPrice',
                align: 'end',
                render: (v, dto) => (<>
                    <PriceCell value={v}/>
                </>),
                width: 110,
            },
            {
                ...ProductStatusColumn(),
                width: 110,
                sorter: false,
                align: 'center'

            }],
        {
            actions: gridActions,
            ns: mainStore.getNamespaceLocale(),
            viewAction: (record) => {
                handleButtonClick(record);
            },
            widthRowIndexCol: 50,
        }
    );

    const topActions: IActionBtn[] = [
        {
            title: "productGroup",
            permission: "Product.Create",
            content: <ProductGroupBtn/>,
        },
        {
            title: "printBarCode",
            icon: <BarcodeOutlined className={"me-1"}/>,
            content: <Button icon={<BarcodeOutlined/>} onClick={() => {
                setIsPrintBarcodeModalOpen(true)
            }}>
                {t("printBarCode")}
            </Button>
        },
        {
            title: "tool",
            permission: "Product.Create",
            content: <ProductToolAction/>,
        },
        {
            title: "addNew",
            permission: "Product.Create",
            onClick: () => {
                mainStore.openCreateModal();
            },
        },
    ];

    const [isPrintBarcodeModalOpen, setIsPrintBarcodeModalOpen] = useState(false);

    const handleOnClickChangeIsActiveProduct = async (
        id: number,
        isActived: boolean
    ) => {
        try {
            UiUtils.setBusy();
            const response = await ProductService.updateChangeIsActive({
                id,
                isActived,
            });

            if (response.isSuccessful) {
                UiUtils.showSuccess(t(`updateIsActiveSuccessfully`));
                mainStore.refreshGridData(true);
            } else {
                UiUtils.showError(response.message);
            }
        } catch (err: any) {
            UiUtils.showError(err?.Message);
        } finally {
            UiUtils.clearBusy();
        }
    };

    const openEdit = async (record: ProductDto) => {
        UiUtils.setBusy();
        try {
            const detailDto = await ProductService.getDetail({
                idHash: record.idHash,
            });
            const {productDto, listProductUnit} = detailDto;
            const unitOthers: any[] = listProductUnit?.filter(x => x.isBasicUnit != true)?.map(x => ({
                ...x,
                productUnitId: x.id,
            })) || [];

            const editData = {
                ...productDto,
                unitItems: unitOthers,
            };

            mainStore.openUpdateModal(editData);
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    };

    return (
        <div>
            <OrdCrudPage
                stored={mainStore}
                topActions={topActions}
                columns={columns}
                searchForm={(f) => <ProductSearch />}
                entityForm={(form) => <ProductUpsertForm />}
                contentTopTable={
                    <ProductStatusCounter/>
                }
            ></OrdCrudPage>
            <ProductStockDetail/>
            <PrintBarcodeProductModal
                isModalOpen={isPrintBarcodeModalOpen}
                onCloseModal={() => {
                    setIsPrintBarcodeModalOpen(false);
                }}
            />
        </div>
    );
};
export default observer(Product);
