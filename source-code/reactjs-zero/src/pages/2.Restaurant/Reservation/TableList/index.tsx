import React, {lazy, Suspense, useEffect, useState} from 'react';
import {Button, Card, Col, Dropdown, Form, MenuProps, Row, Space, Spin, Statistic, Menu} from 'antd';
import {DownOutlined, FileExcelOutlined, PlusOutlined, InboxOutlined} from "@ant-design/icons";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import TableList from "@pages/2.Restaurant/Reservation/TableList/TableList";
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

const Index = () => {
    const {reservationStore: stored, reasonTypeStore} = useStore();
    const navigate = useNavigate();
    const [staticData, setStaticData] = useState<CashbookStatisticsOutputDto>();
    const [searchFormRef] = Form.useForm();

    useEffect(() => {
        searchFormRef.resetFields();
        stored.setSearchFormRef(searchFormRef);
        stored.searchData({rangeDate: DateUtil.getDateRange('thang_nay')});
    }, []);


    useHotkeys('F10', (event) => {
        reasonTypeStore.setIsShowListModal(false);
        event.preventDefault();
    }, {scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true});

    const onResetClick = () => {
        searchFormRef.resetFields();
        searchFormRef.setFieldsValue({rangeDate: DateUtil.getDateRange('thang_nay')});
        stored.searchData({})
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
                <Button>
                    <Space>
                        <InboxOutlined />
                    </Space>
                    Loại bàn
                </Button>
            ),
        },
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
                    <Space>
                        <PlusOutlined/>
                    </Space>
                    Thêm mới
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
                    mainTitle="Danh sách bàn"
                    itemsRoute={[{ title: 'Đặt bàn', route: '/restaurant/table-list' }]}
                />
                <TopAction topActions={topAction}/>
            </Space>
            <Card className='mb-2.5 card-search'>
                <Form form={searchFormRef} layout={"vertical"} onFinish={debounce((d) => {
                    stored.searchData(d);
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
                                    <OrdSelect allowClear datasource={[] as any} onChange={(value) => {

                                    }} />
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col lg={12} md={12}>
                            <FloatLabel label={"Loại bàn"}>
                                <Form.Item name='tableType'>
                                    <OrdSelect allowClear datasource={[] as any} onChange={(value) => {

                                    }} />
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                    </Row>
                    <Form.Item hidden name="hotKeyScopeId" initialValue={scopeId} />
                </Form>
            </Card>
            <TableList onCruSuccess={() => {}} searchFormRef={searchFormRef} />
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
