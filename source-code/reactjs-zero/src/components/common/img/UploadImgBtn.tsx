import {LoadingOutlined, UploadOutlined} from "@ant-design/icons";
import React from "react";
import {useTranslation} from "react-i18next";

export const UploadImgBtn = () => {
    const [t] = useTranslation();
    return <>
        <button style={{border: 0, background: 'none'}} type="button">
            <UploadOutlined style={{fontSize: 30}}/>
            <div style={{marginTop: 8}} className={'text-lg font-bold'}>
                {t('uploadImg')}
            </div>
        </button>
    </>
}
