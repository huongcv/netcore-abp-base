import {Button, Modal, Space, Tooltip} from "antd";
import React, {useRef, useState} from "react";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import CheckInForm from "@ord-core/layout/Header/TimeKeeping/CheckInForm";

const EmployeeTimekeeping = (props:{
    buttonType:'button'|'label'}
) => {
    // const [summaryData, setData]
    //     = useState<EmployeeTimekeepingDto>();

    const [open, setOpen] = useState(false);
    const {EmployeeTimekeepingStore: store} =useStore();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [t] = useTranslation('employeeTimekeeping');
    const [isRefresh, setRefresh] = useState(0);
    const childRef = useRef(null);

    const showModal = () => {
        setRefresh(isRefresh+1)
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Space >
            {props.buttonType==='button' &&
                <Tooltip  title={t('timekeeping')}>
                    <Button onClick={showModal} className="btn-other border-0" type="default"
                            icon={<IconlyLight type={'Calendar.svg'}/>} size="middle">

                    </Button>
               </Tooltip>
            }
            {props.buttonType==='label' &&
                <a onClick={showModal} type={'text'}>
                <Space>
                    <IconlyLight style={{width:'16px'}} type={'Calendar.svg'}/> {t('timekeeping')}
                </Space>
            </a>}
            {/*<CheckInForm ref={childRef} isRefresh={isRefresh}/>*/}
            <Modal
                title={t('timekeepingTitle')}
                open={open}
                confirmLoading={confirmLoading}
                width={500}
                animation={false}
                onCancel={handleCancel}
                footer={()=>  <Button className='me-2' onClick={handleCancel}>
                          {t('cancelModal')}



                </Button>}

            >
                <CheckInForm isRefresh={isRefresh} />
            </Modal>
        </Space>
    )
}
export default EmployeeTimekeeping;
