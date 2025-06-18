import {ImportStockMoveDetailDto, ImportStockMoveDto} from "@api/index.defs";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export const ReturnQtyCell = (props: {
    moveDto: ImportStockMoveDto | null,
    item: ImportStockMoveDetailDto,
}) => {
    const [t] = useTranslation('stock');
    const {moveDto, item} = props;
    const [show, setShow] = useState(false);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [items, setItems] = useState<ReturnMoveStockDto[]>([]);

    useEffect(() => {
        setShow(!!item.returnQty && item.returnQty > 0);
    }, [moveDto?.totalReturnQty]);

    // const viewReturnMoveList = async () => {
    //     UiUtils.setBusy();
    //     try {
    //         const ret = await StockMoveHelperService.getReturnMove({
    //             body: {
    //                 relatedMoveLineDetailId: item.moveLineDetailId
    //             }
    //         });
    //         // @ts-ignore
    //         setItems(ret || []);
    //         showModal();
    //     } catch {
    //
    //     } finally {
    //         UiUtils.clearBusy();
    //
    //     }
    // }
    // const showModal = () => {
    //     setIsModalOpen(true);
    // };
    //
    // const handleCancel = () => {
    //     setIsModalOpen(false);
    // };
    // const columns: TableProps<ReturnMoveStockDto>['columns'] = [
    //     {
    //         title: t('moveCode'),
    //         dataIndex: 'moveCode',
    //         key: 'moveCode'
    //     },
    //     {
    //         title: t('moveDate'),
    //         dataIndex: 'moveDate',
    //         render: (_) => {
    //             return DateUtil.showWithFormat(_);
    //         }
    //     },
    //     {
    //         title: t('qty'),
    //         dataIndex: 'qty',
    //         render: (_) => {
    //             return (
    //                 <PriceCell value={_}></PriceCell>
    //             )
    //         }
    //     },
    // ];
    return (<div>
        {
            show &&
            <>
                {/*<a className={'me-2'} onClick={viewReturnMoveList}>*/}
                {/*    <EyeOutlined/>*/}
                {/*</a>*/}
                <span className={'text-red'} style={{
                    textDecoration: 'line-through'
                }}>
                {
                    item.returnQty

                }
        </span>
                <span className='italic ms-1'>{item.unitName}</span>
            </>
        }

        {/*<Modal title={t('listMoveReturn')}*/}
        {/*       open={isModalOpen}*/}
        {/*       footer={null}*/}
        {/*       onCancel={handleCancel}>*/}
        {/*    {*/}
        {/*        items &&*/}
        {/*        <Table className={'pb-5'} pagination={{*/}
        {/*            position: ['none']*/}
        {/*        }}*/}
        {/*               bordered*/}
        {/*               columns={columns} dataSource={items}/>*/}
        {/*    }*/}

        {/*</Modal>*/}
    </div>)
}
