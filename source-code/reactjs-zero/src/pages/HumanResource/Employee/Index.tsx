import { EmployeeService } from "@api/EmployeeService";
import { EmployeeDto } from "@api/index.defs";
import { IsActiveStatusCounter } from "@ord-components/crud/counter-list/IsActiveStatusCounter";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import TableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import { Form, TableColumnsType } from "antd";
import { lazy } from "react";
import { EmployeeCreateOrUpdateForm } from "./ModalCruEmployee";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectGolfEmpTypeEnum } from "@ord-components/forms/select/selectDataSource/golf/useSelectGolfEmpType";
import { useTranslation } from "react-i18next";
import PartnerGroupBtn from "@pages/Partner/Shared/PartnerGroup/PartnerGroupBtn";

const Employee = () => {

    
    const { employeeStore: mainStore, sessionStore,employeeGroupStore } = useStore();
    const { t } = useTranslation('employee');
    const golfEmployeeType = useSelectGolfEmpTypeEnum();

    const isGolfShop = sessionStore.isGolfShop;

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            dataIndex: 'code',
            title: 'code',
            width: 60
        },
        {
            dataIndex: "strCategoryId",
            title: t("employeeType"),
            width: 150,
            hidden: !isGolfShop,
            render: (value) => {
                return <>{t(value)}</>
            }
        },
        {
            title: 'fullUserName',
            dataIndex: 'fullUserName',
            width: 200
        },
        {
            dataIndex: 'userName',
            title: 'userName',
            width: 120
        },
        {
            dataIndex: 'email',
            title: 'email',
            width: 120
        },
        {
            dataIndex: 'phoneNumber',
            title: 'phoneNumber',
            width: 100
        },
        IsActivedColumn()
    ], {
        actions: [
            {
                title: 'loginWithAccount',
                permission: PERMISSION_APP.human.employee,
                contentLazy: lazy(() => import("./LoginEmployeeAccount")),
                hiddenIf: (u: EmployeeDto) => {
                    return u?.userId == sessionStore.userId;
                }
            },
            {
                title: 'remove',
                permission: PERMISSION_APP.human.employee + '.Remove',
                hiddenIf: (u: EmployeeDto) => {
                    return u?.userId == sessionStore.userId;
                },
                onClick: (d) => {
                    mainStore.openRemoveById(d);
                }
            }
        ],
        viewAction: (d) => {
            mainStore.openViewModal(d, true);
        },
        ns: mainStore.getNamespaceLocale()
    });
    const topActions: IActionBtn[] = [
        {
              title: t("actionBtn.CustomerGroup"),
              permission: PERMISSION_APP.customer.customerGroup,
              content: <PartnerGroupBtn partnerType={4} store={employeeGroupStore}/>,
            },
        {
            title: 'addNew',
            permission: PERMISSION_APP.human.employee + '.Create',
            onClick: () => {
                mainStore.openCreateModal();
            }
        }
    ];

    return (
        <>
            <OrdCrudPage stored={mainStore}
                contentTopTable={
                    <IsActiveStatusCounter getCountApi={EmployeeService.getCount} />
                }
                topActions={topActions}
                columns={columns}
                searchForm={(f) => 
                    <>
                        { isGolfShop &&
                            <ColSpanResponsive span={8}>
                                <FloatLabel label={t("employeeType")}>
                                    <Form.Item name="categoryId">
                                        <OrdSelect datasource={golfEmployeeType} />
                                    </Form.Item>
                                </FloatLabel>
                            </ColSpanResponsive>
                        }
                        <SearchFilterText span={isGolfShop ? 16 : 10} />
                    </>
                }
                entityForm={form => <EmployeeCreateOrUpdateForm />}
            ></OrdCrudPage>
        </>
    )
};
export default Employee;
