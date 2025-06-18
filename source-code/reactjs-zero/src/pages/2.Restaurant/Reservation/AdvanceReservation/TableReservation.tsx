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
import {CoffeeOutlined, EditOutlined, EyeOutlined, CreditCardOutlined, CloseSquareOutlined, CheckSquareOutlined, CheckOutlined, RetweetOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom';
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
            return <Tag className='me-0 ord-cell-waiting'>
                <span>{text}</span>
            </Tag>
        case 2:
            return <Tag className='me-0 ord-cell-confirmed'>
                <span>{text}</span>
            </Tag>
        case 3:
            return <Tag className='me-0 ord-cell-cancel'>
                <span>{text}</span>
            </Tag>
        case 4:
            return <Tag className='me-0 ord-cell-arrived'>
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
        customerCode: "KH123456",
        customerName: "Chị Minh",
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        scheduledDateTime: "2025-04-17T15:00:00",
        guestCount: 2,
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        tables: "B01; B02",
        status: "1",
        strStatus: "Chờ xác nhận"
    },
    {
        customerCode: "Khách lẻ",
        customerName: "Chị Minh",
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        scheduledDateTime: "2025-04-17T15:00:00",
        guestCount: 2,
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        tables: "B01; B02",
        status: "2",
        strStatus: "Đã xác nhận"
    },
    {
        customerCode: "Khách lẻ",
        customerName: "Chị Minh",
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        scheduledDateTime: "2025-04-17T15:00:00",
        guestCount: 2,
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        tables: "B01; B02",
        status: "3",
        strStatus: "Đã hủy"
    },
    {
        customerCode: "Khách lẻ",
        customerName: "Chị Minh",
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        scheduledDateTime: "2025-04-17T15:00:00",
        guestCount: 2,
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        tables: "B01; B02",
        status: "4",
        strStatus: "Đã đến"
    },
    {
        customerCode: "Khách lẻ",
        customerName: "Chị Minh",
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        scheduledDateTime: "2025-04-17T15:00:00",
        guestCount: 2,
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        tables: "B01; B02",
        status: "2",
        strStatus: "Đã xác nhận"
    },
    {
        customerCode: "Khách lẻ",
        customerName: "Chị Minh",
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        scheduledDateTime: "2025-04-17T15:00:00",
        guestCount: 2,
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        tables: "B01; B02",
        status: "4",
        strStatus: "Đã đến"
    },
    {
        customerCode: "Khách lẻ",
        customerName: "Chị Minh",
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        scheduledDateTime: "2025-04-17T15:00:00",
        guestCount: 2,
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        tables: "B01; B02",
        status: "2",
        strStatus: "Đã xác nhận"
    },
    {
        customerCode: "Khách lẻ",
        customerName: "Chị Minh",
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        scheduledDateTime: "2025-04-17T15:00:00",
        guestCount: 2,
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        tables: "B01; B02",
        status: "4",
        strStatus: "Đã đến"
    },
    {
        customerCode: "Khách lẻ",
        customerName: "Chị Minh",
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        scheduledDateTime: "2025-04-17T15:00:00",
        guestCount: 2,
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        tables: "B01; B02",
        status: "2",
        strStatus: "Đã xác nhận"
    },
    {
        customerCode: "Khách lẻ",
        customerName: "Chị Minh",
        phone: "0654341624",
        bookingDateTime: "2025-04-16T10:00:00",
        scheduledDateTime: "2025-04-17T15:00:00",
        guestCount: 2,
        area: "Ngoài trời",
        tableType: "Bàn đơn",
        tables: "B01; B02",
        status: "4",
        strStatus: "Đã đến"
    }
];

const TableReservation = (props: {
    onCruSuccess: () => void;
    searchFormRef: FormInstance
}) => {
    const {reservation: stored} = useStore();
    const {searchFormRef} = props;

    const formatterNumber = Utils.formatterNumber;

    useEffect(() => {
        stored.status = -1
    }, [])
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'Khách hàng',
            dataIndex: 'customerCode',
            width: 150,
            render: (data: string, record: AccountMoveDto) => {
                return <>
                    <a className="font-semibold underline"
                       //onClick={() => stored.openViewDetailModal(record)}
                    >{data}</a><br/>
                    {record.customerName}
                </>
            },
            sorter: false
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
            title: 'Ngày đặt',
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
            title: 'Thời gian',
            width: 150,
            align: 'center',
            render: (_: any, record: AccountMoveDto) => {
                const dt = record.scheduledDateTime;
                return (
                    <>
                        <span>{DateUtil.toFormat(dt, 'HH:mm')}</span><br/>
                        <span>{DateUtil.toFormat(dt, 'DD/MM/YYYY')}</span>
                    </>
                );
            },
        },
        {
            title: 'Số khách',
            dataIndex: 'guestCount',
            width: 120,
            render: (data: string, record: AccountMoveDto) => {
                return <>
                    {record.guestCount}
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
                title: 'Xem thông tin đặt bàn',
                content: (_: any) => (
                    <Space>
                        <EyeOutlined style={{fontSize: 20}}/>
                        Xem thông tin đặt bàn
                    </Space>
                ),
                // onClick: (d: AccountMoveDto) => {
                //     stored.openViewDetailModal(d);
                // }
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
                    return d.status == 1 || d.status == 3 || d.status == 4
                }
            },
            {
                title: 'Sửa thông tin đặt bàn',
                content: (_: any) => (
                    <Link to="/restaurant/edit-table">
                        <Space>
                            <EditOutlined style={{fontSize: 20}}/>
                            Sửa thông tin đặt bàn
                        </Space>
                    </Link>
                ),
                hiddenIf: (d: AccountMoveDto) => {
                    return d.status == 3 || d.status == 4
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
                    return d.status == 1 || d.status == 3
                }
            },
            {
                title: 'Hủy đặt bàn',
                content: (_: any) => (
                    <Space>
                        <CloseSquareOutlined style={{fontSize: 20}} />
                        Hủy đặt bàn
                    </Space>
                ),
                hiddenIf: (d: AccountMoveDto) => {
                    return d.status == 3 || d.status == 4
                }
            },
            {
                title: 'Xác nhận đặt bàn',
                content: (_: any) => (
                    <Space>
                        <CheckSquareOutlined style={{fontSize: 20}} />
                        Xác nhận đặt bàn
                    </Space>
                ),
                hiddenIf: (d: AccountMoveDto) => {
                    return d.status == 2 || d.status == 3 || d.status == 4
                }
            },
            {
                title: 'Thanh toán',
                content: (_: any) => (
                    <Space>
                        <CreditCardOutlined style={{fontSize: 20}} />
                        Thanh toán
                    </Space>
                ),
                hiddenIf: (d: AccountMoveDto) => {
                    return d.status == 1 || d.status == 2 || d.status == 3
                }
            },
            {
                title: 'Đặt lại',
                content: (_: any) => (
                    <Space>
                        <RetweetOutlined style={{fontSize: 20}} />
                        Đặt lại
                    </Space>
                ),
                hiddenIf: (d: AccountMoveDto) => {
                    return d.status == 1 || d.status == 2 || d.status == 4
                }
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


export default observer(TableReservation);
