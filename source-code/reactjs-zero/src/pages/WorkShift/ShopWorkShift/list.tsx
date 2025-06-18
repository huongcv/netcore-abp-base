import * as React from "react";
import {useRef} from "react";
import {TableColumnsType} from "antd";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import TableUtil from "@ord-core/utils/table.util";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import DateUtil from "@ord-core/utils/date.util";
import {ShopWorkShiftSearchForm} from "@pages/WorkShift/ShopWorkShift/Form/searchForm";
import {OpenOrCloseSaleWorkShiftForm} from "@pages/WorkShift/ShopWorkShift/Form/openOrCloseSaleWorkShiftForm";
import {IssuesCloseOutlined, PrinterOutlined} from "@ant-design/icons";
import {ShopWorkShiftStatusCell} from "@pages/WorkShift/ShopWorkShift/datatable/shopWorkShiftStatusCell";
import {CreateOrUpdateForm} from "./Form/createOrUpdateForm";
import {ProductDto, ShopWorkShiftDto} from "@api/index.defs";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {ShopWorkShiftService} from "@api/ShopWorkShiftService";
import UiUtils from "@ord-core/utils/ui.utils";

export const ShopWorkShiftList = () => {
    const {shopWorkShiftStore: mainStore} = useStore();
    const {t} = useTranslation('work-shift');
    const iframeRef = useRef(null);
    const printPdf = async (d: ShopWorkShiftDto) => {
        console.log(d);
        UiUtils.setBusy();
        try {
            if(d.id === undefined) return;
            const idWS = Number(d.id);
            const resultBlob = await ShopWorkShiftService.printPdfById({ findId: idWS }, { responseType: 'blob' });
            //FileSaver.saveAs(resultBlob, 'test.pdf');
            // Tạo URL từ blob dữ liệu PDF
            if (!!iframeRef) {
                // Gán URL PDF vào iframe để hiển thị
                // @ts-ignore
                iframeRef.current.src = URL.createObjectURL(resultBlob);
                // Tự động bật cửa sổ in
                setTimeout(() => {
                    // @ts-ignore
                    iframeRef.current.contentWindow.focus(); // Focus vào iframe
                    // @ts-ignore
                    iframeRef.current.contentWindow.print(); // Tự động mở chế độ in
                }, 500); // Đợi file load xong, sau đó in
            }
            
        } catch (error) {
            console.error('API call failed:', error);
        } finally {
            UiUtils.clearBusy();
        }
    };
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            dataIndex: 'name',
            width: '120px',
            title: 'ten',
        },
        {
            dataIndex: 'openingEmployeeName',
            title: 'employeeName',
            width: '200px',
        },
        {
            dataIndex: 'fromDate',
            title: 'Thời gian',
            width: '280px',
            align: "center",
            render: (text, dto) => {
                return (<>{DateUtil.toFormat(dto.startDate)} - {DateUtil.toFormat(dto.endDate || undefined)}</>)
            }
        },
        {
            dataIndex: 'openingCash',
            title: 'openingCash',
            align: 'right',
            render: v => (<PriceCell value={v}/>),
            width: '150px',
        },
        {
            dataIndex: 'expectedCash',
            title: 'expectedCash',
            align: 'right',
            width: '150px',
            render: v => (<PriceCell value={v}/>),
        },
        {
            dataIndex: 'closingCash',
            title: 'closingCash',
            align: 'right',
            render: v => (<PriceCell value={v}/>),
            width: '150px',
        },
        {
            dataIndex: 'differenceCash',
            title: 'differenceCash',
            align: 'right',
            render: v => (<PriceCell value={v}/>),
            width: '150px',
        },
        {
            dataIndex: 'status',
            title: 'status',
            align: 'center',
            fixed: 'right',
            render: v => (<ShopWorkShiftStatusCell status={v}/>),
            width: 130,
        }
    ], {
        actions: [
            {
                title: 'view',
                hiddenIf: (d:any)=> {
                    return d?.status === 2
                },
                icon: (<IssuesCloseOutlined />),
                onClick: (d) => {
                    openClosingForm(d);
                }
            },
            // {
            //     title: 'view',
            //     onClick: (d) => {
            //         mainStore.openViewDetailModal(d);
            //     }
            // },
            // {
            //     title: 'edit',
            //     hiddenIf: (d:any)=> {
            //         return d?.status === 2
            //     },
            //     onClick: (d:ShopWorkShiftDto) => {
            //         console.log("d", d)
            //         mainStore.openUpdateModal({
            //             ...d,
            //             // startDate: DateUtil.toFormat(d.startDate),
            //         });
            //     }
            // },
            {
                title: 'print',
                icon: (<PrinterOutlined />),
                onClick: (d) => {
                    printPdf(d);
                }
            },
            {
                title: 'remove',
                onClick: (d) => {
                    const removeByHash = {
                        ...d,
                        id: d.idHash
                    };
                    mainStore.openRemoveById(removeByHash);
                }
            }
        ] as ITableAction<ProductDto>[],
        ns: mainStore.getNamespaceLocale()
    });

    const topActions: IActionBtn[] = [
        {
            title: 'addNew',
            // permission: 'WorkShift.ShopWorkShift.CreateOrUpdate',

            onClick: () => {
                mainStore.checkAndOpenModal();
            }
        }
    ];

    const closingFormRef = useRef();
    const openClosingForm = (d: any) => {
        // @ts-ignore
        closingFormRef.current.showModal(d)
    }

    return (
        <>
            <OrdCrudPage stored={mainStore}
                         topActions={topActions}
                         columns={columns}
                         searchForm={(f) => <ShopWorkShiftSearchForm/>}
                         entityForm={form => <CreateOrUpdateForm form={form}/>}
            ></OrdCrudPage>
            <OpenOrCloseSaleWorkShiftForm ref={closingFormRef} />
            <iframe hidden
                ref={iframeRef}
                width="100%"
                height="600px"
                title="PDF Viewer"
                style={{border: 'none'}}
        />
        </>
    )
}
