import { SyncOutlined } from "@ant-design/icons";
import { NationalPharmacyIntegrationDto } from "@api/index.defs";
import { IntegrateService } from "@api/IntegrateService";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import dateUtil from "@ord-core/utils/date.util";
import TableUtil from "@ord-core/utils/table.util";
import uiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import { NationalPharmacySearch } from "@pages/System/TransferNationalPharmacy/NationalPharmacy/NationalPharmacySearch";
import { Button, Form, Row, Tag } from "antd";
import { TableColumnsType } from "antd/lib";
import { debounce } from "lodash";
import {observer} from "mobx-react-lite";
import { Key, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import "./index.scss";
import { NationDrugSegmented } from "./NationPharmacySegmented";
import { useWatch } from "antd/es/form/Form";
import { IntegrateDrugNationalColumns, IntegrateTicketNationalColumns } from "./NationalPharmacyColumns";

interface NationalPharmacyTableProps {
    nationalPharmacyType: number
}
const NationalPharmacyTable = (props: NationalPharmacyTableProps) => {
    const [searchFormRef] = Form.useForm();
    const [selectedRows, setSelectedRows] = useState<NationalPharmacyIntegrationDto[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const { nationalPharamcyStore: mainStore } = useStore();
    const { t } = useTranslation('integration');
    const nationalPharmacyStatus_w = useWatch('nationalPharmacyStatus', searchFormRef); 

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        props.nationalPharmacyType == 0 ? [...IntegrateDrugNationalColumns] : [...IntegrateTicketNationalColumns], {
        ns: 'integration'
    });

    useEffect(() => {
        searchFormRef.setFieldValue('nationalPharmacyType', props.nationalPharmacyType); 
    }, [props.nationalPharmacyType])

    const refreshDataGrid = () => {
        setSelectedRows([]); 
        setSelectedRowKeys([]); 

        searchFormRef.resetFields(); 
        searchFormRef.setFieldValue('nationalPharmacyType', props.nationalPharmacyType); 
        searchFormRef.submit(); 
    }

    const handleIntergrate = async () => {
        uiUtils.showConfirm({
            title: t('confirmIntegrateTitle'),
            content: (<Trans ns={'integration'}
                i18nKey="confirmIntegrate"
                components={{ italic: <i />, bold: <strong /> }}></Trans>),
            onOk: async () => {
                try {
                    uiUtils.setBusy();
                    const result = await IntegrateService.nationalPharmacyIntegrationList({
                        body: selectedRows
                    });

                    if (result.isSuccessful) {
                        if(props.nationalPharmacyType == 0) {
                            uiUtils.showSuccess(t('integraionProductSuccess'));
                        } else {
                            uiUtils.showSuccess(t('integraionTicketSuccess'));
                        }
                        
                    } else {
                        uiUtils.showError(t('integraionError', {
                            count: result?.notification?.data?.length ?? 0 
                        }))
                    }

                    refreshDataGrid(); 
                } catch (err) {
                    uiUtils.showError(t('integraionError', {
                        count: selectedRows.length
                    }))
                } finally {
                    uiUtils.clearBusy();
                }
            }
        });

    }

    return (
        <Form form={searchFormRef} className="national-pharmacy" onFinish={debounce((d) => {
            mainStore.searchData(d)
        }, 250)}>
            <Row gutter={[16, 8]}>
                <NationalPharmacySearch isAlowDateRange={props.nationalPharmacyType == 1} />
            </Row>
            <Row gutter={[16, 8]} className="segment-case">
                <NationDrugSegmented getCountApi={IntegrateService.getNationalPharmacyInCase} />
                <Button type="primary" className="ml-auto" icon={<SyncOutlined />}
                    onClick={handleIntergrate} disabled={!selectedRows.length || nationalPharmacyStatus_w == 1}
                >
                    {t('integration')}
                </Button>
            </Row>
            <AntTableWithDataPaged
                searchData={mainStore.searchDataState}
                refreshDatasource={mainStore.refreshDataState}
                rowSelection={{
                    type: "checkbox",
                    selectedRowKeys,
                    onChange: (selectedRowKeys, selectedRows) => {
                        setSelectedRows(selectedRows);
                        setSelectedRowKeys(selectedRowKeys);
                    },
                }}
                searchForm={searchFormRef}
                getPageResult={(d) =>
                    mainStore.apiService().getPaged({
                        body: { ...d.body },
                    }, {})
                }
                columns={columns}
            />
        </Form>
    );
}

export default observer(NationalPharmacyTable);