import React from "react";
import { useStore } from "@ord-store/index";
import { Form, Row, TableColumnsType, Tag } from "antd";
import TableUtil from "@ord-core/utils/table.util";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { EmployeeTimesheetDto, EmployeeTimesheetGetPagedInputDto, TIMESHEET_STATUS } from "@api/index.defs";
import { Trans, useTranslation } from "react-i18next";
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, StopOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import { debounce } from "lodash";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdMonthInput from "@ord-components/forms/OrdMonthInput";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import UiUtils from "@ord-core/utils/ui.utils";
import { EmployeeTimesheetService } from "@api/EmployeeTimesheetService";
import OrdYearInput from "@ord-components/forms/OrdYearInput";
import { TimeSheetStatusSegmented } from "./timeSheetStatusSegmented";
import TimesheetCrudModal from "./TimesheetCrudModal";
import { useNavigate } from "react-router-dom";

function Timesheet() {
    const { timesheetStore: stored, sessionStore } = useStore();
    const [t] = useTranslation(stored.getNamespaceLocale());
    const [enumTranslation] = useTranslation('enum');
    const [commonTranslation] = useTranslation(['common']);
    const [searchFormRef] = Form.useForm();
    const navigate = useNavigate();

    const handleApprove = (d: EmployeeTimesheetDto) => {
        UiUtils.setBusy();
        if (d.id)
            EmployeeTimesheetService.approveTimeSheet({ employeeTimeSheetId: Number(d.id) }).then(res => {
                if (res.isSuccessful) {
                    UiUtils.showSuccess(t('approveSuccess'));
                    stored.refreshGridData().then();
                } else {
                    UiUtils.showError(res.message);
                }
                UiUtils.clearBusy();
            })
    }

    const handleCancel = (d: EmployeeTimesheetDto) => {
        UiUtils.setBusy();
        if (d.id)
            EmployeeTimesheetService.cancelTimeSheet({ employeeTimeSheetId: Number(d.id) }).then(res => {
                if (res.isSuccessful) {
                    UiUtils.showSuccess(t('cancelTimeSheetSuc'));
                    stored.refreshGridData().then();
                } else {
                    UiUtils.showError(res.message);
                }
                UiUtils.clearBusy();
            })
    }

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            dataIndex: 'name',
            title: t('timesheetName'),
            width: 500,
        },
        {
            title: t('timesheet.status'),
            dataIndex: 'status',
            align: 'center',
            width: 120,
            render: (data: TIMESHEET_STATUS, record: EmployeeTimesheetDto) => {
                return <>
                    {data == 1 && <Tag color="default">
                        {t('timesheet.Not_Updated')}
                    </Tag>}
                    {data == 2 && <Tag color="warning">
                        {t('timesheet.Pending_Approval')}
                    </Tag>}
                    {data == 3 && <Tag color="success">
                        {t('timesheet.Approved')}
                    </Tag>}
                    {data == 4 && <Tag color="red">
                        {t('timesheet.Cancel')}
                    </Tag>}
                </>
            },
        }
    ], {
        actions: [
            {
                title: t('timesheet.Approve'),
                icon: <CheckCircleOutlined style={{ color: 'green' }} />,
                permission: PERMISSION_APP.human.timesheet + '.Create',
                hiddenIf: (d: EmployeeTimesheetDto) => {
                    return d.status == 3 || d.status == 4
                },
                onClick: (d) => {
                    UiUtils.showConfirm({
                        title: t('titleAction.approve'),
                        content: (
                            <div>
                                {t('showApproveContent')}:
                                <strong className="mr-4">{d?.name} ?</strong>
                            </div>
                        ),
                        isDanger: true,
                        onOk: () => {
                            handleApprove(d);
                        },
                    });

                }
            },
            {
                title: '',
                content: (d: any) => {
                    return (
                        <div
                            onClick={() => {
                                UiUtils.showConfirm({
                                    title: t('titleAction.cancel'),
                                    content: (
                                        <div>
                                            {t('showCancelContent')}:
                                            <strong className="mr-4">{d?.name} ?</strong>
                                        </div>
                                    ),
                                    isDanger: true,
                                    onOk: () => {
                                        handleCancel(d);
                                    },
                                });
                            }}
                        >
                            <StopOutlined style={{ fontSize: 18, color: "red" }} />{" "}
                            <span className="ml-1" style={{ color: "red" }}>{commonTranslation("actionBtn.cancel")}</span>
                        </div>
                    );
                },
                permission: PERMISSION_APP.human.timesheet + '.Create',
                hiddenIf: (d: EmployeeTimesheetDto) => {
                    return d.status != 3
                },

            },
            {
                title: 'remove',
                permission: PERMISSION_APP.human.timesheet + '.Create',
                hiddenIf: (d: EmployeeTimesheetDto) => {
                    return d.status == 3
                },
                onClick: (dataItem: EmployeeTimesheetDto) => {

                    UiUtils.showConfirm({
                        title: commonTranslation('confirmDelete'),
                        icon: "remove",
                        content: (<Trans ns={stored.getNamespaceLocale()}
                            i18nKey="confirmDelete"
                            values={dataItem}
                            components={{ italic: <i />, bold: <strong /> }}></Trans>),
                        onOk: (d) => {
                            stored.openRemoveById(dataItem);
                            stored.removeEntity().then();
                        }
                    });

                }
            },
        ],
        viewAction: (d) => {
            navigate(`/app/shop/human-resource/timesheet/${d.idHash}`);

            // if (d.status == 3 || d.status == 4) {
            //     stored.openViewDetailModal(d);

            // } else {
            //     stored.openUpdateModal(d);
            // }
        },
        ns: stored.getNamespaceLocale()
    });
    const topAction: IActionBtn[] = [
        {
            title: 'addNew',
            permission: PERMISSION_APP.human.timesheet + '.Create',
            onClick: () => {
                stored.openCreateModal();
            }
        }
    ];
    const onResetClick = () => {
        searchFormRef.resetFields();
        stored.searchData({})
    };

    return (
        <>
            <PageTopTitleAndAction>
                <TopAction topActions={topAction} />
            </PageTopTitleAndAction>
            <Form form={searchFormRef} className={'crud-search-box'}
                layout='vertical'
                onFinish={debounce((d) => {
                    stored.searchData(d)
                }, 250)}>

                <div className={'ord-container-box'}>
                    <Row gutter={[16, 8]}>
                        <ColSpanResponsive span={4}>
                            <FloatLabel label={enumTranslation('TimeUnit.Year')}>
                                <Form.Item name='timeSheetYear' initialValue={(new Date().getFullYear())}>
                                    <OrdYearInput />
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>
                        <SearchFilterText span={16} onReset={onResetClick} />
                    </Row>
                    <div hidden>
                        <Form.Item name={'onSearchBeginning'} initialValue={0} noStyle />
                    </div>
                </div>



                <div className={'ord-container-box ord-crud-list'}>
                    <TimeSheetStatusSegmented ns={stored.getNamespaceLocale()} form={searchFormRef}
                        getCountApi={EmployeeTimesheetService.getCount} />
                    <AntTableWithDataPaged searchForm={searchFormRef}
                        getPageResult={(d) => {
                            return stored.apiService().getPaged({
                                body: {
                                    ...d.body
                                }
                            }, {})
                        }}
                        columns={columns}
                        searchData={stored.searchDataState}
                        refreshDatasource={stored.refreshDataState}
                    />
                </div>
            </Form>
            {stored.createOrUpdateModal.visible && <TimesheetCrudModal />}

        </>
    )
}


export default observer(Timesheet);
