import {useStore} from "@ord-store/index";
import {Checkbox, Col, Form, FormInstance, Input, Modal, TableColumnsType,} from "antd";
import {observer} from "mobx-react-lite/src/observer";
import React, {useEffect, useRef, useState} from "react";
import "./index.scss";
import {DataTableWithSearch} from "@ord-components/table/DataTableWithSearch";
import {useTranslation} from "react-i18next";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import TableUtil from "@ord-core/utils/table.util";
import dayjs from "dayjs";
import {ImportStockService} from "@api/ImportStockService";
import {useSelectPartnerSupplier} from "@ord-components/forms/select/selectDataSource/useSelectPartnerSupplier";
import DateUtil from "@ord-core/utils/date.util";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {StockMovePagedOutputDto} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {MoveStatusCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveStatusCell";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import Utils from "@ord-core/utils/utils";

const SearchForm = React.memo(
    (props: {
        searchFormRef: FormInstance;
        onReset?: () => void;
        isCancelModal?: boolean;
    }) => {
        const initRange = DateUtil.getDateRange("thang_nay");
        const handleOnRefresh = () => {
            props.searchFormRef.setFieldValue("partnerId", undefined);
            props.searchFormRef.setFieldValue("filter", undefined);
            props.onReset?.();
        };
        useEffect(() => {
            props.searchFormRef.setFieldValue("partnerId", undefined);
            props.searchFormRef.setFieldValue("filter", undefined);
        }, [props.isCancelModal]);
        return (
            <>
                <Col {...useResponsiveSpan(10)}>
                    <Form.Item name="moveDateRange" initialValue={initRange}>
                        <OrdDateRangeInput allowEq labelMode={"fromToLabel"}/>
                    </Form.Item>
                </Col>
                <Form.Item noStyle hidden name="moveStatus" initialValue={4}>
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    noStyle
                    hidden
                    name="moveType"
                    initialValue={MoveType.PhieuNhapNhaCungCap}
                >
                    <Input></Input>
                </Form.Item>
                <SearchFilterText span={12} onReset={handleOnRefresh}/>
            </>
        );
    }
);

const ModalTableImportStockMain = observer(() => {
    const [t] = useTranslation("importStock");
    const {exportStockMoveStore} = useStore();
    const [refresh, doRefresh] = useState(0);
    const [isCancelModal, setIsCancelModal] = useState(false);
    const partner_Select = useSelectPartnerSupplier();
    const navigate = useNavigate();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    const [selectedId, setSelectedId] = useState<StockMovePagedOutputDto | null>(
        null
    );

    const getInfoPartnerById = (value: number) => {
        const {data} = partner_Select;
        const infoP = data.find((p: any) => p.value === value);

        if (infoP) {
            const {data} = infoP as any;
            return {name: data.name, phone: data.phone};
        }

        return null;
    };

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                dataIndex: "idHash",
                width: 40,
                align: "center",
                render: (value, dto) => {
                    return (
                        <Checkbox
                            checked={selectedId?.idHash === dto.idHash}
                            onChange={() => setSelectedId(dto)}
                        />
                    );
                },
            },
            {
                title: "moveCode",
                dataIndex: "moveCode",
                width: 100,
                render: (value, dto) => {
                    return <span>{dto.moveCode}</span>;
                },
            },
            {
                title: "import.moveDate",
                dataIndex: "moveDate",
                width: 100,
                render: (value, dto) => {
                    return value ? (
                        <span>{dayjs(new Date(value)).format("DD/MM/YYYY HH:mm")}</span>
                    ) : (
                        <></>
                    );
                },
            },
            {
                title: "import.PartnerId",
                width: 200,
                key: "partnerId",
                render: (value) => {
                    const data = getInfoPartnerById(Number(value.partnerId));
                    return data && data.name ? (
                        <span style={{textTransform: "capitalize"}}>{data.name}</span>
                    ) : (
                        <></>
                    );
                },
            },
            {
                title: "totalAmount",
                dataIndex: "totalAmount",
                width: 100,
                align: "end",
                render: (value) => {
                    return <PriceCell value={value} fixed={0}/>;
                },
            },
            {
                title: "status",
                dataIndex: "status",
                width: 100,
                align: "center",
                render: (value, dto) => {
                    return (
                        <>
                            <MoveStatusCell record={dto}/>
                        </>
                    );
                },
            },
        ],
        {
            ns: "stock",
            widthRowIndexCol: 50,
        }
    );

    const handleOk = async () => {
        if (!selectedId) return;
        UiUtils.setBusy();
        try {
            const response = await ImportStockService.getReturnById({
                idHash: selectedId.idHash as string,
            });

            if (!response.isSuccessful) {
                UiUtils.showError(response.message);
                return;
            }

            exportStockMoveStore.closeModal();
            navigate(pathNameRef.current + `/export-supplier/add-new-supplier-from-move/${selectedId.idHash}`);
        } catch (errors) {
            console.log(errors);
            UiUtils.showError(t("fetchApiImportStockServiceError"));
        } finally {
            UiUtils.clearBusy();
        }
    };

    const handleCancel = () => {
        setSelectedId(null);
        setIsCancelModal(!isCancelModal);
        handleOnRefresh();
        exportStockMoveStore.closeModal();
    };

    const getPageResult = (input: any) => {
        return ImportStockService.getPaged({body: {...input}});
    };

    const handleOnRefresh = () => {
        doRefresh((pre) => pre + 1);
    };
    useHotkeys(
        "F8",
        (event) => {
            handleOk();
            event.preventDefault();
        },
        {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true}
    );
    useHotkeys(
        "F10",
        (event) => {
            handleCancel();
            event.preventDefault();
        },
        {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true}
    );

    return (
        <Modal
            className="table-import-stock-main"
            title={t("titleModal")}
            open={exportStockMoveStore.isModalOpen}
            onOk={handleOk}
            okText={t("okText")}
            cancelText={t("okCancel")}
            okButtonProps={{disabled: !selectedId, icon: <CheckOutlined/>}}
            cancelButtonProps={{
                icon: <CloseOutlined/>,
            }}
            onCancel={handleCancel}
        >
            <DataTableWithSearch
                columns={columns}
                searchBox={{
                    searchForm: (form) => (
                        <SearchForm
                            searchFormRef={form}
                            onReset={handleOnRefresh}
                            isCancelModal={isCancelModal}
                        />
                    ),
                }}
                getPageResult={getPageResult}
                rowKey="moveCode"
                refreshData={refresh}
            ></DataTableWithSearch>
        </Modal>
    );
});

export default ModalTableImportStockMain;
