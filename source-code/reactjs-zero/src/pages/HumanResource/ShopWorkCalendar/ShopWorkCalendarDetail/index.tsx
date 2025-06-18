import * as React from "react";
import ListWorkCalendarDetail
    from "@pages/HumanResource/ShopWorkCalendar/ShopWorkCalendarDetail/form/listWorkCalendarDetail";
import { Alert, Col, Modal, Row } from "antd";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import { useStore } from "@ord-store/index";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/lib/form/Form";
import DetailCalendarItemForm
    from "@pages/HumanResource/ShopWorkCalendar/ShopWorkCalendarDetail/form/detailCalendarItemForm";
import UiUtils from "@ord-core/utils/ui.utils";
import { runInAction } from "mobx";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";

const ShopWorkCalendarDetailIndex = () => {

    const { t } = useTranslation('shop-work-calendar');
    const { shopWorkCalendarStore: shopWorkCalendarStore } = useStore()
    const { shopWorkCalendarDetailStore: shopWorkCalendarDetailStore } = useStore()


    const [dataForm] = useForm()
    const save = async () => {

        try {
            const body = shopWorkCalendarDetailStore.dataList;
            UiUtils.setBusy();


            await shopWorkCalendarDetailStore.apiService().updateListCalendarDetail({ body }).then(x => {
                if (x) {
                    UiUtils.showSuccess(t('updateDetailSuccess', { name: shopWorkCalendarStore.itemSelected?.name }));

                    runInAction(() => {
                        shopWorkCalendarStore.refreshGridData().then();
                        shopWorkCalendarDetailStore.setIsEdit(false)
                        shopWorkCalendarStore.setIsShowDetailModal(false);
                    })


                }
            })

        } finally {
            UiUtils.clearBusy();
        }

    }


    useHotkeys('F8', (event) => {
        save();
        event.preventDefault();
    }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true });


    useHotkeys('F10', (event) => {
        shopWorkCalendarStore.setIsShowDetailModal(false);
        shopWorkCalendarStore.setItemSelected(undefined)
        event.preventDefault();
    }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true });


    return (
        <>
            <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
                <Modal
                    width={1200}
                    title={t('titleDetail') + shopWorkCalendarStore.itemSelected?.name}
                    open={shopWorkCalendarStore.isShowDetailModal}

                    onCancel={() => {
                        shopWorkCalendarStore.setIsShowDetailModal(false);
                        shopWorkCalendarStore.setItemSelected(undefined)
                    }}
                    footer={<FooterCrudModal
                        hasAddNewContinue={false}
                        isAddNewContinue={false}
                        onOk={save}
                        onCancel={() => {
                            runInAction(() => {
                                shopWorkCalendarStore.setIsShowDetailModal(false);
                                shopWorkCalendarStore.setItemSelected(undefined)
                                shopWorkCalendarDetailStore.setIsEdit(false);
                            })


                        }}
                    />}
                >
                    <Row gutter={16}>
                        <Col span={16}>
                            <ListWorkCalendarDetail
                                form={dataForm}
                                calendarId={shopWorkCalendarStore.itemSelected?.id} />
                        </Col>

                        <Col span={8}>

                            <DetailCalendarItemForm form={dataForm} />

                        </Col>
                    </Row>

                </Modal>
            </HotkeysProvider>



        </>
    )
}

export default observer(ShopWorkCalendarDetailIndex);
