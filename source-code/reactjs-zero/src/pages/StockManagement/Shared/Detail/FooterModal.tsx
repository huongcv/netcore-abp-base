import {observer} from "mobx-react-lite";
import {Button} from "antd";
import {ImportStockMoveDto} from "@api/index.defs";
import {CloseOutlined, EditOutlined, PrinterOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {MoveStatus, MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {StockUtil} from "@pages/StockManagement/Shared/StockUtil";

const DetailStockMoveFooterModal = (props: {
    moveDto?: ImportStockMoveDto | undefined | null;
}) => {
    const {moveDto} = props;
    const {detailStockStore, stockMoveStore} = useStore();
    const [t] = useTranslation('stock');
    const [editable, setEditable] = useState(false);
    const [printable, setPrintable] = useState(true);
    useEffect(() => {
        if (moveDto) {
            setEditable(props.moveDto?.moveStatus != 3);
            if (moveDto.moveType == MoveType.HoaDon) {
                setEditable(false);
                setPrintable(false);
            }

            if (moveDto.moveType == MoveType.PhieuDieuChuyenNhan ||
                (moveDto.moveType == MoveType.PhieuDieuChuyen && moveDto.moveStatus === MoveStatus.DA_HOAN_THANH)) {
                setEditable(false);
            }
        }
    }, [moveDto]);
    const handlerPrint = async () => {
        await StockUtil.print(moveDto!.moveHashId!, moveDto?.moveType);
    }
    return (<>
        {
            moveDto &&

            <div className="flex justify-between">

                <div className='sub-function'>
                    {
                        printable &&
                        <Button className='footer-button'
                                type='default'
                                onClick={handlerPrint}>
                            <PrinterOutlined style={{fontSize: 20}}/>
                            {t('actionStock.print')}
                        </Button>
                    }
                </div>

                <div className='main-function'>
                    <Button className='footer-button mr-1'
                            type='default'
                            icon={<CloseOutlined/>} onClick={detailStockStore.closeModal}>
                        {t('closeModal')}
                    </Button>

                    {
                        editable &&
                        <Button className='footer-button fixed-right'
                                type={'primary'}
                                icon={<EditOutlined/>}
                                onClick={() => {
                                    detailStockStore.closeModal();
                                    stockMoveStore.handlerClickActionGrid('edit', {
                                        ...props.moveDto,
                                        idHash: props.moveDto?.moveHashId
                                    } as any);
                                }}> {t('actionStock.edit')}</Button>
                    }

                </div>
            </div>


        }
    </>);
}
export default observer(DetailStockMoveFooterModal);
