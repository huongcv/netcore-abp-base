import { AccessCardService } from "@api/AccessCardService";
import { GolfCustomerService } from "@api/GolfCustomerService";
import { AccessCardDto, AssignPartnerAccessCardDto } from "@api/index.defs";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useGolfAccessCardColor } from "@ord-components/forms/select/selectDataSource/golf/useGolfAccessCardColor";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { HotKeyScope } from "@ord-core/AppConst";
import dateUtil from "@ord-core/utils/date.util";
import uiUtils from "@ord-core/utils/ui.utils";
import utils from "@ord-core/utils/utils";
import validateUtils from "@ord-core/utils/validate.utils";
import CustomerStore from "@ord-store/Golf/Customer/customerStateStore";
import PartnerInput from "@pages/AccountantManagement/Shared/forms/PartnerInput";
import { Checkbox, Col, Form, FormInstance, Input, Modal, Row, Spin } from "antd";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { HotkeysProvider } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import InputAccessCard from "@pages/1.Golf/Category/MemberShipCard/InputAccessCard/InputAccessCard";
import {
    useGolfAccessCardAvailable
} from "@ord-components/forms/select/selectDataSource/golf/useGolfAccessCardAvailable";
import {AccessCardTypeEnum} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import Utils from "@ord-core/utils/utils";

export const ModalMemberShipCard = (prop: {
    stored: CustomerStore,
    partnerId?: any
}) => {
    const { t } = useTranslation(['golf-customer']);
    let { updateMemberShipCardModel } = prop.stored;
    const [form] = Form.useForm();
    const [modalMode, setModalMode] = useState<string>();

    useEffect(() => {
        setModalMode(updateMemberShipCardModel.mode)
    }, [updateMemberShipCardModel.visible])

    useEffect(() => {
        console.log(updateMemberShipCardModel.mode, 'mode')
        if (updateMemberShipCardModel.mode = "update") {
            if (updateMemberShipCardModel.entityData?.id) {
                form.setFieldsValue(updateMemberShipCardModel.entityData);
            }

        }
    }, [updateMemberShipCardModel.visible])

    useEffect(() => {
        if (prop.partnerId) {
            form.setFieldValue("partnerId", prop.partnerId)
        }
    }, [prop.partnerId])

    const onOkModal = async () => {
        try {
            uiUtils.setBusy();
            const formValue = await form.validateFields();
            let input: AssignPartnerAccessCardDto = formValue;
            await AccessCardService.updatePartnerAccessCard({ body: input }).then(res => {
                if (res.isSuccessful) {
                    uiUtils.showSuccess(t("updateAccessCardSuccess"));
                    prop.stored.closeCrudMemberShipCardModal(true);
                } else {
                    uiUtils.showError(res.message);
                }
            })
        } catch (error) {
            uiUtils.showCatchError(error)
        } finally {
            uiUtils.clearBusy();
        }
    };

    return (<>
        <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
            {updateMemberShipCardModel.visible && (
                <Modal
                    title={t(('titlePartnerCard.' + modalMode))}
                    open={updateMemberShipCardModel.visible}
                    width={updateMemberShipCardModel.width || 550}
                    maskClosable={false}
                    style={{ top: "30px" }}

                    onCancel={() => prop.stored.closeCrudMemberShipCardModal()}
                    destroyOnClose
                    footer={
                        <FooterCrudModal
                            hiddenOk={modalMode == "viewDetail"}
                            onOk={onOkModal}
                            onCancel={() => prop.stored.closeCrudMemberShipCardModal()}
                        />
                    }
                >
                    <MemberShipCardForm cusForm={form} store={prop.stored}></MemberShipCardForm>
                </Modal>

            )}
        </HotkeysProvider>

    </>);
}
export default observer(ModalMemberShipCard);


export const MemberShipCardForm = observer((prop: {
    cusForm: FormInstance;
    store: CustomerStore
}) => {
    const { t } = useTranslation(['golf-customer']);
    const [accessCardCombo, setAccessCardCombo] = useState<SelectDataSource>();
    const startDate = Form.useWatch("startDate", prop.cusForm);
    const partnerId = Form.useWatch("partnerId", prop.cusForm);
    const [disableForm, setDisableForm] = useState<boolean>(false);
    let accessCardId = prop.cusForm.getFieldValue("accessCardId") ?? null;
    const [accessCardData, setAccessCardData] = useState<AccessCardDto | null>(null);
    const accessCardDatasource = useGolfAccessCardAvailable(AccessCardTypeEnum.Member);

    const disabledAccessCardDatasource = useMemo<SelectDataSource>(() => {
        if (!accessCardData) return { data: [], isPending: false };
        
        return {
            data: [{
                value: accessCardData.id,
                label: <div className='flex w-full'>
                    <strong className='flex-1'>Mã thẻ : {accessCardData.code}</strong>
                    <div className='flex-1 text-green-600 text-right'>Số chíp: {accessCardData.uid}</div>
                </div>,
                disabled: true,
                fts: Utils.toLowerCaseNonAccentVietnamese(accessCardData.accessCode || ''),
                data: accessCardData
            }],
            isPending: false
        };
    }, [accessCardData]);
    
    // useEffect(() => {
    //     if (partnerId) {
    //         getAccessCardCombo();
    //     }
    // }, [partnerId]);
    //
    // const getAccessCardCombo = async () => {
    //     let accessCardId = prop.cusForm.getFieldValue("accessCardId") ?? null;
    //     const result = await GolfCustomerService.getAccessCardAvairable({ body: { cardType: 1, partnerId: partnerId, accessCardId: accessCardId } }).finally(() => { });
    //     setAccessCardCombo({ data: utils.mapCommonSelectOption(result.data || []), isPending: false });
    // };
    

    const changeAccessCard = (option: any) => {
        if (option) {
            prop.cusForm.setFieldValue("accessCardColorId", option.data.accessCardColorId)
        } else {
            prop.cusForm.setFieldValue("accessCardColorId", null)
        }
    }
    useEffect(() => {
        if (prop.store.updateMemberShipCardModel.mode == "update") {
            setDisableForm(true)
        }
    }, [prop.store.updateMemberShipCardModel.visible])

    useEffect(() => {
        if (disableForm && accessCardId) {
            loadAccessCardData(accessCardId);
        }
    }, [disableForm, accessCardId]);

    const loadAccessCardData = async (id: number) => {
        try {
            const data = await AccessCardService.getById({ id });
            setAccessCardData(data);
            console.log(data);
            
        } catch (error) {
            console.error("Failed to load access card data", error);
        }
    };

    return (<>
        <Form form={prop.cusForm} layout={'vertical'}
            onFinish={debounce((d) => {
            }, 250)}>
            <Row gutter={16}>
                <Col span={12} hidden>
                    <Form.Item name='id' >
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("name")}>
                        <Form.Item name='partnerId' rules={[validateUtils.required]}>
                            <PartnerInput disabled
                                          usingqrsearch={false}
                                partner_type={1}></PartnerInput>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("maThe")} required>
                        <Form.Item name="accessCardId" rules={[validateUtils.required]}>
                            <InputAccessCard 
                                autoFocus 
                                datasource={disableForm ? disabledAccessCardDatasource : accessCardDatasource} 
                                disabled={disableForm}
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("hangThe")} >
                        <Form.Item
                            name="accessCardColorId" >
                            <OrdSelect disabled datasource={useGolfAccessCardColor()} placeholder={t('')} allowClear></OrdSelect>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("soLuotChoi")} >
                        <Form.Item
                            name="soLuotChoi" >
                            <Input maxLength={100}  />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("ngayCap")} >
                        <Form.Item name="startDate" >
                            <OrdDateInput></OrdDateInput>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("ngayHetHan")} >
                        <Form.Item name="endDate" >
                            <OrdDateInput disabledDate={(current) => dateUtil.disableBefore(current, startDate)}></OrdDateInput>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col lg={8}>
                    <Form.Item hidden
                        name="isFree"
                        initialValue={true}
                        valuePropName="checked">
                        <Checkbox>{t("isFreeCard")}</Checkbox>
                    </Form.Item>
                </Col>
            </Row>
        </Form>


    </>);
})
