import React, {useState} from "react";
import {Button, Upload, UploadProps} from "antd";
import {UploadImgUtil} from "@ord-core/utils/img.util";
import {DeleteOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";

export const SignatureImageUpload = (props: {
    signatureId: string|undefined,
    value?: any,
    onChange?: (value: any) => void
}) => {
    const signatureId = props.signatureId ? GetFileUrl(props.signatureId) : undefined;
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<any>(signatureId);

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
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>Upload</div>
        </button>
    );
    const removeImg = () => {
        setImageUrl(undefined);
        if (props.onChange) {
            props.onChange(null);
        }
    }
    return (
        <>
            <ImgCrop rotationSlider>
                <Upload
                    name="signature"
                    listType="picture-card"
                    className="signature-image-upload"
                    showUploadList={false}
                    beforeUpload={UploadImgUtil.beforeUpload}
                    onChange={handleChange}
                    style={{
                        width: 350,
                        height: 350
                    }}
                >
                    {imageUrl ? <img src={imageUrl} alt="No image" style={{width: '100%'}}/> : uploadButton}

                </Upload>
            </ImgCrop>
            {
                imageUrl && <Button className='mt-2' size={'small'}
                                    onClick={removeImg}
                                    danger={true}><DeleteOutlined/></Button>
            }
        </>
    );
}
