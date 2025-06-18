import {ImportExcelImportSuplierExcelBaseDto, MOVE_TYPE} from "@api/index.defs";
import {Badge, Modal, Table, Tabs} from "antd";
import React, {useEffect} from "react";
import {ColumnType} from "antd/es/table/interface";
import {useTranslation} from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import {PriceCell} from "@ord-components/table/cells/priceCell";

const ErrorCell = (props: {
    dto: ImportExcelImportSuplierExcelBaseDto
}) => {
    return (<ul className={'ms-[15px] list-disc'}>
        {
            !!props.dto &&
            props.dto.errors?.map((it, idx) => (<li key={idx} className={'text-red'}>
                {it}
            </li>))
        }
    </ul>);
}
export const InvalidModalImportStock = (props: {
    invalidList: ImportExcelImportSuplierExcelBaseDto[],
    validList: ImportExcelImportSuplierExcelBaseDto[],
    onAddListValid?: () => void,
    moveType?: MOVE_TYPE,
    isModalOpen: boolean,
    setIsModalOpen: (isOpen: boolean) => void,
}) => {
    const {invalidList, validList, isModalOpen, setIsModalOpen} = props;
    const {t} = useTranslation('stock-excel');

    useEffect(() => {
        if (invalidList && invalidList.length > 0) {
            setIsModalOpen(true);
        }
    }, [invalidList]);

    const columns: ColumnType<ImportExcelImportSuplierExcelBaseDto>[] = [
        {
            key: 'detailError',
            title: t('detailError'),
            width: 200,
            render: (_, dto) => {
                return <ErrorCell dto={dto}/>;
            }
        },
        {
            title: t('productCode'),
            dataIndex: 'productCode',
            width: 120
        },
        {
            title: t('lotNumber'),
            dataIndex: 'lotNumber',
            width: 120
        },
        {
            title: t('expiryDate'),
            dataIndex: 'expiryDateStr',
            align: 'center',
            width: 120
        },
        {
            title: t('qty'),
            dataIndex: 'qtyStr',
            align: 'right',
            width: 100,
            render: (v, dto) => <>
                {
                    dto.qty ? <PriceCell value={dto.qty}/> : v
                }
            </>
        },
        {
            title: t('unitName.import'),
            dataIndex: 'unitName',
            width: 130,
        },
        {
            title: t('price.import'),
            dataIndex: 'priceStr',
            align: 'right',
            width: 150,
            render: (v, dto) => <>
                {
                    dto.price ? <PriceCell value={dto.price}/> : v
                }
            </>
        },
        {
            title: t('discountPercent'),
            dataIndex: 'discountPercentStr',
            align: 'right',
            width: 150,
        },
        {
            title: t('discountAmount'),
            dataIndex: 'discountAmountStr',
            align: 'right',
            width: 150,
            render: (v, dto) => <>
                {
                    dto.discountAmount ? <PriceCell value={dto.discountAmount}/> : v
                }
            </>
        },
    ];
    return (<>
        <Modal title={t('listData')} className={'ord-modal-tab'}
               width={'90%'}
               open={isModalOpen} onOk={() => setIsModalOpen(false)}
               onCancel={() => setIsModalOpen(false)}
               footer={<>
                   <ModalCloseBtn onClick={() => setIsModalOpen(false)}/>
               </>}
        >
            <Tabs items={[{
                key: '1',
                label: <>
                    {t('listValid')} <Badge showZero
                                            overflowCount={999999} color={'green'} count={validList?.length || 0}/>
                </>,
                children: <>
                    <Table
                        columns={TableUtil.translateTitleColumns(columns.filter(s => {
                            return s.key !== 'detailError';
                        }), 'product')}
                        pagination={false}
                        dataSource={props.validList.map((row, index) => ({
                            key: index,
                            ...row
                        }))}
                    />
                </>
            }, {
                key: '2',
                label: <>
                    {t('listInvalid')} <Badge showZero
                                              overflowCount={999999} color={'red'} count={invalidList?.length || 0}/>
                </>,
                children: <>
                    <Table bordered={true}
                           scroll={{y: '500px'}}
                           columns={TableUtil.translateTitleColumns(columns, 'product')}
                           dataSource={invalidList.map((row, index) => (
                               {
                                   key: index,
                                   ...row
                               }))}
                    />
                </>
            }]}>
            </Tabs>
        </Modal>
    </>);
}
