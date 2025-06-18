import { DownloadOutlined, SaveOutlined } from "@ant-design/icons";
import { CustomerGroupService } from "@api/CustomerGroupService";
import { DoctorGroupService } from "@api/DoctorGroupService";
import {
    ImportExcelPartnerGroupInputDto,
    TplFileInfo
} from "@api/index.defs";
import { SupplierGroupService } from "@api/SupplierGroupService";
import { UploadFileService } from "@api/UploadFileService";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import GroupButtonFileExcel from "@ord-components/excel/GroupButtonFileExcel";
import UiUtils from "@ord-core/utils/ui.utils";
import { usePartnerUtils } from "@pages/Partner/Shared/partner.utils";
import { Button, Table } from "antd";
import type { ColumnType } from "antd/es/table";
import FileSaver from "file-saver";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const KEY_TRANSLATE: Record<number, string> = {
    1: "customer-group",
    2: "supplier-group",
    6: 'doctor-group'
};

const ErrorCell = ({ partner }: { partner: ImportExcelPartnerGroupInputDto }) => {
    const { t } = useTranslation(KEY_TRANSLATE[Number(partner.groupType)] || "customer-group");
    return (
        <ul className="ms-[15px] list-disc">
            {partner.listErrorValidData?.map((error, idx) => (
                <li key={idx} className="text-red-500">
                    {t(error.error ?? "") as any}
                </li>
            ))}
        </ul>
    );
};

interface TableDataPartnerGroupProps {
    datasource: ImportExcelPartnerGroupInputDto[];
    isValid: boolean;
    setMessage?: (message: string) => void;
    fileInfo?: TplFileInfo;
    setTabBarExtra?: (element: ReactNode) => void;
    type: number;
}

export const TableDataPartnerGroup = ({
    datasource,
    isValid,
    setMessage,
    fileInfo,
    setTabBarExtra,
    type,
}: TableDataPartnerGroupProps) => {
    const { t } = useTranslation(KEY_TRANSLATE[Number(type)] || "customer-group");
    const { t: tEnum } = useTranslation("enum");
    const { t: tExcel } = useTranslation("excel");
    const { t: tCommon } = useTranslation("common");

    const [saving, setSaving] = useState(false);
    const [hiddenButton, setHiddenButton] = useState(false);
    const [isReValid, setIsReValid] = useState<boolean>(isValid);
    const [dataExcel, setDataExcel] = useState(datasource);
    const { clearGroupDataSource } = usePartnerUtils();

    const PartnerGroupService = useMemo(() => {
        const map: Record<number, any> = {
            1: CustomerGroupService,
            2: SupplierGroupService,
            6: DoctorGroupService,
        };
        return map[type] ?? CustomerGroupService;
    }, [type]);

    const baseColumns: ColumnType<ImportExcelPartnerGroupInputDto>[] = [
        {
            title: t("detailError"),
            width: 300,
            hidden: isReValid,
            render: (_, dto) => <ErrorCell partner={dto} />,
        },
        { title: t("GroupCode"), dataIndex: "groupCode", key: "code", width: 150 },
        { title: t("GroupName"), dataIndex: "groupName", key: "name", width: 150 },
        {
            title: t("notes"),
            dataIndex: "notes",
            key: "notes",
            width: 200,
            render: (text) => <TextLineClampDisplay content={text} />,
        },
    ];

    useEffect(() => {
        setDataExcel(datasource);
        setTabBarExtra?.(null);
        setHiddenButton(false);
        setSaving(false);
    }, [datasource, isReValid]);

    const handleSave = async () => {
        setSaving(true);
        UiUtils.setBusy();
        try {
            const result = await PartnerGroupService.import({ body: datasource });
            if (result.isSuccessful) {
                setDataExcel([...(result.data?.successImportList || []), ...(result.data?.errorImportList || [])]);
                setTabBarExtra?.(
                    <GroupButtonFileExcel
                        fileValid={result.data?.successFile as any}
                        fileInValid={result.data?.errorFile as any}
                        countValid={result.data?.successImportList?.length || 0}
                        countInValid={result.data?.errorImportList?.length || 0}
                    />
                );
                UiUtils.showSuccess(tCommon("actionDone"));
                clearGroupDataSource(type);
                setHiddenButton(true);
            } else {
                setMessage?.(tCommon("actionError"));
            }
        } catch {
            setMessage?.(tCommon("actionError"));
        } finally {
            setSaving(false);
            UiUtils.clearBusy();
        }
    };

    const handleDownloadError = async () => {
        if (!fileInfo?.fileId) return;
        setSaving(true);
        UiUtils.setBusy();
        try {
            const blob = await UploadFileService.getFileFromCache({ fileCacheId: fileInfo.fileId }, { responseType: "blob" });
            FileSaver.saveAs(blob, fileInfo.fileName);
        } catch {
            setMessage?.(tCommon("actionError"));
        } finally {
            setSaving(false);
            UiUtils.clearBusy();
        }
    };

    return (
        <>
            <Table<ImportExcelPartnerGroupInputDto>
                bordered={false}
                scroll={{ x: "max-content" }}
                sticky={{ offsetHeader: 1 }}
                columns={baseColumns}
                dataSource={dataExcel.map((x, idx) => ({ key: idx, ...x }))}
            />

            {!isValid && datasource.length > 0 && fileInfo?.fileId && (
                <div className="mt-2 float-right">
                    <Button onClick={handleDownloadError} loading={saving} icon={<DownloadOutlined />}>
                        {tExcel("downloadListInValid")}
                    </Button>
                </div>
            )}

            {isValid && datasource.length > 0 && (
                <div className="mt-2 float-right">
                    <Button
                        onClick={handleSave}
                        loading={saving}
                        hidden={hiddenButton}
                        type="primary"
                        icon={<SaveOutlined />}
                    >
                        {tExcel("saveListValid")}
                    </Button>
                </div>
            )}
        </>
    );
};