import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Button, Card, Col, Descriptions, Form, Row, Space, Table, TableColumnsType} from "antd";
import {AccessCardUseByBookingPlayerDto, ConfirmAccessCardLoseAndIssueDto} from "@api/index.defs";
import {
    useGolfAccessCardAvailable
} from "@ord-components/forms/select/selectDataSource/golf/useGolfAccessCardAvailable";
import {AccessCardStatusEnum, AccessCardTypeEnum} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {AccessCardService} from "@api/AccessCardService";
import UiUtils from "@ord-core/utils/ui.utils";
import TableUtil from "@ord-core/utils/table.util";
import DateUtil from "@ord-core/utils/date.util";
import {CreditCardOutlined, RollbackOutlined, SaveOutlined} from "@ant-design/icons";
import FloatLabel from "@ord-components/forms/FloatLabel";
import InputAccessCard from "@pages/1.Golf/Category/MemberShipCard/InputAccessCard/InputAccessCard";
import Title from "antd/lib/typography/Title";
import {debounce} from "lodash";
import TextArea from "antd/es/input/TextArea";
import {observer} from "mobx-react-lite";

function ManagerCardPlayer(props: {
    boardId: number,
    bookingPlayerId: string | undefined
}) {
    const {
        golfBookingStore: mainStore,
        golfAccessCardStore,
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    // const {t: tAc} = useTranslation("golf-access-card");

    const [form] = Form.useForm();
    const [formCancel] = Form.useForm();
    const {boardId, bookingPlayerId} = props ?? {};
    const [dataSource, setDataSource] =
        useState<AccessCardUseByBookingPlayerDto[]>();
    const [lostCardData, setLostCardData] = useState<AccessCardUseByBookingPlayerDto>();
    useEffect(() => {
        const fetchFlightInfo = async () => {
            try {
                const res =
                    await AccessCardService.getListAccessCardHistoryByBookingPlayerId(
                        {bookingPlayerId: Number(bookingPlayerId)},
                        {}
                    );
                setDataSource([...res]);
            } catch (error) {
                console.error(error);
            } finally {
            }
        };
        fetchFlightInfo();
    }, [bookingPlayerId]);


    //#region Tab Player
    const onReturnCardSave = async () => {
        try {
            const dataForm = await formCancel.validateFields();
            UiUtils.setBusy();
            try {
                const par: ConfirmAccessCardLoseAndIssueDto = {
                    accessCardIdNew: dataForm.accessCardIdNew,
                    note: dataForm.note,
                    accessCardIdOld: lostCardData?.accessCardId,
                    idRecord: lostCardData?.id,
                    bookingPlayerId: bookingPlayerId,
                };
                AccessCardService.confirmAccessCardLoseAndIssue({body: par}).then(
                    (res) => {
                        if (res.isSuccessful) {
                            UiUtils.showSuccess(res.message ?? "IssueRfidSuccess");
                            mainStore.refreshTeeTimeData(boardId);
                        } else {
                            UiUtils.showError(res.message);
                        }
                    }
                );
            } catch (e) {
                UiUtils.clearBusy();
            } finally {
                // clearDataCloseModal();
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm();
        }
    };
    const onIssueRfid = async () => {
        try {
            const data = await form.validateFields();
            UiUtils.setBusy();

            const res = await mainStore.issueRfid({
                accessCardId: data?.accessCardId,
                bookingPlayerId: bookingPlayerId
            });

            if (res.isSuccessful) {
                UiUtils.showSuccess(res.message ?? "IssueRfidSuccess");
                mainStore.refreshTeeTimeData(boardId);
                // mainStore.refreshTeeTimeData(boardId);
            } else {
                UiUtils.showError(res.message);
            }
        } catch (error) {
            UiUtils.showCatchError(error);
        } finally {
            UiUtils.clearBusy();
        }
    }

    // const clearDataCloseModal = () => {
    //     form.resetFields();
    // };
    const columns: TableColumnsType<AccessCardUseByBookingPlayerDto> =
        TableUtil.getColumns(
            [
                {
                    title: t("code"),
                    dataIndex: "code",
                    align: "left",
                    width: 100,
                },
                {
                    title: t("dateStartUsingCard"),
                    dataIndex: "startDate",
                    align: "left",
                    width: 100,
                    render: (v) => (v != null ? DateUtil.toFormat(v) : <></>),
                },
                {
                    title: t("dateReturnCard"),
                    dataIndex: "endDate",
                    align: "left",
                    width: 100,
                    render: (v) => (v != null ? DateUtil.toFormat(v) : <></>),
                },
            ],
            {
                actions: [
                    {
                        title: "recoverCard",
                        icon: <RollbackOutlined/>,
                        hiddenIf: (d: AccessCardUseByBookingPlayerDto) => {
                            return d.accessStatus !== AccessCardStatusEnum.Assigned || d.endDate != null;
                        },
                        onClick: (d: AccessCardUseByBookingPlayerDto) => {
                            golfAccessCardStore.revokeCardByAccessCardId({
                                accessCardId: d.accessCardId,
                                bookingPlayerId: bookingPlayerId,
                                note: "Thu hồi thẻ player",
                            }, () => {
                                if (boardId)
                                    mainStore.refreshTeeTimeData(boardId);
                            })
                            // setLostCardData(d);
                            // setActiveTabKey2('cancelRfId');
                        },
                    },
                    {
                        title: "lost-issue",
                        icon: <CreditCardOutlined/>,
                        isDanger: true,
                        hiddenIf: (record: AccessCardUseByBookingPlayerDto) => !!record.endDate || record.accessStatus == AccessCardStatusEnum.Lost,
                        onClick: (d: AccessCardUseByBookingPlayerDto) => {
                            setLostCardData(d);
                            setActiveTabKey2('cancelRfId');
                        },
                    },
                ],
                ns: golfAccessCardStore.getNamespaceLocale(),
            }
        );
    const [activeTabKey2, setActiveTabKey2] = useState<string>('issueRfId');

    const onTab2Change = (key: string) => {
        setActiveTabKey2(key);
    };

    const tabListNoTitle = [
        {
            key: 'issueRfId',
            label: t('issueRfId'),

        },
        {
            key: 'cancelRfId',
            label: t('cancelRfId'),
            disabled: !lostCardData
        },
    ];
    const sourceCardTemp = useGolfAccessCardAvailable(AccessCardTypeEnum.Temporary);

    // const ObsInputAccessCard = observer(() => {
    //
    //     return
    // })
    const contentListNoTitle: Record<string, React.ReactNode> = {
        issueRfId: <Form layout="vertical" form={form}
                         initialValues={{}}
        >
            <FloatLabel
                label={t('selectRfidCode')}>
                <Form.Item name='accessCardId'>
                    <InputAccessCard
                        autoFocus
                        datasource={sourceCardTemp}/>
                </Form.Item>
            </FloatLabel>
            <div className='pt-2 text-right'>
                <Button type='primary' onClick={debounce(() => {
                    onIssueRfid()
                }, 250)}>
                    <Space.Compact> <Space><SaveOutlined
                        className="me-1"/></Space>{t('issueRfId')} </Space.Compact>
                </Button>
            </div>
        </Form>,
        cancelRfId: <>
            <Descriptions title="Thông tin thẻ cũ" bordered column={1} size='small'>
                <Descriptions.Item label="Mã thẻ">{lostCardData?.code || '-'}</Descriptions.Item>
                {/*<Descriptions.Item label="UID">{lostCardData?.uid || '-'}</Descriptions.Item>*/}
                <Descriptions.Item label="Ngày bắt đầu">
                    {lostCardData?.startDate ? DateUtil.toFormat(lostCardData?.startDate, "DD/MM/YYYY HH:mm") : '-'}
                </Descriptions.Item>
                {/*<Descriptions.Item label="Loại thẻ">{tEnum(`.${lostCardData?.cardType}`) ?? '-'}</Descriptions.Item>*/}
                <Descriptions.Item label="Trạng thái">{lostCardData?.accessStatus ?? '-'}</Descriptions.Item>
            </Descriptions>
            <Form layout="vertical" form={formCancel}
                  initialValues={{}}>
                <FloatLabel>
                <span className='pt-2'>
                  Chọn thẻ cấp phát bên dưới để hoàn thành việc xác nhận báo mất thẻ
                  và cấp phát thẻ mới
                </span>
                </FloatLabel>
                <FloatLabel label={t("selectNewRfidCode")}>
                    <Form.Item name="accessCardIdNew">
                        <InputAccessCard
                            autoFocus
                            datasource={sourceCardTemp}/>
                    </Form.Item>
                </FloatLabel>
                <FloatLabel label={t("notes")}>
                    <Form.Item name="note">
                        <TextArea rows={2}/>
                    </Form.Item>
                </FloatLabel>
            </Form>
            <div className='pt-2 text-right'>
                <Button type='primary' onClick={debounce(() => {
                    onReturnCardSave()
                }, 250)}>
                    <Space.Compact> <Space><SaveOutlined
                        className="me-1"/></Space>{t('cancelRfId')}</Space.Compact>
                </Button>
            </div>

        </>
    };
    return (
        <div>
            <Row gutter={[16, 8]}>
                <Col span={24}>
                    <Table<AccessCardUseByBookingPlayerDto>
                        size="small"
                        title={() => <Title level={5}>{t('titleTableManagerCard')}</Title>}
                        bordered
                        scroll={{x: 300}}
                        rowKey="id"
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        rowClassName="editable-row"
                        className="mb-5"
                    />
                </Col>
                <Col span={24}>
                    <Card
                        style={{width: '100%'}}
                        tabList={tabListNoTitle}
                        activeTabKey={activeTabKey2}
                        onTabChange={onTab2Change}
                        tabProps={{
                            size: 'small',
                        }}
                    >
                        {contentListNoTitle[activeTabKey2]}
                    </Card>


                </Col>

            </Row>

        </div>
    );
}

export default ManagerCardPlayer;
