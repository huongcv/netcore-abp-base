import React, {useState} from 'react';
import type {UploadProps} from 'antd';
import {Upload} from 'antd';
import ImgCrop from 'antd-img-crop';
import {UploadImgUtil} from "@ord-core/utils/img.util";
import './product-img-upload.scss';
import {useTranslation} from "react-i18next";
import ImgWithDeleteAction from "@ord-components/common/img/ImgWithDeleteAction";
import {UploadImgBtn} from "@ord-components/common/img/UploadImgBtn";

export const ProductImgUpload = (props: {
    value?: any,
    onChange?: (value: any) => void
}) => {
    const [t] = useTranslation('product');
    const [imageUrl, setImageUrl] = useState<string>();
    const handleChange: UploadProps['onChange'] = (info) => {
        if (props.onChange) {
            props.onChange(info.file.originFileObj);
        }
        UploadImgUtil.getBase64(info.file.originFileObj as any, (url) => {
            setImageUrl(url);
        });
    };
    const removeImg = () => {
        setImageUrl(undefined);
        if (props.onChange) {
            props.onChange(null);
        }
    }
    return (
        <>
            <div className={'relative'}>

                {
                    imageUrl ?
                        <ImgWithDeleteAction onRemove={removeImg} url={imageUrl}>
                            <img src={imageUrl} alt="avatar" style={{width: 130, height: 130}}/>
                        </ImgWithDeleteAction> :
                        <ImgCrop rotationSlider>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={UploadImgUtil.beforeUpload}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                }}

                            >
                                <UploadImgBtn/>
                            </Upload>
                        </ImgCrop>
                }
            </div>


        </>
    );
}
