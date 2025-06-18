import React, {lazy, Suspense, useEffect, useState} from 'react';
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Card, Col, Form, Progress, Row, Space, Spin, Statistic, Tag} from "antd";
import {ArrowLeftOutlined, EditOutlined, SaveOutlined} from "@ant-design/icons";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {TopAction} from "@ord-components/crud/TopAction";
import {parseInt} from "lodash";
import {PartnerDto, SpendingInformationOutputDto} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import {PartnerDoctorService} from "@api/PartnerDoctorService";
import './ViewDoctorDetails.scss'
import {CustomerService} from "@api/CustomerService";
import PartnerClassWithAvatar from "@pages/Partner/Shared/PartnerClassWithAvatar";
import Utils from "@ord-core/utils/utils";
import {observer} from "mobx-react-lite";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {DebtInfo} from "@pages/Partner/Shared/debtInfo";


function CusDoctorDetails() {
    const {partnerDoctorStore: mainStore} = useStore();
    const {t: tEnum} = useTranslation('enum');
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const navigate = useNavigate();
    const {partnerHashId} = useParams();
    const [partnerId, setPartnerId] = useState<number>();
    const [cusInfo, setCusInfo] = useState<PartnerDto>();
    const [isEdit, setIsEdit] = useState<boolean>();
    const [spendingInfo, setSpendingInfo] = useState<SpendingInformationOutputDto>();
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    })
    const [cusForm] = Form.useForm();
    useEffect(() => {
        PartnerDoctorService.getByHashId({
            hashId: partnerHashId ?? ""
        }).then(res => {
            setPartnerId(res.id ? parseInt(res.id) : 0);
            setCusInfo(res);
            cusForm.setFieldsValue(res);
        })

    }, [partnerHashId, mainStore.refreshDataState]);
    useEffect(() => {
        if (partnerId && partnerId > 0)
            CustomerService.getSpendingInformation({
                partnerId: partnerId
            }).then(res => {
                setSpendingInfo(res);
            })
    }, [partnerId]);
    const onSave = async () => {
        try {
            const data = await cusForm.validateFields();
            UiUtils.setBusy();
            try {
                PartnerDoctorService.createOrUpdate({
                    body: {
                        ...cusInfo,
                        ...data,
                        id: cusInfo?.id
                    }
                }).then(result => {
                    if (result) {
                        UiUtils.showSuccess(t('updateSuccess', {
                            ...result.data
                        }));
                        PartnerDoctorService.getByHashId({
                            hashId: partnerHashId ?? ""
                        }).then(res => {
                            setCusInfo(res);
                            setPartnerId(res.id ? parseInt(res.id) : 0);
                            cusForm.resetFields();
                            cusForm.setFieldsValue(res);
                            setIsEdit(false);

                        })
                    }
                })
            } catch (e) {

            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }
    }

    const topActions: IActionBtn[] = [
        {
            title: t('actionBtn.CustomerGroup'),
            permission: PERMISSION_APP.customer.customerGroup,
            content: <>
                <Button onClick={() => navigate(-1)}>
                    <Space>
                        <ArrowLeftOutlined/>
                    </Space>
                    {t('actionBtn.back')}
                </Button>
            </>
        },
        {
            permission: 'Partner.Customer.Create',
            content:
                <>
                    {isEdit ? <Button type='primary' onClick={onSave}>
                        <SaveOutlined></SaveOutlined>
                        {t('save')}
                    </Button> : <Button type='primary' onClick={() => {
                        mainStore.openUpdateModal(cusInfo);
                    }}>
                        <Space>
                            <EditOutlined/>
                            {t('actionBtn.edit')}
                        </Space>
                    </Button>}
                </>

        },
    ];
    const LazyModalCruDoctor = lazy(() => import('@pages/Partner/Doctor/ModalCruDoctor'));
    return (
        <div>
            <PageTopTitleAndAction usingCustom={true} mainTitle={t('pageTitle')}
                                   items={[t('pageTitleLvl1'), t('pageTitleLvl2')]}>
                <TopAction topActions={topActions}/>
            </PageTopTitleAndAction>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title={t('customerInfo')}>
                        <div className="flex gap-6">
                            <div className="flex-none w-36">
                                <PartnerClassWithAvatar
                                    partnerClass={spendingInfo?.accountClass ?? 0}></PartnerClassWithAvatar>
                            </div>
                            <div className="grow ">
                                <Row gutter={[16, 8]} className='mb-2.5'>
                                    <Col lg={24} md={24}>
                                        <div className='text-xl font-bold'>{cusInfo?.code}</div>
                                        {cusInfo?.isActived ?
                                            <Tag color='#EFFFEF'><span
                                                className='text-[#1AB01A]'>{t('isActived')}</span>
                                            </Tag> :
                                            <Tag color='red'>{t('notActived')}</Tag>}
                                        {cusInfo?.debtAmount ?
                                            <Tag color='#EEEEEE'>
                                                <span
                                                    className='text-[#45494E]'>{t('debtAmount')} :{formatter.format(cusInfo?.debtAmount ?? 0)}</span>
                                            </Tag>
                                            : ""
                                        }
                                    </Col>
                                    <Col lg={12} md={24}>
                                        <Card bordered={true}
                                              className="card-detail card-detail-debt border-[#FFCAD3]">
                                            <Statistic
                                                title={<div className='text-[#45494E] font-bold text-[16px]'>
                                                    {t('spentAmount')}
                                                </div>}
                                                value={spendingInfo?.spentAmount}
                                                precision={2}
                                                valueStyle={{color: '#ee0034', fontSize: '24px', fontWeight: 'bold'}}
                                                suffix={
                                                    <div className='text-[#45494E] text-[16px] font-normal'>VNĐ</div>
                                                }
                                            />
                                            <div dangerouslySetInnerHTML={{
                                                __html: t("info_upgrade", {
                                                    value: formatter.format(spendingInfo?.spentAmountNeedUpgrade ?? 0) + " VNĐ"
                                                })
                                            }}>
                                            </div>
                                            <Progress showInfo={false} strokeColor={'#ff9294'}
                                                      percent={spendingInfo?.percentSpentAmount ?? 0} type="line"/>

                                        </Card>
                                    </Col>
                                    <Col lg={12} md={24}>
                                        <Card bordered={true}
                                              className='card-detail card-detail-order border-[#FFCAD3]'>
                                            <Statistic
                                                title={<div className='text-[#45494E] font-bold text-[16px]'>
                                                    {t('numberOfOrders')}
                                                </div>}
                                                value={spendingInfo?.numberOfOrders}
                                                precision={0}
                                                valueStyle={{color: '#ee0034', fontSize: '24px', fontWeight: 'bold'}}
                                                suffix={
                                                    <div
                                                        className='text-[#45494E] text-[16px] font-normal'>{t('order')}</div>
                                                }
                                            />
                                            <div dangerouslySetInnerHTML={{
                                                __html: t("info_orderUpgrade", {
                                                    value: spendingInfo?.percentNumberOfOrders ?? 0
                                                })
                                            }}>
                                            </div>
                                            <Progress showInfo={false} strokeColor={'#ff9294'}
                                                      percent={spendingInfo?.percentNumberOfOrders ?? 0} type="line"/>

                                        </Card>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 8]}>
                                    <Col lg={24} md={24}>
                                        <div className="flex gap-6">
                                            <div className="flex-none w-56">
                                                {t('type')}:
                                            </div>
                                            <div className="grow ">
                                                <strong>{tEnum(cusInfo?.strType ?? "")}</strong>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col lg={12} md={24}>
                                        <div className="flex gap-6">
                                            <div className="flex-none w-56">
                                                {t('name')}:
                                            </div>
                                            <div className="grow ">
                                                <strong>{cusInfo?.name}</strong>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={12} md={24}>
                                        <div className="flex gap-6">
                                            <div className="flex-none w-56">
                                                {t('taxCode')}:
                                            </div>
                                            <div className="grow ">
                                                <strong>{cusInfo?.taxCode}</strong>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={12} md={24}>
                                        <div className="flex gap-6">
                                            <div className="flex-none w-56">
                                                {t('phone')}:
                                            </div>
                                            <div className="grow ">
                                                <strong>
                                                    {Utils.transformPhoneNumber(cusInfo?.phone ?? "")}
                                                </strong>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={12} md={24}>
                                        <div className="flex gap-6">
                                            <div className="flex-none w-56">
                                                {t('taxBranch')}:
                                            </div>
                                            <div className="grow ">
                                                <strong>{cusInfo?.taxBranch}</strong>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={12} md={24}>
                                        <div className="flex gap-6">
                                            <div className="flex-none w-56">
                                                {t('groupId')}:
                                            </div>
                                            <div className="grow ">
                                                <strong>{cusInfo?.groupName}</strong>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={24} md={24}>
                                        <div className="flex gap-6">
                                            <div className="flex-none w-56">
                                                {t('address')}:
                                            </div>
                                            <div className="grow ">
                                                <span>{cusInfo?.fullAddress}</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={24} md={24}>
                                        <div className="flex gap-6">
                                            <div className="flex-none w-56">
                                                {t('notes')}:
                                            </div>
                                            <div className="grow ">
                                                <span>{cusInfo?.notes}</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card title={t('prescriptionHistory')}>
                        {partnerId && <>Dang Update</>}
                    </Card>
                </Col>
            </Row>
            <Suspense fallback={<Spin/>}>
                {mainStore.createOrUpdateModal.visible &&
                    <LazyModalCruDoctor stored={mainStore}></LazyModalCruDoctor>}
            </Suspense>
        </div>
    );
}

export default observer(CusDoctorDetails);
