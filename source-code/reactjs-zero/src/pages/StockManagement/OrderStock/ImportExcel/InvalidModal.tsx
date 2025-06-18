import {ExcelProductStockMoveDto, ValidateProductExcelItemDto} from "@api/index.defs";
import {Badge, Button, Modal, Table, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import {ColumnType} from "antd/es/table/interface";
import {useTranslation} from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";

const ErrorCell = (props: {
    product: ValidateProductExcelItemDto
}) => {
    const {t} = useTranslation('stock-excel');
    const {listErrorValidData} = props.product;
    return (<ul className={'ms-[15px] list-disc'}>
        {
            !!listErrorValidData &&
            listErrorValidData.map((it, idx) => (<li key={idx} className={'text-red'}>
                {t('invalidErr.' + it.error as any, it.data) as any}
            </li>))
        }
    </ul>);
}
export const InvalidModal = (props: {
    invalidList: ExcelProductStockMoveDto[],
    validList: ExcelProductStockMoveDto[],
    onAddListValid?: () => void,

}) => {
    const {invalidList: datasource} = props;
    const {t} = useTranslation('stock-excel');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        if (props.invalidList && props.invalidList.length > 0) {
            showModal();
        }
    }, [props.invalidList]);
    const columns: ColumnType<ExcelProductStockMoveDto>[] = [
        {
            title: '',
            dataIndex: ('rowId'),
            width: 90,
            render: (_) => {
                return t('rowIndex', {ns: 'stock-excel'}) + ' ' + _;
            }
        },
        {
            key: 'detailError',
            title: t('detailError'),
            render: (_, dto) => {
                return <ErrorCell product={dto}/>;
            }
        },

        {
            title: t('code'),
            dataIndex: ('productCode'),
            width: 150
        },
        {
            title: t('name'),
            dataIndex: 'productName',
            width: 300
        },
        {
            title: t('lotNumber'),
            dataIndex: 'lotNumber',
            width: 300
        },
    ];
    return (<>
        <Modal title={t('listData')} className={'ord-modal-tab'}
               width={1300}
               open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
               footer={<>
                   {
                       props.validList && props.validList.length > 0 &&
                       <Button type={'primary'} onClick={() => {
                           if (props.onAddListValid) {
                               props.onAddListValid();
                           }
                           handleCancel();
                       }}>{t('continueAddValidList', {count: props.validList.length})}</Button>
                   }
                   <ModalCloseBtn onClick={handleCancel}/>

               </>}
        >
            <Tabs items={[{
                key: '1',
                label: <>
                    {t('listValid')} <Badge color={'green'} count={props.validList?.length || 0}/>
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
                    {t('listInvalid')} <Badge color={'red'} count={props.invalidList?.length || 0}/>
                </>,
                children: <>
                    <Table
                        columns={TableUtil.translateTitleColumns(columns, 'product')}
                        pagination={false}
                        dataSource={props.invalidList.map((row, index) => ({
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
