import {
    CheckCircleOutlined,
    CheckOutlined,
    ClockCircleOutlined, ExclamationCircleFilled, ExclamationCircleOutlined,
    FileExcelOutlined,
    MoneyCollectOutlined,
    StopOutlined
} from "@ant-design/icons";
import { EmployeePayrollService } from "@api/EmployeePayrollService";
import { EmployeePayrollDto } from "@api/index.defs";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import TableUtil from "@ord-core/utils/table.util";
import UiUtils from "@ord-core/utils/ui.utils";
import utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
import { PayrollSearch } from "@pages/HumanResource/Payroll/payrollSearch";
import { Modal, Spin, TableColumnsType, Tag } from "antd";
import FileSaver from "file-saver";
import { isNumber } from "lodash";
import { observer } from "mobx-react-lite";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PayEmployeePayrollModal from "./PayEmployeePayrollModal";

const Payroll = () => {
    const { payrollStore: stored, sessionStore } = useStore();
    const [t] = useTranslation(stored.getNamespaceLocale());
    const navigate = useNavigate();
    const currentDate = new Date();
    const formattedDate = currentDate.getDate().toString().padStart(2, '0') + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getFullYear();
    const appendDateToFileName = (fileName: string, formattedDate: string): string => {
        if (fileName.endsWith('.xlsx')) {
            const fileNameWithoutExtension = fileName.replace('.xlsx', '');
            return `${fileNameWithoutExtension}_${formattedDate}.xlsx`;
        } else {
            return fileName;
        }
    }
    const formatterNumber = utils.formatterNumber;

    const exportExcel = async (payrollId: string) => {
        UiUtils.setBusy();
        try {
            const body = { payrollId: payrollId };
            const resultBlob = await EmployeePayrollService.exportPayrollResult(body, { responseType: 'blob' });
            if (resultBlob) {
                const fileName = t('payrollExportName');
                const fileNameFormatted = appendDateToFileName(fileName, formattedDate);
                FileSaver.saveAs(resultBlob, fileNameFormatted);
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
            title: t('name.payroll'),
            width: 400,
        },
        {
            dataIndex: 'totalSalaryAmount',
            title: t('totalSalaryAmount'),
            width: 180,
            align: 'right', 
            render: (v) => isNumber(v) ? formatterNumber(v) : ''
        },
        {
            dataIndex: 'totalSocialInsuranceAmount',
            title: t('totalSocialInsuranceAmount'),
            width: 180,
            align: 'right', 
            render: (v) => isNumber(v) ? formatterNumber(v) : ''
        },
        {
            dataIndex: 'totalHealthInsuranceAmount',
            title: t('totalHealthInsuranceAmount'),
            width: 180,
            align: 'right', 
            render: (v) => isNumber(v) ? formatterNumber(v) : ''
        },
        {
            dataIndex: 'totalUnemploymentInsuranceAmount',
            title: t('totalUnemploymentInsuranceAmount'),
            width: 180,
            align: 'right', 
            render: (v) => isNumber(v) ? formatterNumber(v) : ''
        },
        {
            title: t('status.payroll'),
            dataIndex: 'status',
            align: 'center',
            width: 150,
            render: (data: number, record: EmployeePayrollDto) => {
                return <>
                    {data == 1 && <Tag icon={<ExclamationCircleOutlined />} color="warning">
                        {t('payroll.Not_Updated')}
                    </Tag>}
                    {data == 2 && <Tag icon={<ClockCircleOutlined />} color="processing">
                        {t('payroll.Pending_Approval')}
                    </Tag>}
                    {data == 3 && <Tag icon={<CheckCircleOutlined />} color="success">
                        {t('payroll.Approved')}
                    </Tag>}
                    {data == 4 && <Tag icon={<StopOutlined />} color="default">
                        {t('payroll.cancel')}
                    </Tag>}
                </>
            },
        }
    ], {
        actions: [
            // {
            //     title: 'view',
            //     onClick: (d) => {
            //         // @ts-ignore
            //         navigate('/app/shop/human-resource/payroll/detail/' + d.idHash);
            //     }
            // },
            {
                title: t('approval.payroll'),
                icon: <CheckOutlined />,
                permission: PERMISSION_APP.human.employeePayroll + '.Create',
                onClick: (record: EmployeePayrollDto) => {
                    const { confirm } = Modal;
                    const showConfirm = () => {
                        // @ts-ignore
                        confirm({
                            title: t('confirm.lockPayroll'),
                            icon: <ExclamationCircleFilled />,
                            content: t('confirm.lockPayrollMess', {
                                Name: `[${record.name}]`
                            }),
                            onOk() {
                                // @ts-ignore
                                EmployeePayrollService.lockPayroll({
                                    idHash: record.idHash
                                }).then(res => {
                                    if (res.isSuccessful) {
                                        UiUtils.showSuccess(t('lockPayrollSuccess'));
                                        stored.refreshGridData().then();
                                    }
                                })
                            }
                        });
                    };
                    showConfirm();
                },
                hiddenIf: (d: EmployeePayrollDto) => {
                    return d.status == 3 || d.status == 4
                }
            },
             {
                title: t('pay'),
                icon: <MoneyCollectOutlined />,
                permission: PERMISSION_APP.human.employeePayroll + '.Create',
                onClick: (record: EmployeePayrollDto) => {
                    stored.openEmployeePayrollModal(record);
                },
                hiddenIf: (d: EmployeePayrollDto) => {
                    return d.status != 3 
                }
            },
            {
                title: t('export.excel.payroll'),
                icon: <FileExcelOutlined />,
                permission: PERMISSION_APP.human.employeePayroll + '.Create',
                onClick: (d: EmployeePayrollDto) => {
                    // @ts-ignore
                    exportExcel(d?.idHash);
                }
            },
            {
                title: t('cancel.payroll'),
                icon: <StopOutlined />,
                permission: PERMISSION_APP.human.employeePayroll + '.Create',
                onClick: (d) => {
                    const { confirm } = Modal;
                    const showConfirm = () => {
                        // @ts-ignore
                        confirm({
                            title: t('confirm.cancelPayroll'),
                            icon: <ExclamationCircleFilled />,
                            content: t('confirm.cancelPayrollMess', {
                                Name: `[${d.name}]`
                            }),
                            onOk() {
                                EmployeePayrollService.cancelPayroll({
                                    idHash: d.idHash
                                }).then(res => {
                                    if (res.isSuccessful) {
                                        UiUtils.showSuccess(t('cancelPayrollSuccess'));
                                        stored.refreshGridData().then();
                                    }
                                })
                            }
                        });
                    };
                    showConfirm();
                },
                hiddenIf: (d: EmployeePayrollDto) => {
                    return d.status == 1 || d.status == 4
                }
            },
            {
                title: 'remove',
                permission: PERMISSION_APP.human.employeePayroll + '.Remove',
                onClick: (d) => {
                    // @ts-ignore
                    const removeByHash = {
                        ...d,
                        id: d.idHash
                    };
                    stored.openRemoveById(removeByHash);
                },
                hiddenIf: (d: EmployeePayrollDto) => {
                    return d.status == 3
                }
            }
        ],
        viewAction: (d) => {
            // @ts-ignore
            console.log(d,'daet')
            navigate('/app/shop/human-resource/payroll/detail/' + d.idHash);
        },
        ns: stored.getNamespaceLocale()
    });

    const topActions: IActionBtn[] = [
        {
            title: "exportExcel",
            // permission: 'MasterData.Package',
            onClick: () => {
                stored.exportExcelPagedResult().then();
            },
        },
        {
            title: 'addNew',
            permission: PERMISSION_APP.human.employeePayroll + '.Create',
            onClick: () => {
                stored.openCreateModal();
            }
        }
    ];

    const PayrollCreateOrUpdateForm =
        lazy(() => import('@pages/HumanResource/Payroll/modalCruPayroll'));


    return (
        <>
            <OrdCrudPage stored={stored}
                topActions={topActions}
                columns={columns}
                searchForm={(f) => <PayrollSearch defaultYear={new Date().getFullYear()} />}
            // entityForm={form => <PayrollCreateOrUpdateForm />}
            ></OrdCrudPage>
            <Suspense fallback={<Spin />}>
                {(stored.createOrUpdateModal.visible) &&
                    <PayrollCreateOrUpdateForm></PayrollCreateOrUpdateForm>
                }
            </Suspense>
            {stored.isOpenEmployeePayrollModal && <PayEmployeePayrollModal />}
        </>
    )
};
export default observer(Payroll);
