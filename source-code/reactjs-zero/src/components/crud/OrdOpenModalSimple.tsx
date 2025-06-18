// import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
// import {Form, FormInstance, Modal} from "antd";
// import React, {useEffect, useState} from "react";
// import {CommonListStore} from "@ord-core/base/CommonListStore";
// import {useTranslation} from "react-i18next";
// import {observer} from "mobx-react-lite";
//
// const OrdOpenModalSimple = (prop: {
//     stored: CommonListStore<any>,
//     children?: () => React.ReactNode,
// }) => {
//     const {stored} = prop;
//     const {createOrUpdateModal} = prop.stored;
//     const {t} = useTranslation([prop.stored.getNamespaceLocale() || 'common']);
//     const [isAddNewContinue, setIsAddNewContinue] = useState(false);
//     const closeModalCrud = () => {
//         prop.stored.closeModal();
//         // entityFormRef.resetFields();
//     }
//     const onOkModal = () => {
//         // prop.onOkClick();
//     }
//     // useEffect(() => {
//     //
//     //     // const {stored} = prop;
//     //     // const {visible, entityData} = stored.createOrUpdateModal;
//     //     // if (entityFormRef) {
//     //     //     if (entityData) {
//     //     //         entityFormRef.setFieldsValue(entityData);
//     //     //     }
//     //     // }
//     // }, [prop.stored.createOrUpdateModal.visible, prop.stored.createOrUpdateModal.entityData])
//     return (
//         <>
//             {
//                 createOrUpdateModal.visible &&
//                 <Modal title={t(('title.' + createOrUpdateModal!.mode || 'createOrUpdateModal'), {
//                     ...createOrUpdateModal!.entityData
//                 }) as any}
//                        open={createOrUpdateModal.visible}
//                        width={createOrUpdateModal.width || 550}
//                        maskClosable={false}
//                        style={{top: '30px'}}
//                        onCancel={() => prop.stored.closeModal()}
//                        destroyOnClose
//                        footer={<FooterCrudModal
//                            hasAddNewContinue={prop.stored.createOrUpdateModal.mode === 'addNew'}
//                            isAddNewContinue={isAddNewContinue}
//                            isAddNewContinueChange={(v) => setIsAddNewContinue(v)}
//                            hiddenOk={prop.stored.createOrUpdateModal.mode === 'viewDetail'}
//                            onOk={onOkModal} onCancel={() => prop.stored.closeModal()}/>}
//                 >
//                     {prop.children ? prop.children() : ''}
//                 </Modal>}
//         </>
//     );
// }
// export default observer(OrdOpenModalSimple);
// Tam Bỏ
