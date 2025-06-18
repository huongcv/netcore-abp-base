import React from 'react';
import {Form, Modal} from "antd";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {
    useSelectGolfUserBlockType
} from "@ord-components/forms/select/selectDataSource/golf/useSelectGolfUserBlockType";
import TextArea from "antd/es/input/TextArea";
import {GolfBookingService} from "@api/GolfBookingService";
import {NewUserBlockDetailInputDto} from "@api/index.defs";
import {uniq} from "lodash";
import UiUtils from "@ord-core/utils/ui.utils";
import {observer} from "mobx-react-lite";
import ValidateUtils from "@ord-core/utils/validate.utils";

UserBlockModal.propTypes = {};

function UserBlockModal(props: {

}) {
    const {
        golfBookingStore: mainStore,
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const [form] = Form.useForm();
    const onOkModal =  ()=>{
        const selectedData = mainStore.selectedCells;
        const details: NewUserBlockDetailInputDto[] = [];
        const lstBoardId : number[] = [];
         Object.entries(selectedData)
            .forEach(([key, value]) => {
                lstBoardId.push(value.boardIdx);
                value.data?.listSlot?.forEach((item) => {
                    details.push({
                        courseId: value.data.courseId,
                        playerNo: item.playerNo,
                        playDate: value.data.playDate,
                        startTime: value.data.startTime,
                    });
                })

            })
        form.validateFields().then((values) => {
            GolfBookingService.newUserBlock({
                body:{
                    blockType: values.blockType,
                    note: values.note,
                    details: details
                }
            }).then(res=>{
                if(res.isSuccessful){
                    uniq(lstBoardId).forEach(boardId => {
                        mainStore.refreshTeeTimeData(boardId)
                    })
                    UiUtils.showSuccess(t("userBlock.success"));
                    mainStore.closeUserBlockModal()
                }else{
                    UiUtils.showError(res.message);
                }
            }, ()=>{
                UiUtils.showError(t("userBlock.error"));
            })

        }).catch((errorInfo) => {
            console.log('Validate Failed:', errorInfo);
        });
    }
    return (
        <Modal
            title={t("userBlock.title")}
            open={mainStore.userBlockModal.visible}
            onOk={() => {
                onOkModal()
            }}
            onCancel={()=>{
                mainStore.closeUserBlockModal()
            }}
        >
            <Form layout="vertical" form={form}
                  initialValues={{}}
            >
                <FloatLabel label={t('blockType')} required>
                    <Form.Item
                        rules={[ValidateUtils.required]}
                        name="blockType"
                        initialValue={2}
                    >
                        <OrdSelect allowClear={false} datasource={useSelectGolfUserBlockType()}></OrdSelect>
                    </Form.Item>
                </FloatLabel>
                <FloatLabel label={t('note')} >
                    <Form.Item
                        name="note"
                    >
                        <TextArea rows={2}></TextArea>
                    </Form.Item>
                </FloatLabel>
            </Form>

        </Modal>
    );
}

export default observer(UserBlockModal);
