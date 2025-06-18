import { Avatar, Badge, Button, ConfigProvider, Empty, List, Modal, Popover, Space } from "antd";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import React, { useEffect, useState } from "react";
import { onMessageListener } from "../../../firebase";
import UiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import { NotificationUserDto, NotificationUserPageListOutputDto } from "@api/index.defs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { WordIcon } from "@ord-components/icon/WordIcon";
import "./HeaderRight.scss"
import { CloseOutlined, DollarCircleFilled, DollarCircleOutlined, DollarOutlined, MailOutlined } from "@ant-design/icons";
import dateUtil from "@ord-core/utils/date.util";

export interface IDataMessage_Data {
    notificationId: string,
    notificationName: string,

    [key: string]: any
}

export interface IDataMessage {
    data: IDataMessage_Data,
    from: string,
    messageId: string,
    notification: {
        title: string,
        body: string
    }
}

interface NotificationProps {
    className?: string;
}

const Notifications = (props: NotificationProps) => {
    const { notificationStore, sessionStore } = useStore();
    const { t } = useTranslation(notificationStore.getNamespaceLocale());
    const [dataSource, setDataSource] = useState<NotificationUserDto[]>([])
    const [count, setCount] = useState<number>(0)
    const [popOpen, setPopOpen] = useState<boolean>(false)
    const [data, setData] = useState<NotificationUserDto>();
    const [open, setOpen] = useState(false);


    useEffect(() => {
        if (sessionStore.isLogined) {
            loadData()
        }

    }, [sessionStore.isLogined]);

    useEffect(() => {
        const unsubscribe = onMessageListener((payload) => {
            console.log("New notification:", payload);
            UiUtils.showInfo(
                <>
                    <strong>{payload.notification?.title}</strong>
                    <p>{payload.notification?.body}</p>
                </>
            );
            loadData();
        });
        return () => unsubscribe();
    }, []);

    const loadData = () => {
        notificationStore.apiService().getPaged({
            body: {
                skipCount: 0,
                maxResultCount: 5
            }
        }, {}).then(res => {
            setDataSource(res.items ?? []);
            setCount((res as NotificationUserPageListOutputDto).totalNotRead ?? 0)
        })
    }
    const navigate = useNavigate();
    const contentPop = (
        <ConfigProvider renderEmpty={(data) => {
            return <div style={{ textAlign: 'center' }}>
                <Empty description={t('notNotification')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        }}>
            <List
                className="notifications"
                style={{ width: '320px' }}
                header={<strong>{t('notifications')}</strong>}
                footer={<div className='flex justify-around'>
                    <Button onClick={() => {

                        setPopOpen(false);
                        navigate('/app/notification')
                    }} type={'default'}>{t('list')}</Button>
                    <Button
                        disabled={dataSource.length == 0}
                        onClick={() => {
                            notificationStore.setAllAsRead().then(() => {
                                loadData();
                            })
                        }}
                        type={'default'}>{t('setAllAsRead')}</Button>
                </div>}
                dataSource={dataSource}
                renderItem={(item, index) => (
                    <List.Item
                        onClick={() => {
                            setData(item);
                            setOpen(true);
                            setPopOpen(false);

                            notificationStore.setAsRead(item).then(() => {
                                loadData();
                            });
                        }}
                        className="cursor-pointer"
                        actions={[
                            <>
                                {!item.state && <Badge color="red" />}
                            </>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={
                                item?.content?.notificationName === "TingeeNotification" ? (
                                    <DollarCircleOutlined style={{ fontSize: '22px' }} />
                                ) : (
                                    <MailOutlined style={{ fontSize: '22px' }} />
                                )
                            }
                            title={<div>{item.content?.title}</div>}
                            description={item.content?.body}
                        />
                    </List.Item>
                )}
            />
        </ConfigProvider>

    );
    const handleOpenChange = (newOpen: boolean) => {
        setPopOpen(newOpen);
    };

    return (
        <>
            <div className={props.className ?? 'mr-1'}>
                <Badge count={count} offset={props.className ? [1, 2] : [1, 20]}>
                    <Popover
                        open={popOpen}
                        trigger={['click']}
                        onOpenChange={handleOpenChange}
                        arrow={false}
                        placement="topLeft" content={contentPop}>
                        <Button className={'btn-other border-0'} icon={<IconlyLight type={'Notification.svg'} />}></Button>
                    </Popover>
                </Badge>
            </div>
            <Modal
                title={t('notification')}
                open={open}
                width={600}
                onCancel={() => setOpen(false)}
                onClose={() => setOpen(false)}
                footer={
                    <Button className='me-2' onClick={() => setOpen(false)}>
                        <Space.Compact><Space><CloseOutlined className="me-1" /></Space>{t('cancelModal')} (F10)
                        </Space.Compact>
                    </Button>
                }>
                <div>
                    <p className={'font-semibold'} style={{ fontSize: '25px' }}>{data?.content?.title}</p>
                    <p style={{
                        color: 'GrayText',
                        fontSize: '13px',
                        margin: '6px 0 6px'
                    }}>{t('Ngày gửi:')} {dateUtil.showWithFormat(data?.creationTime, 'dd/MM/yyyy HH:mm')}</p>
                    <span>{data?.content?.body}</span>
                </div>

            </Modal>
        </>
    )
}
export default Notifications;
