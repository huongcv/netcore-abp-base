import React, {lazy, Suspense, useEffect, useState} from 'react';
import {Button, Card, Col, Dropdown, Form, MenuProps, Row, Space, Spin, Statistic} from 'antd';
import {DownOutlined, PlusOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import TableCashbook from "@pages/AccountantManagement/cashbook/TableCashbook";
import {useStore} from "@ord-store/index";
import {ACCOUNT_MOVE_TYPE, AccountMovePagingInputDto, CashbookStatisticsOutputDto} from "@api/index.defs";
import {AccountMoveService} from "@api/AccountMoveService";
import {useNavigate} from "react-router-dom";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectAccountMoveType} from "@ord-components/forms/select/selectDataSource/useSelectAccountMoveType";
import MoveReasonTypeInput from "@pages/AccountantManagement/Shared/forms/MoveReasonTypeInput";
import {useSelectPaymentMethod} from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import './index.scss';
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import DateUtil from "@ord-core/utils/date.util";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import CreateOrUpdateReasonTypeForm from "@pages/AccountantManagement/reasonType/ModalCruReasonType";
import {observer} from "mobx-react-lite";
import ReasonType from "@pages/AccountantManagement/reasonType/Index";
import {HotkeysProvider, useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import Utils from "@ord-core/utils/utils";
import { useAccountantUtils } from '../Shared/accountant.utils';


const Index = () => {
    const {t} = useTranslation('cashbook');
    const {cashbook: stored, reasonTypeStore} = useStore();
    const navigate = useNavigate();
    const [staticData, setStaticData] = useState<CashbookStatisticsOutputDto>();
    const [accMoveType, setAccMoveType] = useState<ACCOUNT_MOVE_TYPE>();
    const [searchFormRef] = Form.useForm();
    const { clearDatasource } = useAccountantUtils();

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
        stored.setSummaryCashBook();
    };

    const onResetClick = () => {
        searchFormRef.resetFields();
        searchFormRef.setFieldsValue({rangeDate: DateUtil.getDateRange('thang_nay')});
        stored.searchData({})
        loadStaticDash();
    };

    const itemsReasonType: MenuProps['items'] = [
        {
            icon: <PlusOutlined />,
            label: <a onClick={() => reasonTypeStore.openCreateModalWithType(1)}>{t('actionBtn.AddBranchType')}</a>,
            key: '0'
        },
        {
            icon: <PlusOutlined />,
            label: <a onClick={() => reasonTypeStore.openCreateModalWithType(2)}>{t('actionBtn.AddTypeOfTRevenue')}</a>,
            key: '1'
        },
        {
            icon: <UnorderedListOutlined />, 
            label: <a onClick={() => reasonTypeStore.setIsShowListModal(true)}>{t('actionBtn.ListReasonType')}</a>,
            key: '2'
        },
    ];

    const topAction: IActionBtn[] = [
        {
            title: t('actionBtn.ReasonType'),
            permission: PERMISSION_APP.customer.customerGroup,
            content: (
                <Dropdown menu={{items: itemsReasonType}} trigger={['hover']}>
                    <Button>
                        <Space>
                            <UnorderedListOutlined/>
                            {t('actionBtn.ReasonType')}
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>
            )
        },
        {
            title: t('actionBtn.ceateReceipt'),
            icon: <PlusOutlined/>,
            content: (
                <Button type='primary' onClick={() => stored.openCashBookModal(1)}>
                    <Space>
                        <PlusOutlined/>
                    </Space>
                    {t('actionBtn.ceateReceipt')}
                </Button>
            )
        },
        {
            title: t('actionBtn.createPaymentVoucher'),
            icon: <PlusOutlined/>,
            content: (
                <Button type='primary' onClick={() => stored.openCashBookModal(2)}>
                    <Space>
                        <PlusOutlined/>
                    </Space>
                    {t('actionBtn.createPaymentVoucher')}
                </Button>
            )
        }
    ];

    const formatterNumber = Utils.formatterNumber;
    const scopeId = React.useMemo(() => `crudPageScope-${Math.random().toString(36).substring(2, 15)}`, []);
    

    const isShowAdvanceSearch_w = Form.useWatch('isShowAdvanceSearch', searchFormRef);
    const LazyModalReasonType = lazy(() => import('@pages/AccountantManagement/reasonType/Index'));
    const LazyModalCruReasonType = lazy(() => import('@pages/AccountantManagement/reasonType/ModalCruReasonType'));
    return (
        <HotkeysProvider initiallyActiveScopes={([scopeId])}>
            <PageTopTitleAndAction>
                <TopAction topActions={topAction}/>
            </PageTopTitleAndAction>
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
                        <Col lg={8} md={12}>
                            <FloatLabel label={t('accountMoveType')}>
                                <Form.Item name='accountMoveType'>
                                    <OrdSelect allowClear datasource={useSelectAccountMoveType()} onChange={(value) => {
                                         setAccMoveType(value);
                                         searchFormRef.setFieldValue("reasonTypeId", null);
                                    }} />
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col lg={8} md={12}>
                            <FloatLabel label={t('paymentMethod')}>
                                <Form.Item name='paymentMethod'>
                                    <OrdSelect allowClear datasource={useSelectPaymentMethod()}/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                    </Row>
                    <Form.Item hidden name="hotKeyScopeId" initialValue={scopeId} />
                </Form>
            </Card>
            <Row gutter={[16, 8]} className='mb-2.5'>
                <Col lg={6} md={12} sm={24}>
                    <Card bordered={true} size={"small"} className='card-static'>
                        <Statistic
                            value={staticData?.beginningBalance}
                            valueStyle={{fontSize: "16px", fontWeight: 'bold'}}
                            prefix={<span className='text-[#505050]  font-normal'>{t('beginningBalance')}: </span>}
                        />
                    </Card>
                </Col>
                <Col lg={6} md={12} sm={24}>
                    <Card bordered={true} size={"small"} className='card-static'>
                        <Statistic
                            value={staticData?.totalIncome}
                            valueStyle={{fontSize: "16px", fontWeight: 'bold'}}
                            prefix={<span className='text-[#505050]  font-normal'>{t('totalIncome')}: </span>}
                        />
                    </Card>
                </Col>
                <Col lg={6} md={12} sm={24}>
                    <Card bordered={true} size={"small"} className='card-static red'>
                        <Statistic
                            value={staticData?.totalCost}
                            valueStyle={{color: '#ee0034', fontSize: "16px", fontWeight: 'bold'}}
                            prefix={<span className='text-[#505050]  font-normal'>{t('totalCost')}: </span>}
                        />
                    </Card>
                </Col>
                <Col lg={6} md={12} sm={24}>
                    <Card bordered={true} size={"small"} className='card-static'>
                        <Statistic
                            value={staticData?.endingBalance}
                            valueStyle={{fontSize: "16px", fontWeight: 'bold'}}
                            prefix={<span className='text-[#505050]  font-normal'>{t('endingBalance')}: </span>}
                        />
                    </Card>
                </Col>
            </Row>
            <TableCashbook onCruSuccess={loadStaticDash} searchFormRef={searchFormRef} />
            <OrdCreateOrUpdateModal stored={reasonTypeStore}
                entityForm={() => <LazyModalCruReasonType />}
                onSavedSuccess={(data) => {
                    const { reasonMoveType } = reasonTypeStore.createOrUpdateModal.entityData as any;
                    clearDatasource(reasonMoveType, true)
                }}
            />
            <Suspense fallback={<Spin />}>
                {reasonTypeStore.isShowListModal && <LazyModalReasonType />}
            </Suspense>

        </HotkeysProvider>
    );
};

export default observer(Index);
