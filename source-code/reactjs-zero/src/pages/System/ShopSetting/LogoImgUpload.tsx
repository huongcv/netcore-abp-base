import React, {useEffect, useState} from 'react';
import {DeleteOutlined, LoadingOutlined, UploadOutlined} from '@ant-design/icons';
import {Button, message, Upload, UploadProps} from 'antd';
import ImgCrop from 'antd-img-crop';
import {UploadImgUtil} from "@ord-core/utils/img.util";
import './avatar-img-upload.scss';
import {useTranslation} from "react-i18next";
import {ShopService} from "@api/ShopService";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";

export const LogoImgUpload = (props: {
    value?: any,
    onChange?: (value: any) => void,
    shopId: number,
    isMain?: boolean,
}) => {
    const [t] = useTranslation('shop-setting');
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const handleChange: UploadProps['onChange'] = (info) => {
        if (props.onChange) {
            props.onChange(info.file.originFileObj);
        }
        UploadImgUtil.getBase64(info.file.originFileObj as any, (url) => {
            setLoading(false);
            setImageUrl(url);
        });
    };
    const uploadButton = (
        <button style={{border: 0, background: 'none'}} type="button">
            {loading ? <LoadingOutlined style={{fontSize: 30}}/> : <UploadOutlined style={{fontSize: 30}}/>}
            <div style={{marginTop: 8}} className={'text-lg font-bold'}>
                {t('uploadImgLogo')}
            </div>
        </button>

    );
    const removeImg = () => {
        setImageUrl(undefined);
        if (props.onChange) {
            props.onChange(null);
        }
    }
    useEffect(() => {
        if (props.value)
            setImageUrl(GetFileUrl(props.value))
        else{
            setImageUrl(undefined)
        }
    }, [props.value]);
    const PartnerClass = (prop: {}) => {
        if (props.isMain) {
            return <div className='text-center rounded-md w-[120px] h-[26px]'
                        style={{
                            background: 'linear-gradient(303deg, #E0A100 -26.73%, #FFC741 21.09%, #F18308 109.91%)',
                            margin: '-17px auto',
                            position: 'absolute',
                            left: 'calc(50% - 60px)'
                        }}>
                <div className='text-white font-bold  bottom-0'>{t('isMain')}</div>
            </div>
        }
        return <></>
    }
    return (
        <>
            <div className={'relative'}>
                <ImgCrop rotationSlider cropShape='round'>
                    <Upload
                        name="avatar"
                        listType="picture-circle"
                        className="logo-shop-uploader"
                        showUploadList={false}
                        maxCount={1}
                        customRequest={()=>{
                           return true;
                        }}
                        beforeUpload={(rcFile) => {
                            const isJpgOrPng = rcFile.type === 'image/jpeg' || rcFile.type === 'image/png';
                            if (!isJpgOrPng) {
                                message.error('You can only upload JPG/PNG file!');
                                return false;
                            }
                            const isLt2M = rcFile.size / 1024 / 1024 < 2;
                            if (!isLt2M) {
                                message.error('Image must smaller than 2MB!');
                                return false;
                            }
                            return ShopService.updateLogo({
                                files: [rcFile] as any,
                                shopId: props.shopId
                            }).then(res => {
                                if (res.isSuccessful && res.data) {
                                    if (props.onChange) {
                                        props.onChange(res.data.fileId);
                                    }
                                    UploadImgUtil.getBase64(rcFile, (url) => {
                                        setLoading(false);
                                        setImageUrl(url);
                                    });
                                }
                            })
                        }}
                        // onChange={handleChange}
                        style={{
                            width: '100%',
                        }}
                    >
                        {imageUrl ?
                            <img src={imageUrl} alt="avatar" style={{width: 130, height: 130, borderRadius: '100%'}}/>
                            : uploadButton}
                    </Upload>

                </ImgCrop>
                {
                    imageUrl && <Button className='mt-2 btn-remove-img-upload' size={'small'}
                                        onClick={removeImg}
                                        danger={true}><DeleteOutlined/></Button>
                }
                <PartnerClass></PartnerClass>
            </div>


        </>
    )
        ;
}
