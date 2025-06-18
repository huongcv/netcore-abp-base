import { GolfBookingGroupImportDto, TplFileInfo, ValidateErrorDetail } from "@api/index.defs";
import { Button, Table } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { ColumnType } from "antd/es/table/interface";
import { useTranslation } from "react-i18next";
import { DownloadOutlined, SaveOutlined } from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import { useNavigate } from "react-router";
import { GolfBookingGroupService } from "@api/GolfBookingGroupService";
import GroupButtonFileExcel from "@ord-components/excel/GroupButtonFileExcel";
import { StatusCell } from "@ord-components/table/cells/StatusCell";
import { l } from "@ord-core/language/lang.utils";
import { UploadFileService } from "@api/UploadFileService";
import FileSaver from "file-saver";
import { useStore } from "@ord-store/index";
import utils from "@ord-core/utils/utils";

export const ErrorCell = (props: { errors: ValidateErrorDetail[] }) => {
	const { t } = useTranslation("golf-customer-group");
	const { errors: listErrorValidData } = props;
	return (
		<ul className={"ms-[15px] list-disc"}>
			{!!listErrorValidData &&
				listErrorValidData.map((it, idx) => (
					<li key={idx} className={"text-red-500"}>
						{t(it.error as any, it.data) as any}
					</li>
				))}
		</ul>
	);
};
export const BookingGroupDataTableExcel = (props: {
	datasource: GolfBookingGroupImportDto[];
	isValid: boolean;
	setMessage?: (message: string) => void
	fileInfo?: TplFileInfo | undefined,
	setTabBarExtra?: (element: ReactNode | any) => void
}) => {
	const { t } = useTranslation("golf-customer-group");
	const { datasource, isValid, setTabBarExtra } = props;
	const [hiddenButton, setHiddenButton] = useState(false);
	const [isReValid, setIsReValid] = useState<boolean>(isValid);
	const [dataExcel, setDataExcel] = useState<GolfBookingGroupImportDto[]>(datasource);
	const [saving, setSaving] = useState(false);
	const navigate = useNavigate();
	const {selectDataSourceStore} = useStore(); 

	const baseColumn: ColumnType<GolfBookingGroupImportDto>[] = [
		{
			key: "error",
			width: 300,
			hidden: isValid,
			render: (_, dto) => {
				return <ErrorCell errors={dto.listErrorValidData || []} />;
			},
		},
		{
			title: t("code"),
			dataIndex: "groupNo",
			width: 200,
			ellipsis: true,
		},
		{
			title: t("groupName"),
			dataIndex: "groupName",
			width: 200,
			ellipsis: true,
		},
		{
			title: t("notes"),
			dataIndex: "note",
			width: 300,
			ellipsis: true,
		},
	];

	const [columns, setColumns] = useState<ColumnType<GolfBookingGroupImportDto>[]>(baseColumn);

	const clearGroupDataSource = () => {
		const key = 'BookingGroup';
		selectDataSourceStore.clearByName(key);
		selectDataSourceStore.getOptions(key, async () => {
			const result = await GolfBookingGroupService.getComboOptions({});
			if (!result || result.length === 0) {
				return [];
			}
			return utils.mapCommonSelectOption(result);
		});
	};

	const handlerSave = async () => {
		setSaving(true);
		UiUtils.setBusy();
		try {
			let result = await GolfBookingGroupService.import({
				body: datasource,
			});

			if (result.isSuccessful) {
				setColumns([...baseColumn, {
					title: t("status"),
					dataIndex: 'isError',
					align: 'center',
					width: 140,
					render: (_: boolean) => <StatusCell isActived={!_}
						falseText={l.transCommon("failed")}
						trueText={l.transCommon("success")}
					/>
				}]);
				UiUtils.showSuccess(t('actionDone', { ns: 'common' }));
				clearGroupDataSource();
				setHiddenButton(true);
				const dataResult = ((result.data?.successImportList || []).concat(result.data?.errorImportList || [])) as GolfBookingGroupImportDto[];
				setDataExcel(dataResult);
				setTabBarExtra && setTabBarExtra(
					<GroupButtonFileExcel fileValid={result!.data!.successFile as any}
						fileInValid={result!.data!.errorFile as any}
						countValid={dataResult?.filter(x => !x.isError)?.length || 0}
						countInValid={dataResult?.filter(x => x.isError)?.length || 0}
					/>);
			} else {
				props.setMessage && props.setMessage(t('actionError'));
			}
		} catch {
		} finally {
			UiUtils.clearBusy();
		}
	};

	const handlerDownloadErrorAfterValid = async () => {
		setSaving(true);
		UiUtils.setBusy();
		try {
			let blob = await UploadFileService.getFileFromCache({
				fileCacheId: props.fileInfo?.fileId || '',
			}, { responseType: 'blob' })
			FileSaver.saveAs(blob, props.fileInfo?.fileName);
		} catch {
			props.setMessage && props.setMessage(t('actionError'));
		} finally {
			setSaving(false);
			UiUtils.clearBusy();
		}
	}

	const reset = () => {
		setTabBarExtra && setTabBarExtra(null);
		setHiddenButton(false);
		setColumns(baseColumn);
		setSaving(false);
	}

	useEffect(() => {
		reset();
		setDataExcel(datasource);
	}, [datasource]);

	useEffect(() => {
		setColumns([...baseColumn]);
	}, [isReValid])

	return (<>
		<Table<GolfBookingGroupImportDto>
			bordered={false}
			scroll={{ x: 'max-content' }}
			sticky={{ offsetHeader: 1 }}
			columns={columns}
			dataSource={dataExcel.map((x, idx) => ({ key: idx, ...x }))}
		/>

		{
			!props.isValid && props.datasource.length > 0 && props?.fileInfo?.fileId &&
			<div className={'mt-2 float-right'}>
				<Button onClick={handlerDownloadErrorAfterValid} loading={saving}
					icon={<DownloadOutlined />}>{t('downloadListInValid', { ns: 'excel' })}</Button>
			</div>
		}
		{
			props.isValid && props.datasource.length > 0 &&
			<div className={'mt-2 float-right'}>
				<Button onClick={handlerSave} loading={saving} hidden={hiddenButton} type={'primary'}
					icon={<SaveOutlined />}>{t('saveListValid', { ns: 'excel' })}</Button>
			</div>
		}
	</>);
};
