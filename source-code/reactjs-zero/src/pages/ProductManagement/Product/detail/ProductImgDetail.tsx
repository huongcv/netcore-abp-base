import { useState} from "react";
import {Form} from "antd";
import UiUtils from "@ord-core/utils/ui.utils";
import {Trans, useTranslation} from "react-i18next";
import {UploadFileService} from "@api/UploadFileService";
import "./detail.scss";
import {ProductServiceCustom} from "@api/ProductServiceCustom";
import { OrdImgCrop } from "@ord-components/forms/croping-img/OrdImgCrop";

export const ProductImgDetail = (props: {
    fileId: string | undefined;
    productIdHash: string | undefined; 
}) => {
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation("product");
    const formInstance = Form.useFormInstance();
    
    const removeImgInDb = async (): Promise<boolean> => {
        return new Promise((resolve) => {
            UiUtils.showConfirm({
                title: t("confirmRemoveImgProductTitle"),
                content: (
                    <Trans
                        ns={"product"}
                        i18nKey="confirmRemoveImgProduct"
                        components={{ italic: <i />, bold: <strong /> }}
                    />
                ),
                onOk: () => {
                    UiUtils.setBusy();
                    UploadFileService.removeFile({
                        fileId: props.fileId!,
                    })
                        .then(() => {
                            return ProductServiceCustom.updateImgUrl({
                                body: {
                                    imgIndex: 0,
                                    idHash: props.productIdHash,
                                },
                            });
                        })
                        .then(() => {
                            formInstance.setFieldValue("productImg", null);
                            UiUtils.clearBusy();
                            resolve(true); // báo thành công
                        })
                        .catch(() => {
                            UiUtils.clearBusy();
                            resolve(false); // báo lỗi
                        });
                },
                onCancel: () => resolve(false),
            });
        });
    };

    return (
            <Form.Item noStyle name='productImg'>
                <OrdImgCrop removeImgInDb={removeImgInDb} aspect={1}/>
            </Form.Item>
    );
};
