import React, {useEffect, useMemo} from "react";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {Button, Col, Form, Input, Row, Space} from "antd";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import DateUtil from "@ord-core/utils/date.util";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectStock} from "@ord-components/forms/select/selectDataSource/useSelectStock";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {TopAction} from "@ord-components/crud/TopAction";
import {ExportOutlined, RedoOutlined, SearchOutlined} from "@ant-design/icons";
import {useSelectIsActived} from "@ord-components/forms/select/selectDataSource/useSelectIsActived";
import {useSelectProductGroup} from "@ord-components/forms/select/selectDataSource/useSelectProductGroup";
import {useSelectIsAnyStock} from "@ord-components/forms/select/selectDataSource/useSelectIsAnyStock";
import {useExpiryDateStatus} from "@ord-components/forms/select/selectDataSource/useSelectExpiryStatus";
import TableImportExportInventory from "@pages/Report/Stock/TableImportExportInventory";
import {debounce} from "lodash";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";


function Index({}) {

    const {inventoryStockStore: mainStore} = useStore();

    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const [searchFormRef] = Form.useForm();
    useEffect(() => {
        if (mainStore) {
            mainStore.setSearchFormRef(searchFormRef);
            searchFormRef.setFields([
                {
                    name: "rangeDate",
                    value: DateUtil.getDateRange('thang_nay')
                },
                {
                    name: "reportType",
                    value: "time"
                }
            ])
            // mainStore.
        }
    }, []);

    const navigate = useNavigate();
    const topActions: IActionBtn[] = [
        {
            content: <Button type='primary' onClick={() => {
                mainStore.exportExcelPagedResult().then();
            }}>
                <Space>
                    <ExportOutlined/>
                </Space>
                {t('actionBtn.exportExcel')}
            </Button>
        },
    ];

    function onResetClick() {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "rangeDate",
                value: DateUtil.getDateRange('thang_nay')
            }
        ])
        mainStore.searchData({})
    }

    return (
        <>
            <PageTopTitleAndAction usingCustom={true} mainTitle={t('inventory')}
                                   items={[t('inventoryId')]}>
                <TopAction topActions={topActions}/>
            </PageTopTitleAndAction>

            <Form className={'ord-container-box'} form={searchFormRef} layout={"vertical"}
                  onFinish={debounce((d) => {
                      mainStore.searchData(d);
                  }, 250)}>
                <Row gutter={16}>
                    <Col lg={8} md={12}>
                        {/* <FloatLabel label={t('rangeDate')}> */}
                            <Form.Item name='rangeDate' className='flex-auto'>
                                <OrdDateRangeInput allowClear={false} allowEq labelMode={"fromToLabel"}></OrdDateRangeInput>
                            </Form.Item>
                        {/* </FloatLabel> */}

                    </Col>
                    <Col lg={4} md={12}>
                        <FloatLabel label={t('isActived')}>
                            <Form.Item name='isActived' className='flex-auto'>
                                <OrdSelect allowClear datasource={useSelectIsActived()}></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    {/*<Col lg={4} md={12}>*/}
                    {/*    <FloatLabel label={t('inventoryId')}>*/}
                    {/*        <Form.Item name='inventoryId' className='flex-auto'>*/}
                    {/*            <OrdSelect allowClear datasource={useSelectStock()}></OrdSelect>*/}
                    {/*        </Form.Item>*/}
                    {/*    </FloatLabel>*/}
                    {/*</Col>*/}
                    <SearchFilterText
                        onReset={onResetClick}
                        span={8}></SearchFilterText>
                    {/*<Col {...useResponsiveSpan(8)}>*/}
                    {/*    <FloatLabel label={t('filterSearch')}>*/}
                    {/*        <Space.Compact style={{width: '100%'}}>*/}
                    {/*            <Form.Item name='filter' className='flex-auto'>*/}
                    {/*                <Input allowClear/>*/}
                    {/*            </Form.Item>*/}
                    {/*            <Button type='primary' htmlType={'submit'}><SearchOutlined/></Button>*/}
                    {/*            <Button type='default' onClick={onResetClick}><RedoOutlined/></Button>*/}
                    {/*        </Space.Compact>*/}

                    {/*    </FloatLabel>*/}
                    {/*    <Form.Item noStyle name='extendResetTick'>*/}
                    {/*        <Input hidden/>*/}
                    {/*    </Form.Item>*/}
                    {/*</Col>*/}
                </Row>
            </Form>
            <TableImportExportInventory stored={mainStore}></TableImportExportInventory>
        </>)
        ;
}

export default Index;
const SearchBox = () => {
    const {t} = useTranslation(["stock_inventory"]);
    const form = Form.useFormInstance();
    const initRange = useMemo(() => DateUtil.getDateRange('thang_nay'), []);
    const groupCombo = useSelectProductGroup();
    const statusCombo = useSelectIsActived();
    const isAnyStockCombo = useSelectIsAnyStock();
    const expiryDateCombo = useExpiryDateStatus();

    useEffect(() => {
        form.setFields([
            {
                name: "rangeDate",
                value: DateUtil.getDateRange('thang_nay')
            }
        ]);
    }, [form]);
    const isShowAdvanceSearch_w = Form.useWatch('isShowAdvanceSearch', form);
    const stockDs = useSelectStock();
    // const expiryStatus  = useSelectStockExpiryStatus();

    return (<>
        <ColSpanResponsive span={8}>
            <Form.Item name='rangeDate' initialValue={initRange}>
                <OrdDateRangeInput allowEq labelMode={'fromToLabel'}/>
            </Form.Item>
        </ColSpanResponsive>
        <SearchFilterText placeHolder={t('searchProduct')} hasAdvanceSearchBtn span={12}/>
        {
            isShowAdvanceSearch_w && <>
                <ColSpanResponsive span={8}>
                    <FloatLabel label={t('inventoryId')}>
                        <Form.Item name='inventoryId' className='flex-auto'>
                            <OrdSelect allowClear datasource={stockDs}></OrdSelect>
                        </Form.Item>
                    </FloatLabel>
                </ColSpanResponsive>
                <ColSpanResponsive span={4}>
                    <FloatLabel label={t('productGroup')}>
                        <Form.Item name='productGroupId'>
                            <OrdSelect
                                datasource={groupCombo}
                                allowClear
                            />
                        </Form.Item>
                    </FloatLabel>
                </ColSpanResponsive>
                <ColSpanResponsive span={4}>
                    <FloatLabel label={t('status')}>
                        <Form.Item name='isActive'>
                            <OrdSelect datasource={statusCombo} allowClear/>
                        </Form.Item>
                    </FloatLabel>
                </ColSpanResponsive>
                <ColSpanResponsive span={4}>
                    <FloatLabel label={t('inventory')}>
                        <Form.Item name='isAnyStock'>
                            <OrdSelect datasource={isAnyStockCombo} allowClear/>
                        </Form.Item>
                    </FloatLabel>
                </ColSpanResponsive>
                <ColSpanResponsive span={4}>
                    <FloatLabel label={t('expiryDate')}>
                        <Form.Item name='expiryStatus'>
                            <OrdSelect datasource={expiryDateCombo} allowClear/>
                        </Form.Item>
                    </FloatLabel>
                </ColSpanResponsive>

                {/*<ColSpanResponsive span={8}>*/}
                {/*    <FloatLabel label={t('expiryDate')}>*/}
                {/*        <Form.Item name='expiryStatus' className='flex-auto'>*/}
                {/*            <OrdSelect allowClear datasource={expiryStatus}></OrdSelect>*/}
                {/*        </Form.Item>*/}
                {/*    </FloatLabel>*/}
                {/*</ColSpanResponsive>*/}
            </>
        }
    </>);
}
