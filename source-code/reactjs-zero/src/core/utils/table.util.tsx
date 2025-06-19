import {Button, Dropdown, Space, TableColumnsType} from "antd";
import TableActionCell, {
    ITableAction,
} from "@ord-components/table/cells/TableActionCell";
import {l} from "@ord-core/language/lang.utils";
import React from "react";
import {ColumnType} from "antd/es/table/interface";
import {ColumnGroupType} from "antd/lib/table";
import {AnyObject} from "yup";
import {DashOutlined, EyeOutlined} from "@ant-design/icons";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import BtnTableActionCell from "@ord-components/table/cells/BtnTableActionCell";

interface ColumnConfig<T> {
    ns?: string;
    widthRowIndexCol?: number;
    widthActionCol?: number;
    actions?: ITableAction<T>[];
    viewAction?: (record: T) => void;
    viewActionPermission?: string
}

class TableUtil {
    getColumns<T>(
        columnBase: TableColumnsType,
        config?: ColumnConfig<T>,
        ignoreRowIndex = false
    ) {
        const ns = config?.ns || "field";
        let propColumns: ColumnType<any>[] = [
            {
                key: "rowIndex",
                title: l.transCommon("sttRow"),
                render: (_, record: any, idx) => <div>{record?.ordRowIndex ?? (idx + 1)}</div>,
                width: config?.widthRowIndexCol || 60,
                align: "center",
            },
            ...columnBase.map((it) => {
                let title = it.title;
                if (typeof title === "string") {
                    title = l.trans(ns + "." + title);
                }
                return {
                    ...it,
                    title,
                };
            }),
        ];
        if (ignoreRowIndex) {
            propColumns = propColumns.filter((x) => {
                if (ignoreRowIndex) {
                    return x.key != "rowIndex";
                }
                return true;
            });
        }
        if (config?.actions && config?.actions?.length > 0) {
            propColumns.push({
                title: <span>{l.transCommon("action")}</span>,
                render: (_, record) => {
                    return (
                        <Space wrap>
                            <BtnTableActionCell
                                record={record}
                                callBackSuccess={config.viewAction}
                                ns={ns}
                                permission={config.viewActionPermission}
                            ></BtnTableActionCell>
                            {/*{config?.viewAction && (*/}
                            {/*  <Button*/}

                            {/*    title={l.transCommon("actionBtn.view")}*/}
                            {/*    icon={<EyeOutlined  />}*/}
                            {/*    onClick={() => {*/}
                            {/*      if (config?.viewAction) config?.viewAction(record);*/}
                            {/*    }}*/}
                            {/*  />*/}
                            {/*)}*/}
                            <TableActionCell
                                actions={config.actions || []}
                                ns={ns}
                                record={record}
                            />
                        </Space>
                    );
                },
                width: config?.widthActionCol || (config?.viewAction ? 120 : 86),
                fixed: "right",
                align: "center",
            });
        }
        return propColumns;
    }

    translateTitleColumns(columns: ColumnType[], ns: string) {
        ns = ns || "common";
        return columns.map((it) => {
            let title = it.title;
            if (typeof title === "string") {
                title = l.trans(ns + "." + title);
            }
            return {
                ...it,
                title,
            };
        });
    }
}

export default new TableUtil();
