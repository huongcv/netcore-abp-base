import { memo, Suspense, useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import { Button, Space, Table, TableColumnsType, Tag, Tooltip } from "antd";
import { useStore } from "@ord-store/index";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import StockDisplayEllipsisTextLong from "@ord-components/displays/StockDisplayEllipsisTextLong";
import DateUtil from "@ord-core/utils/date.util";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { SumIcon } from "@ord-components/icon/SumIcon";
import { TaxCodeNotUse } from "@ord-core/AppConst";
import { Delete2Icon } from "@ord-components/icon/DeleteIcon";
import { EditOutlined } from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import { ProductDto } from "@api/index.defs";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import { useUpsertStockMove } from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import ProductDetailModal from './ProductDetailModal';
import "../Form/CrudSaleOrderForm.scss";

const ImportProductItemTable = () => {
    const { saleOrderStore: mainStore } = useStore();
    const { productItems } = mainStore;
    const { t } = useTranslation('stock');
    const { formMoveTicket, formProductItems } = useUpsertStockMove();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    const columns: TableColumnsType<any> = [
        {
            title: "#",
            dataIndex: "stt",
            align: 'center',
            width: 60,
            render: (value, dto, index) => {
                const stt = (pagination.current - 1) * pagination.pageSize + index + 1;
                return stt;
            }
        },
        {
            title: t("productName"),
            dataIndex: "productName",
            width: 220,
            render: (value, dto) =>
                <>
                    <TextLineClampDisplay rows={1} className='!text-[#505050] !font-medium !text-base'
                        content={dto.productName!} />
                    {
                        dto.isProductUseLotNumber && !dto.lotNumber &&
                        <div onClick={() => edit(dto)}
                            className='italic underline !font-normal cursor-pointer text-rose-400'>
                            Vui lòng chọn lô
                        </div>
                    }
                    {
                        !!dto.lotNumber &&
                        <Space.Compact className='mt-2 inline-flex items-center'>
                            <Tag color="#87d068">
                                <StockDisplayEllipsisTextLong text={dto.lotNumber}
                                    className='text-base inline-flex' maxWidth={120} />
                            </Tag>
                            <Tag className='h-fit'>{DateUtil.showWithFormat(dto.expiryDate)} </Tag>
                        </Space.Compact>
                    }
                </>
        },
        {
            title: t("qty"),
            dataIndex: "qty",
            align: 'center',
            width: 110
        },
        {
            title: t("unit"),
            dataIndex: "basicUnitName",
            width: 100
        },
        {
            title: "Giá bán",
            dataIndex: "price",
            align: 'right',
            width: 150,
            render: (value, dto) => <>
                <PriceCell value={dto.price} />

                {dto.totalAmountBeforeDiscount > 0 && (
                    <div>
                        <SumIcon className={"me-1"} />
                        <PriceCell value={dto.totalAmountBeforeDiscount} />
                    </div>
                )}
            </>
        },
        {
            title: t("discount"),
            dataIndex: "discountAmount",
            align: 'right',
            width: 150,
            render: (value, dto) => <>
                <div>
                    {dto.discountPercent || 0}%
                </div>
                <div>
                    <PriceCell value={dto.discountAmount || 0} /> VNĐ
                </div>
            </>
        },
        {
            title: t("totalAmountDetail"),
            dataIndex: "totalAmountAfterDiscount",
            align: 'right',
            width: 150,
            render: (value, dto) => <>
                <PriceCell fixed={2} value={dto.totalAmountAfterDiscount} />
                <br />
                <Tooltip title={dto.subTaxAmount ? <>
                    {dto.subTaxAmount > 0 && (
                        <div className='text-white'>
                            Tiền thuế: <PriceCell value={dto.subTaxAmount} /> VNĐ
                        </div>
                    )}
                </> : null}>
                    {dto.taxCode === TaxCodeNotUse ? 'Không thuế' : 'Thuế: ' + dto.taxCode}
                </Tooltip>
            </>
        },
        {
            title: "",
            dataIndex: "action",
            width: 40,
            align: 'center',
            render: (value, dto) => <div className='flex items-center justify-end'>
                <Button shape='circle' onClick={() => edit(dto)}>
                    <EditOutlined style={{ fontSize: 20 }} />
                </Button>
                <Button className='ml-2' shape='circle' onClick={() => remove(dto)}>
                    <Delete2Icon style={{ fontSize: 20 }} />
                </Button>
            </div>
        }
    ]

    const remove = (dto: any) => {
        UiUtils.showConfirm({
            title: "Xoá sản phẩm: " + dto.productName,
            icon: "remove",
            content: (
                <>
                    {`Bạn có chắc chắn muốn xoá sản phẩm: ${dto.productName} không?`}
                </>
            ),
            onOk: (d) => {
                const index = productItems.findIndex(x => x.productId === dto.productId);

                if (index != -1) {
                    mainStore.productItems.splice(index, 1);
                    mainStore.productItems = [...mainStore.productItems];
                }

                calculatorForm();
            },
            okLabel: 'Xác nhận'
        });
    }

    //Tính lại toàn bộ giá trị
    const calculatorForm = () => {
        const moveValueForm = formMoveTicket.getFieldsValue();
        console.log(moveValueForm)
        const {
            products,
            move
        } = UpsertFormUtil.calculatorAllProduct(mainStore.productItems, moveValueForm);
        mainStore.productItems = [...products];
        formMoveTicket.setFieldsValue({
            ...moveValueForm,
            ...move
        });
    };

    const edit = (dto: any) => {
        mainStore.productDetail = _.cloneDeep(dto);
    }

    useEffect(() => {
        return () => {
            mainStore.productItems = [];
        }
    }, []);

    return (
        <>
            <Table pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                onChange: (page, pageSize) => {
                    setPagination({ current: page, pageSize });
                }
            }} rowKey="uuid"
                dataSource={productItems} columns={columns} />

            <Suspense fallback={<> </>}>
                <ProductDetailModal />
            </Suspense>
        </>
    );
};

export default memo(observer(ImportProductItemTable));