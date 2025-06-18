import React, {ImgHTMLAttributes, useEffect, useState} from "react";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";
import { Image } from "antd";

interface Prop extends ImgHTMLAttributes<any> {
    fileId: string | null | undefined,
    preview?: boolean
}

export const ImgFromFileId = (props: Prop) => {
    const {fileId, ...rest} = props;
    const [imageUrl, setImageUrl] = useState<string>();
    useEffect(() => {
        if (props.fileId) {
            setImageUrl(GetFileUrl(props.fileId));
        }else{
            setImageUrl('/images/default-product-image.png');
        }
    }, [props.fileId]);
    return (
        // <img src={imageUrl} {...rest}/>
        <Image
            defaultValue={'/images/default-product-image.png'}
            preview={props.preview} src={imageUrl} {...rest}/>
    )
}
