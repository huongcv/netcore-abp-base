import React, {useEffect, useState} from 'react';
import {ExportStockMoveDetailDto, ExportStockTicketDto} from "@api/index.defs";
import {Alert, Button, Col, Modal, Row, Table, TableProps} from "antd";
import {useTranslation} from "react-i18next";
import {CloseOutlined, EditOutlined, PrinterOutlined} from "@ant-design/icons";
import {StockUtil} from "@pages/StockManagement/Shared/StockUtil";
import {MoveStatus} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {StockMoveDetail_ProductColumn} from "@pages/StockManagement/Shared/Detail/ProductLists/Columns/ProductColumn";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {RowIdxColumn} from "@ord-components/table/cells/RowIdxColumn";
import DateUtil from "@ord-core/utils/date.util";
import {MoveStatusCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveStatusCell";
import TextArea from "antd/lib/input/TextArea";

const ExportCancelDetail = (props: {
    record: ExportStockTicketDto,
    handleOk: (record: ExportStockTicketDto) => void,
}) => {
    const {record, handleOk} = props;
    const [t] = useTranslation("exportStock");
    const [editable, setEditable] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
    }

    const handlerPrint = async () => {
        await StockUtil.print(record!.moveDto!.moveHashId!, record?.moveDto!.moveType);
    }

    useEffect(() => {
        setIsOpen(!!record);
        setEditable(record?.moveDto?.moveStatus != MoveStatus.DA_HUY);
    }, [record]);

    const columns: TableProps<ExportStockMoveDetailDto>['columns'] = [
        RowIdxColumn,
        {
            title: t('productCode'),
            render: (_, dto) => {
                return <span>{dto.productDetail?.productCode}</span>;
            },
            width: 80,
        },
        {
            title: t('product'),
            render: (_, dto) => {
                if (!dto?.productDetail) {
                    return null;
                }
                return <StockMoveDetail_ProductColumn dto={dto}/>;
            },
            width: 250,
        },
        {
            title: t('qty'),
            render: (_, dto) => {
                return (
                    <>
                        {
                            dto?.qty &&
                            <>
                                <PriceCell value={dto.qty}/>
                            </>
                        }

                    </>
                )
            },
            align: 'end',
            width: 100
        },
        {
            title: t('unitNameShort'),
            dataIndex: 'unitName',
            width: 80
        },
        {
            title: t('price'),
            dataIndex: 'price',
            render: (_, dto) => {
                return (
                    <>
                        {
                            dto?.price &&
                            <>
                                <PriceCell value={dto.price}/>
                            </>
                        }

                    </>
                )
            },
            align: 'end',
            width: 120
        },
        {
            title: t('totalAmount'),
            render: (_, dto) => {
                return (
                    <>
                        {
                            dto.totalAmountAfterDiscount && <PriceCell fixed={2} value={dto.totalAmountAfterDiscount}/>
                        }
                    </>
                )
            },
            align: 'end',
            width: 100
        }
    ];

    return (
        <Modal title={t('title.detail')}
               width={'90vw'}
               style={{top: 5}}
               open={isOpen}
               onCancel={closeModal}
               footer={
                   <div className="flex justify-between">
                       <Button onClick={handlerPrint}>
                           <PrinterOutlined style={{fontSize: 20}}/>
                           {t('actionStock.print')}
                       </Button>
                       <div>
                           <Button className='footer-button mr-1'
                                   type='default'
                                   icon={<CloseOutlined/>} onClick={closeModal}>
                               {t('closeModal')}
                           </Button>

                           {
                               editable &&
                               <Button className='footer-button fixed-right'
                                       type={'primary'}
                                       icon={<EditOutlined/>}
                                       onClick={() => {
                                           closeModal();
                                           handleOk(record);
                                       }}> {t('actionStock.edit')}</Button>
                           }
                       </div>
                   </div>
               }
        >
            <Row gutter={32}>
                <Col flex="1 1 200px">
                    <Table key={'id'} columns={columns} dataSource={record?.items || []}
                           pagination={{position: ['none']}}/>
                </Col>
                <Col flex="0 1 360px" className='relative'>
                    <h3 className="text-primary text-xl font-bold">{t("moveInformation")}</h3>
                    <table className='w-full'>
                        <tbody>
                        <tr>
                            <td className='py-2'>{t("moveDate")}</td>
                            <td className="text-right py-2 font-medium">
                                {DateUtil.showWithFormat(record?.moveDto?.moveDate, "dd/MM/yyyy HH:mm")}
                            </td>
                        </tr>
                        <tr>
                            <td className='py-2'>{t("moveCode")}</td>
                            <td className="text-right py-2 font-medium">{record?.moveDto?.moveCode}</td>
                        </tr>
                        <tr>
                            <td className='py-2'>{t("status")}</td>
                            <td className="text-right py-2 font-medium">
                                <MoveStatusCell record={record?.moveDto as any}/>
                            </td>
                        </tr>
                        {record?.moveDto?.moveStatus == MoveStatus.DA_HUY && (
                            <tr>
                                <td colSpan={2} className='py-2'>
                                    <Alert
                                        message={record?.moveDto?.cancelReason}
                                        type="warning"
                                    />
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan={2} className='py-2'>
                                <div>{t("notes")}</div>
                                <TextArea value={record?.moveDto?.note} autoSize={{minRows: 2, maxRows: 6}}
                                          disabled/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Col>
            </Row>
        </Modal>
    );
};

export default ExportCancelDetail;