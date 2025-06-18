import React, {lazy, Suspense, useEffect, useState} from 'react';
import {Button, Card, Col, Dropdown, Form, MenuProps, Row, Space, Spin, Statistic, Menu} from 'antd';
import {DownOutlined, FileExcelOutlined, PlusOutlined, UnorderedListOutlined, AppstoreOutlined, MenuOutlined } from "@ant-design/icons";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import TableReservation from "@pages/2.Restaurant/Reservation/AdvanceReservation/TableReservation";
import DiagramReservation from "@pages/2.Restaurant/Reservation/AdvanceReservation/DiagramReservation";
import {useStore} from "@ord-store/index";
import {ACCOUNT_MOVE_TYPE, AccountMovePagingInputDto, CashbookStatisticsOutputDto} from "@api/index.defs";
import {AccountMoveService} from "@api/AccountMoveService";
import {useNavigate} from "react-router-dom";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import './index.scss';
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import DateUtil from "@ord-core/utils/date.util";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import {observer} from "mobx-react-lite";
import {HotkeysProvider, useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import Utils from "@ord-core/utils/utils";
import {OrdBreadcrumb} from "@ord-components/common/page/PageBreadcrumb";
import { Link } from 'react-router-dom';



const Index = () => {
    const tabs = ["Danh sách", "Sơ đồ"];
    const getTabIcon = (tab: string) => {
        if (tab === "Danh sách") return <UnorderedListOutlined />;
        if (tab === "Sơ đồ")      return <AppstoreOutlined />;
        return null;
    };
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const {reservation: stored, reasonTypeStore} = useStore();
    const navigate = useNavigate();
    const [staticData, setStaticData] = useState<CashbookStatisticsOutputDto>();
    const [searchFormRef] = Form.useForm();



    useEffect(() => {
        searchFormRef.resetFields();
        stored.setSearchFormRef(searchFormRef);
        stored.searchData({rangeDate: DateUtil.getDateRange('thang_nay')});
        loadStaticDash();
    }, []);


    useHotkeys('F10', (event) => {
        reasonTypeStore.setIsShowListModal(false);
        event.preventDefault();
    }, {scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true});

    const loadStaticDash = (data: AccountMovePagingInputDto = stored.searchDataState) => {
        AccountMoveService.cashbookStatistics({body: data}).then(res => {
            setStaticData(res.data);
        });
        stored.setSummaryReservation();
    };

    const onResetClick = () => {
        searchFormRef.resetFields();
        searchFormRef.setFieldsValue({rangeDate: DateUtil.getDateRange('thang_nay')});
        stored.searchData({})
        loadStaticDash();
    };

    // Menu Excel
    const excelMenu = (
        <Menu>
            <Menu.Item key="1">Xuất Excel</Menu.Item>
            <Menu.Item key="2">Nhập Excel</Menu.Item>
        </Menu>
    );

    const topAction: IActionBtn[] = [
        {
            content: (
                <Dropdown overlay={excelMenu}>
                    <Button icon={<FileExcelOutlined />}>
                        Thao tác Excel <DownOutlined />
                    </Button>
                </Dropdown>
            ),
        },
        {
            content: (
                <Button
                    style={{ background: 'var(--main-color)', color: 'white' }}
                >
                    <Link to="/restaurant/add-table">
                        <Space>
                            <PlusOutlined/> Thêm mới
                        </Space>
                    </Link>

                </Button>
            ),
        }
    ];

    const formatterNumber = Utils.formatterNumber;
    const scopeId = React.useMemo(() => `crudPageScope-${Math.random().toString(36).substring(2, 15)}`, []);


    const isShowAdvanceSearch_w = Form.useWatch('isShowAdvanceSearch', searchFormRef);
    const LazyModalReasonType = lazy(() => import('@pages/AccountantManagement/reasonType/Index'));
    const LazyModalCruReasonType = lazy(() => import('@pages/AccountantManagement/reasonType/ModalCruReasonType'));
    return (
        <HotkeysProvider initiallyActiveScopes={([scopeId])}>
            <Space
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 12,
                    marginBottom: 20,
                }}
            >
                <OrdBreadcrumb
                    mainTitle="Danh sách đặt bàn"
                    itemsRoute={[{ title: 'Đặt bàn', route: '/restaurant/book' }]}
                />
                <TopAction topActions={topAction}/>
            </Space>
            <Card className='mb-2.5 card-search'>
                <Form form={searchFormRef} layout={"vertical"} onFinish={debounce((d) => {
                    stored.searchData(d);
                    loadStaticDash(d);
                }, 250)}>
                    <Row gutter={8}>
                        <ColSpanResponsive span={8}>
                            <Form.Item name='rangeDate' initialValue={DateUtil.getDateRange('thang_nay')}>
                                <OrdDateRangeInput allowEq labelMode={'fromToLabel'}/>
                            </Form.Item>
                        </ColSpanResponsive>
                        <SearchFilterText hasAdvanceSearchBtn={true} span={16} onReset={onResetClick}/>
                    </Row>
                    <Row gutter={[8, 8]} hidden={!isShowAdvanceSearch_w}>
                        <Col lg={12} md={12}>
                            <FloatLabel label={"Khu vực"}>
                                <Form.Item name='area'>
                                    <OrdSelect allowClear datasource={""} onChange={(value) => {

                                    }} />
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col lg={12} md={12}>
                            <FloatLabel label={"Loại bàn"}>
                                <Form.Item name='tableType'>
                                    <OrdSelect allowClear datasource={""} onChange={(value) => {

                                    }} />
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                    </Row>
                    <Form.Item hidden name="hotKeyScopeId" initialValue={scopeId} />
                </Form>
            </Card>
            <div className="tab-disease" style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={activeTab === tab ? "active" : ""}
                        style={{
                            cursor: "pointer",
                            background: activeTab === tab ? "#f5f5f5" : "#fff",
                            border: "none",
                            padding: "8px 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: 4
                        }}
                    >
                        {/* Icon + Text */}
                        {getTabIcon(tab)}
                        <span>{tab}</span>
                    </button>
                ))}
            </div>

            <div className={'div-disease-1'}>
                {activeTab === "Danh sách" &&  <TableReservation onCruSuccess={loadStaticDash} searchFormRef={searchFormRef} />}
                {activeTab === "Sơ đồ" && <DiagramReservation/>}
            </div>


            <OrdCreateOrUpdateModal stored={reasonTypeStore}
                                    entityForm={() => <LazyModalCruReasonType />}

            />
            <Suspense fallback={<Spin />}>
                {reasonTypeStore.isShowListModal && <LazyModalReasonType />}
            </Suspense>

        </HotkeysProvider>
    );
};

export default observer(Index);
