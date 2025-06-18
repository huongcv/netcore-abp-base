import {Button, Modal, Image} from "antd";
import {DeleteIcon} from "@ord-components/icon/DeleteIcon";
import React, { useEffect, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";
import "../../../pages/ProductManagement/Product/detail/detail.scss"

interface Props {
    children: React.ReactNode,
    onRemove: () => void,
    url?: string | null | undefined,
}

const ImgWithDeleteAction = (props: Props) => {
    const {children, onRemove, url} = props;
    // const [imageUrl, setImageUrl] = useState<string>();
    const [previewVisible, setPreviewVisible] = useState(false);

    // useEffect(() => {
    //     if (fileId) {
    //         setImageUrl(GetFileUrl(fileId));
    //     }
    // }, [fileId]);

    return <>
        <div className="relative group product-img">
            {children}
            <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
            >
                <Image
                    src={url??""}
                    className="hidden"
                    preview={{ visible: previewVisible, onVisibleChange: setPreviewVisible }}
                />
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => setPreviewVisible(true)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-blue-500 hover:text-white transition-colors mr-2"
                />
                <Button icon={<DeleteIcon/>} onClick={onRemove}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors">
                </Button>

            </div>
        </div>
    </>;
}
export default ImgWithDeleteAction;
