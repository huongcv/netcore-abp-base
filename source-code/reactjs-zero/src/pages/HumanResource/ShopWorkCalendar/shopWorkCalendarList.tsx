import * as React from "react";
import { lazy, Suspense, useRef } from "react";
import { Col, Form, FormInstance, Spin, TableColumnsType } from "antd";
import { useTranslation } from "react-i18next";
import { useStore } from "@ord-store/index";
import TableUtil from "@ord-core/utils/table.util";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import { observer } from "mobx-react-lite";
import { PartnerDto, ShopWorkCalendarDto } from "@api/index.defs";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { runInAction } from "mobx";
import { TFunction } from "i18next";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import { IsActiveStatusCounter } from "@ord-components/crud/counter-list/IsActiveStatusCounter";
import { ShopWorkCalendarService } from "@api/ShopWorkCalendarService";
import uiUtils from "@ord-core/utils/ui.utils";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
const ShopWorkCalendarList = () => {
    const { shopWorkCalendarStore: mainStore } = useStore();
    const { t } = useTranslation('shop-work-calendar');
    const { t: tEnum } = useTranslation('enum');
    const iframeRef = useRef(null);

    const handleChangeIsActive = async (
        id: number,
        isActived: boolean
    ) => {
        try {
            uiUtils.setBusy();
            if (id == 0 || isActived == null || isActived == undefined) return;
            const update = await ShopWorkCalendarService.changeWorkCalendarStatus({
                calendarId: id,
                isActived: isActived,
            });
            if (update.isSuccessful) {
                uiUtils.showSuccess(t(`updateIsActiveSuccessfully`));
                mainStore.refreshGridData(true);
            } else {
                uiUtils.showError(update.message || t(`updateIsActiveFaild`));
            }
        } catch (err: any) {
            uiUtils.showError(t(`updateIsActiveFaildErr500`) + err?.Message);
        } finally {
            uiUtils.clearBusy();
        }
    };

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            dataIndex: 'code',
            width: '120px',
            title: 'code',

        },
        {
            dataIndex: 'name',
            title: 'name',
            width: '200px',
        },
        {
            dataIndex: 'listDayOfWeek',
            title: 'listDayOfWeek',
            width: '280px',
            render: (value) => {
                return displayDayOfWeek(value, tEnum)
            }
        },
        {
            dataIndex: 'notes',
            title: 'notes',
            width: '150px',
        },
        IsActivedColumn()
    ], {
        actions: [
            {
                title: "",
                content: (d: ShopWorkCalendarDto) => {
                    return d.isActived ? (
                        <div
                            onClick={() => {
                                handleChangeIsActive(Number(d.id), false);
                            }}
                        >
                            <StopOutlined />{" "}
                            <span className="ml-1">{t("changeIsActive.unActive")}</span>
                        </div>
                    ) : (
                        <div
                            onClick={() => {
                                handleChangeIsActive(Number(d.id), true);
                            }}
                        >
                            <CheckCircleOutlined />{" "}
                            <span className="ml-1">{t("changeIsActive.active")}</span>
                        </div>
                    );
                },
            },
            {
                title: 'remove',
                permission: PERMISSION_APP.human.workCalendar + '.Remove',
                onClick: async (d) => {
                    runInAction(() => {
                        mainStore.openRemoveById(d);
                    })

                }
            }
        ],
        viewAction: (d) => {
            runInAction(() => {
                mainStore.setIsShowUpdateModal(d);
            })
        },
        viewActionPermission: PERMISSION_APP.human.workCalendar + '.Update',
        ns: mainStore.getNamespaceLocale()
    }
    );






    const topActions: IActionBtn[] = [
        {
            title: 'addNew',
            // permission: 'WorkShift.ShopWorkShift.CreateOrUpdate',
            permission: PERMISSION_APP.human.workCalendar + '.Create',
            onClick: async () => {
                runInAction(() => {
                    mainStore.setIsShowCreateModal(true);
                })
            }
        }
    ];

    const closingFormRef = useRef();
    const LazyModalCreateShopWorkCalendar =
        lazy(() => import('@pages/HumanResource/ShopWorkCalendar/form/createShopWorkCalendarForm'));
    const LazyModalShopWorkCalendarDetailIndex =
        lazy(() => import('@pages/HumanResource/ShopWorkCalendar/ShopWorkCalendarDetail/index'));


    useHotkeys('F2', (event) => {
        if (mainStore.isShowDetailModal && mainStore.itemSelected) {
            runInAction(() => {
                mainStore.setIsShowCreateModal(true);
            })
            event.preventDefault();
        }
    }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true });


    return (
        <>

            <OrdCrudPage stored={mainStore}
                contentTopTable={
                    <IsActiveStatusCounter getCountApi={ShopWorkCalendarService.getCount} />
                }
                topActions={topActions}
                columns={columns}
                searchForm={(f) => <SearchFilterText span={8} />}
            ></OrdCrudPage>
            <Suspense fallback={<Spin />}>
                {(mainStore.isShowCreateModal) &&
                    <LazyModalCreateShopWorkCalendar></LazyModalCreateShopWorkCalendar>
                }
            </Suspense>
            <Suspense fallback={<Spin />}>
                {mainStore.isShowDetailModal && mainStore.itemSelected &&
                    <LazyModalShopWorkCalendarDetailIndex></LazyModalShopWorkCalendarDetailIndex>
                }
            </Suspense>

        </>
    )
}
export default observer(ShopWorkCalendarList);
export const displayDayOfWeek = (data: string, tEnum: TFunction<"enum", undefined>) => {
    let ret = data
    ret = ret.replace("0", " " + tEnum('dayOfWeek.SUNDAY'))
    ret = ret.replace("1", " " + tEnum('dayOfWeek.MONDAY'))
    ret = ret.replace("2", " " + tEnum('dayOfWeek.TUESDAY'))
    ret = ret.replace("3", " " + tEnum('dayOfWeek.WEDNESDAY'))
    ret = ret.replace("4", " " + tEnum('dayOfWeek.THURSDAY'))
    ret = ret.replace("5", " " + tEnum('dayOfWeek.FRIDAY'))
    ret = ret.replace("6", " " + tEnum('dayOfWeek.SATURDAY'))
    return <span>{ret}</span>
}