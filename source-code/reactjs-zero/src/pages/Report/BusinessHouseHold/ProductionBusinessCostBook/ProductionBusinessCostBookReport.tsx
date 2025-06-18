import {
    ArrowLeftOutlined,
    CheckOutlined,
    ExportOutlined,
} from "@ant-design/icons";
import {
    ProductBusinessCostSelectedGroupInput,
    ProductionBusinessCostBookDetailDto,
} from "@api/index.defs";
import { ProductionBusinessCostBookService } from "@api/ProductionBusinessCostBookService";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { TopAction } from "@ord-components/crud/TopAction";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import DateUtil from "@ord-core/utils/date.util";
import Utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
import {
    Button,
    Checkbox,
    Col,
    Collapse,
    Divider,
    Form,
    Modal,
    Row,
    Space,
    Table,
} from "antd";
import { TableColumnsType } from "antd/lib";
import dayjs from "dayjs";
import { debounce, sum } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { observer } from "mobx-react-lite";
import { ShopSettingService } from "@api/ShopSettingService";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;
const SETTING_TYPE_NAME = "Shop:Report:TaxProductionBusinessCostBook:PaymentReasonTypeFilter";

const ProductionBusinessCostBookReport = () => {
    const [groups, setGroups] = useState<ProductBusinessCostSelectedGroupInput[]>(
        []
    );
    const navigate = useNavigate();
    const [searchFormRef] = Form.useForm();
    const { productionBusinessCostBookReportStore: stored } = useStore();
    const formatterNumber = Utils.formatterNumber;
    const { t } = useTranslation(stored.getNamespaceLocale());
    const [isGroupsLoaded, setIsGroupsLoaded] = useState(false);


    useEffect(() => {
        ProductionBusinessCostBookService.bussinessCostTypeGroup().then((groupsRes) => {
            setGroups(groupsRes);
            setIsGroupsLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (stored && isGroupsLoaded) {
            stored.setSearchFormRef(searchFormRef);
            searchFormRef.setFields([
                {
                    name: "rangeDate",
                    value: DateUtil.getDateRange("thang_nay"),
                },
            ]);
            stored.searchData(searchFormRef.getFieldsValue())
        }
    }, [stored, isGroupsLoaded]);

    const columns: TableColumnsType<ProductionBusinessCostBookDetailDto> = useMemo(() => {
        return [
            {
                title: "Ngày, tháng ghi sổ",
                dataIndex: "accountMoveDate",
                render: (val, record) => record.notes == "Số phát sinh trong kỳ" ? "" : dayjs(val).format("DD/MM/YYYY"),
                align: "center" as const,
                width: 180,
            },
            {
                title: "Chứng từ",
                children: [
                    {
                        title: "Số hiệu",
                        dataIndex: "accountMoveCode",
                        align: "center" as const,
                        width: 120,
                    },
                    {
                        title: "Ngày, tháng",
                        dataIndex: "accountMoveDate",
                        render: (val, record) => record.notes == "Số phát sinh trong kỳ" ? "" : dayjs(val).format("DD/MM/YYYY"),
                        align: "center" as const,
                        width: 130,
                    },
                ],
            },
            {
                title: "Diễn giải",
                dataIndex: "descriptions",
                align: "left" as const,
                width: 300,
                render: (v) => <span className={v == "Số phát sinh trong kỳ" ? 'font-bold' : ''}>{v}</span>
            },
            {
                title: "Tổng số tiền",
                dataIndex: "amount",
                align: "right" as const,
                render: (val, record) => record.notes == "Số phát sinh trong kỳ" ? '' : formatterNumber(val),
                width: 130,
            },
            {
                title: (
                    <div style={{ textAlign: "center", whiteSpace: "normal" }}>
                        Tập hợp chi phí theo yếu tố sản xuất, kinh doanh
                    </div>
                ),
                children: groups.map((g) => {
                    return {
                        title: <div style={{ whiteSpace: "normal" }}>{g.name}</div>,
                        align: "right" as const,
                        width: 240,
                        render: (_: any, record: any) => {
                            const isMatch = g.childSelectIds?.includes(record.reasonTypeEnumId);
                            return isMatch ? formatterNumber(record.amount) : "";
                        }
                    };
                }),
            }
        ];
    }, [groups]);

    const topAction: IActionBtn[] = [
        {
            content: (
                <Button onClick={() => navigate(-1)}>
                    <Space>
                        <ArrowLeftOutlined />
                    </Space>
                    Quay lại
                </Button>
            ),
        },
        {
            content: (
                <Button type="primary" onClick={() => stored.exportExcelPagedResult({
                    ...searchFormRef.getFieldsValue()
                })}>
                    <Space>
                        <ExportOutlined />
                    </Space>
                    Xuất Excel
                </Button>
            ),
        },
    ];

    function onResetClick() {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "rangeDate",
                value: DateUtil.getDateRange("thang_nay"),
            },
        ]);
        stored.searchData({});
    }

    return (
        <>
            <PageTopTitleAndAction
                usingCustom={true}
                mainTitle={"S3-HKD: Sổ chi phí, sản xuất kinh doanh"}
                items={["Báo cáo Hộ kinh doanh"]}
            >
                <TopAction topActions={topAction} />
            </PageTopTitleAndAction>
            <Form
                className="ord-container-box"
                form={searchFormRef}
                layout="vertical"
                onFinish={debounce((d) => {
                    stored.searchData(d);
                }, 250)}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12}>
                        <FloatLabel label={"Khoảng thời gian"}>
                            <Form.Item>
                                <Space.Compact style={{ width: "100%" }}>
                                    <Form.Item name="rangeDate" className="flex-auto">
                                        <OrdDateRangeInput />
                                    </Form.Item>
                                    <Button
                                        type="default"
                                        onClick={onResetClick}
                                        className="btn-other"
                                        icon={<IconlyLight width={22} type="Reload.svg" />}
                                    />
                                </Space.Compact>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Button type='primary' htmlType={'submit'} className={'search-btn'} icon={<IconlyLight width={22} type={'Search.svg'} />} />
                </Row>
            </Form>
            <div className="ord-container-box custom-scrollbar">
                {isGroupsLoaded && (<AntTableWithDataPaged
                    searchForm={searchFormRef}
                    columns={columns}
                    searchData={stored.searchDataState}
                    refreshDatasource={stored.refreshDataState}
                    getPageResult={async (d) => {
                        const res = await stored.apiService().getPaged({ body: d.body });

                        stored.summaryData = res.summaryData;

                        return {
                            items: res.items,
                            totalCount: res.totalCount
                        };
                    }}
                    onChangePageResult={(pagedResult) => {
                        const openingRow: ProductionBusinessCostBookDetailDto = {
                            notes: "Số phát sinh trong kỳ"
                        }
                        pagedResult.items = [openingRow, ...(pagedResult.items || [])];
                    }}
                    summary={() => {
                        const summaryData = stored.summaryData;
                        if (!summaryData) return <></>
                        const total = summaryData.reduce(
                            (sum, item) => sum + (item.totalAmount ?? 0),
                            0
                        );
                        const totalByType: Record<number, number> = {};

                        summaryData.forEach((item) => {
                            totalByType[item.typeId ?? 0] =
                                (totalByType[item.typeId ?? 0] ?? 0) + (item.totalAmount ?? 0);
                        });

                        return (
                            <Table.Summary fixed="bottom">
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={4} className='font-bold  !pr-1.5'>
                                        <b>Tổng cộng</b>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={4} align="right" className='font-bold  !pr-1.5'>
                                        {formatterNumber(total)}
                                    </Table.Summary.Cell>
                                    {groups.map((g, idx) => (
                                        <Table.Summary.Cell key={idx} index={idx} align="right" className='font-bold  !pr-1.5'>
                                            {formatterNumber(totalByType[g.typeId ?? 0])}
                                        </Table.Summary.Cell>
                                    ))}
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                />)}
            </div>
        </>
    );
};

export default observer(ProductionBusinessCostBookReport);
