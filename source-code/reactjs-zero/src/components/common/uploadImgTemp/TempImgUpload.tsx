import React, {useEffect, useState} from 'react';
import {message, UploadProps} from 'antd';
import {Upload} from 'antd';
import ImgCrop from 'antd-img-crop';
import {UploadImgUtil} from "@ord-core/utils/img.util";
import './product-img-upload.scss';
import {useTranslation} from "react-i18next";
import ImgWithDeleteAction from "@ord-components/common/img/ImgWithDeleteAction";
import {UploadImgBtn} from "@ord-components/common/img/UploadImgBtn";
import {UploadFileService} from "@api/UploadFileService";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";

// Sẽ phải tối ưu lại. vấn đề liên quan đến xóa , update ảnh khi đã upload lên server
export const TempImgUpload = (props: {
    blobContainerPath: string,
    value?: any,
    onChange?: (value: any) => void
    usingCrop?: boolean
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
    useEffect(() => {
        if (props.value) {
            setImageUrl(GetFileUrl(props.value));
        } else {
            // setImageUrl('/images/default-product-image.png');
        }
    }, [props.value]);
    return (
        <>
            <div className={'relative'}>

                {
                    imageUrl ?
                        <ImgWithDeleteAction onRemove={removeImg} url={imageUrl}>
                            <img src={imageUrl} alt="avatar" style={{width: 130, height: 130}}/>
                        </ImgWithDeleteAction> :
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            customRequest={() => {
                                return null;
                            }}
                            onChange={handleChange}
                            beforeUpload={(rcFile) => {
                                const isJpgOrPng = rcFile.type === 'image/jpeg' || rcFile.type === 'image/png' || rcFile.type ==='image/x-icon';
                                if (!isJpgOrPng) {
                                    message.error('You can only upload JPG/PNG/ICO file!');
                                    return false;
                                }
                                const isLt2M = rcFile.size / 1024 / 1024 < 2;
                                if (!isLt2M) {
                                    message.error('Image must smaller than 2MB!');
                                    return false;
                                }
                                UploadFileService.upload({
                                    files: [rcFile] as any,
                                    blobContainerPath: props.blobContainerPath
                                    // getBytes: false
                                }).then(res => {
                                    if (props.onChange) {
                                        props.onChange(res[0].fileId);
                                    }
                                    // UploadImgUtil.getBase64(rcFile, (url) => {
                                    //     setImageUrl(url);
                                    // });
                                })
                            }}
                            style={{
                                width: '100%',
                            }}
                        >
                            <UploadImgBtn/>
                        </Upload>

                }
            </div>


        </>
    );
}
