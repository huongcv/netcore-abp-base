import { NationalPharmacyIntegrationDto } from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import { Tag } from "antd";
import { ColumnType } from "antd/es/table";
import { useTranslation } from "react-i18next";

export const IntegrateDrugNationalColumns: ColumnType<NationalPharmacyIntegrationDto>[] = [
    {
        title: "productCode",
        dataIndex: "code",
        width: 130,
        key: "code",
        render: (v: string, dto: NationalPharmacyIntegrationDto) => {
            return <>
                <p>{v}</p>
                {dto.nationalDrugCode && <b>{dto.nationalDrugCode}</b>}
                {dto.nationalPharmacyDate && <b><i>{DateUtil.toFormat(dto.nationalPharmacyDate, 'DD/MM/YYYY HH:mm')}</i></b>}
            </>
        }
    },
    {
        title: "productName",
        dataIndex: "name",
        width: 130,
        key: "name",
    },
    {
        title: "unitName",
        dataIndex: "unitName",
        width: 130,
        key: "unitName",
    },
];

export const IntegrateTicketNationalColumns: ColumnType<NationalPharmacyIntegrationDto>[] = [
    {
        title: "moveType",
        dataIndex: "nationalPharmacyType",
        width: 130,
        key: "nationalPharmacyType",
        render: (v: number) => {
            return <>
                <MoveTypeCell type={v.toString()} />
            </>
        }
    },
    {
        title: "moveCode",
        dataIndex: "code",
        width: 130,
        key: "code",
        render: (v: string, dto: NationalPharmacyIntegrationDto) => {
            return <>
                <p>{v}</p>
                {dto.nationalDrugCode && <b>{dto.nationalDrugCode}</b>}
                {dto.nationalPharmacyDate && <b><i>{DateUtil.toFormat(dto.nationalPharmacyDate, 'DD/MM/YYYY HH:mm')}</i></b>}
            </>
        }
    },
    {
        title: "partnerName",
        dataIndex: "name",
        width: 130,
        key: "name",
    },
    {
        title: 'moveDate',
        dataIndex: 'moveDate',
        width: 130,
        render: (_, record: NationalPharmacyIntegrationDto) => {
            return <>
                {record.moveDate ? DateUtil.toFormat(record.moveDate, 'DD/MM/YYYY HH:mm') : ""}
            </>;
        },
    },
    {
        title: 'moveStatus',
        dataIndex: 'status',
        align: 'center',
        width: 130,
        render: (v) => {
            return <MoveStatusCell status={v} />
        }
    }
];

const MoveStatusCell = (props: {
    status: string;
}) => {
    const [t] = useTranslation("integration");
    return (
        <>
            <Tag className={"me-0 move-status-label-" + props.status}>
                {t("move_status." + props.status)}
            </Tag>
        </>
    );
};

const MoveTypeCell = (props: {
    type: string;
}) => {
    const [t] = useTranslation("integration");
    return (
        <>
            {t("move_type." + props.type)}
        </>
    );
};