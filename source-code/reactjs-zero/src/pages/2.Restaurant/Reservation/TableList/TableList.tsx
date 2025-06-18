import React, {Suspense, useEffect} from 'react';
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {useStore} from "@ord-store/index";
import {Card, FormInstance, Modal, Spin, TableColumnsType, Tag, Space} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {observer} from "mobx-react-lite";
import {AccountMoveDto, MOVE_STATUS, SaleInvoiceDto} from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import TopTableFilter, {ITopTableFilterData} from "@ord-components/table/TopTableFilter";
import Utils from "@ord-core/utils/utils";
import {
    CoffeeOutlined,
    EditOutlined,
    EyeOutlined,
    CreditCardOutlined,
    CloseSquareOutlined,
    CheckSquareOutlined,
    CheckOutlined,
    RetweetOutlined,
    DeleteOutlined
} from "@ant-design/icons";

const LazyModalCruReceipt = React.lazy(() => import('@pages/2.Restaurant/Reservation/AdvanceReservation/ModalCruReceipt'));

export const StatusAccMoveElm = (
    prop: {
        status?: MOVE_STATUS,
        txt: string
    }
) => {
    const text = prop.txt;
    switch (prop.status) {
        case 1:
            return <Tag className='me-0 ord-cell-1'>
                <span>{text}</span>
            </Tag>
        case 2:
            return <Tag className='me-0 ord-cell-2'>
                <span>{text}</span>
            </Tag>
        case 3:
            return <Tag className='me-0 ord-cell-3'>
                <span>{text}</span>
            </Tag>
        case 4:
            return <Tag className='me-0 ord-cell-4'>
                <span>{text}</span>
            </Tag>
        case 5:
            return <Tag className='me-0 ord-cell-5'>
                <span>{text}</span>
            </Tag>
        default:
            return <Tag className='me-0'>
                <span>{text}</span>
            </Tag>
    }
}



const demoData = [
    {
        tables: "B236718",
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        guestCount: 2,
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        status: "1",
        strStatus: "Đang dọn dẹp"
    },
    {
        tables: "B236718",
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        guestCount: 2,
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        status: "2",
        strStatus: "Đang sử dụng"
    },
    {
        tables: "B236718",
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        guestCount: 2,
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        status: "3",
        strStatus: "Đã đặt"
    },
    {
        tables: "B236718",
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        guestCount: 2,
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        status: "4",
        strStatus: "Còn trống"
    },
    {
        tables: "B236718",
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        guestCount: 2,
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        status: "2",
        strStatus: "Đang sử dụng"
    },
    {
        tables: "B236718",
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        guestCount: 2,
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        status: "4",
        strStatus: "Còn trống"
    },
    {
        tables: "B236718",
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        guestCount: 2,
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        status: "5",
        strStatus: "Sắp có khách"
    },
    {
        tables: "B236718",
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        guestCount: 2,
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        status: "2",
        strStatus: "Đang sử dụng"
    },
    {
        tables: "B236718",
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        guestCount: 2,
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        status: "4",
        strStatus: "Còn trống"
    },
    {
        tables: "B236718",
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        guestCount: 2,
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        status: "1",
        strStatus: "Đang dọn dẹp"
    }
];

const TableList = (props: {
    onCruSuccess: () => void;
    searchFormRef: FormInstance
}) => {
    const {tableListStore: stored} = useStore();
    const {searchFormRef} = props;

    const formatterNumber = Utils.formatterNumber;

    useEffect(() => {
        stored.status = -1
    }, [])
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'Bàn',
            dataIndex: 'tables',
            width: 120,
            render: (data: string, record: AccountMoveDto) => {
                return <>
                    {record.tables}
                </>
            },
        },
        {
            title: 'Khu vực',
            dataIndex: 'area',
            width: 120,
            render: (data: string, record: AccountMoveDto) => {
                return <>
                    {record.area}
                </>
            },
        },
        {
            title: 'Loại bàn',
            dataIndex: 'tableType',
            width: 120,
            render: (data: string, record: AccountMoveDto) => {
                return <>
                    {record.tableType}
                </>
            },
        },
        {
            title: 'Số khách tối đa',
            dataIndex: 'guestCount',
            width: 120,
            render: (data: string, record: AccountMoveDto) => {
                return <>
                    {record.guestCount}
                </>
            },
        },
        {
            width: 150,
            title: 'Số điện thoại',
            dataIndex: 'phone',
            render: (data: string, record: AccountMoveDto) => {
                return <>
                    {record.phone}
                </>
            },
        },
        {
            title: 'Thời gian đặt',
            width: 150,
            align: 'center',
            render: (_: any, record: AccountMoveDto) => {
                const dt = record.bookingDateTime;
                return (
                    <>
                        <span>{DateUtil.toFormat(dt, 'HH:mm')}</span><br/>
                        <span>{DateUtil.toFormat(dt, 'DD/MM/YYYY')}</span>
                    </>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            align: 'center',
            width: 100,
            render: (_: any, record: AccountMoveDto) => {
                // Nếu record.status là string thì parseInt, ngược lại giữ nguyên
                const statusNum = typeof record.status === 'string'
                    ? (parseInt(record.status, 10) as MOVE_STATUS)
                    : record.status;

                return (
                    <StatusAccMoveElm
                        status={statusNum}
                        txt={record.strStatus ?? ''}
                    />
                );
            },
        },
    ], {
        actions: [
            // {
            //   title: "view",
            // },
            // {
            //   title: "edit",
            // },
            {
                title: 'Thanh toán',
                content: (_: any) => (
                    <Space>
                        <CreditCardOutlined style={{fontSize: 20}} />
                        Thanh toán
                    </Space>
                ),
                hiddenIf: (d: AccountMoveDto) => {
                    return d.status == 1 || d.status == 3 || d.status == 4 || d.status == 5
                }
            },
            {
                title: 'Đặt bàn',
                content: (_: any) => (
                    <Space>
                        <CheckSquareOutlined style={{fontSize: 20}} />
                        Đặt bàn
                    </Space>
                ),
                hiddenIf: (d: AccountMoveDto) => {
                    return d.status == 1 || d.status == 2 || d.status == 3 || d.status == 5
                }
            },
            {
                title: 'Gọi món',
                content: (_: any) => (
                    <Space>
                        <CoffeeOutlined style={{fontSize: 20}}/>
                        Gọi món
                    </Space>
                ),
                hiddenIf: (d: AccountMoveDto) => {
                    return d.status == 1 || d.status == 3 || d.status == 5
                }
            },
            {
                title: 'Khách đã đến',
                content: (_: any) => (
                    <Space>
                        <CheckOutlined style={{fontSize: 20}} />
                        Khách đã đến
                    </Space>
                ),
                hiddenIf: (d: AccountMoveDto) => {
                    return d.status == 1 || d.status == 2 || d.status == 4
                }
            },
            {
                title: 'Xem',
                content: (_: any) => (
                    <Space>
                        <EyeOutlined style={{fontSize: 20}}/>
                        Xem
                    </Space>
                ),
                // onClick: (d: AccountMoveDto) => {
                //     stored.openViewDetailModal(d);
                // }
            },
            {
                title: 'Sửa',
                content: (_: any) => (
                    <Space>
                        <EditOutlined style={{fontSize: 20}}/>
                        Sửa
                    </Space>
                ),
            },
            {
                title: 'Xóa',
                content: (_: any) => (
                    <Space>
                        <DeleteOutlined style={{fontSize: 20}}/>
                        Xóa
                    </Space>
                ),
            }
        ],
        viewAction: (d)=>{
            stored.openViewDetailModal(d);
        },
        ns: stored.getNamespaceLocale()
    });


    return (
        <>
            <Card className='card-table-cashbook'>
                <AntTableWithDataPaged searchForm={searchFormRef}
                                       className={'table-padding'}
                                       title={() => {
                                           return <TopTableFilter
                                               onClickItem={(data) => {
                                                   stored.setMoveStatus(data);
                                                   stored.refreshGridData(true)
                                               }}
                                               data={stored.statusDemo?.map(x => ({
                                                   label: x.strStatus ?? "",
                                                   key: x.status,
                                                   count: x?.count
                                               }) as ITopTableFilterData)}></TopTableFilter>
                                       }}

                                       // getPageResult={(d) => {
                                       //     return stored.apiService().getPaged({
                                       //         body: {
                                       //             ...d.body,
                                       //             status: stored.status == -1 ? undefined : stored.status
                                       //         }
                                       //     }, {})
                                       // }}
                                       getPageResult={d => {
                                           const { page = 1, pageSize = 10 } = d.body as any;
                                           const start = (page - 1) * pageSize;
                                           const end = start + pageSize;
                                           const items = demoData.slice(start, end);
                                           return Promise.resolve({
                                               items,
                                               totalCount: demoData.length
                                           });
                                       }}

                                       columns={columns}
                                       searchData={stored.searchDataState}
                                       refreshDatasource={stored.refreshDataState}
                />
            </Card>

            <Suspense fallback={<Spin/>}>
                {stored.createOrUpdateModal.visible
                    //&&
                //     <LazyModalCruReceipt stored={stored}
                //                                                             onSaveSuccess={() => {
                //                                                                 stored.refreshGridData();
                //                                                                 props.onCruSuccess();
                //                                                             }}
                // ></LazyModalCruReceipt>
                }
            </Suspense>
        </>
    );
};


export default observer(TableList);
