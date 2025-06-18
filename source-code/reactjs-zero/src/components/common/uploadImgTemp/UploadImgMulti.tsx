import React, {useEffect, useState} from 'react';
import {message, Upload, UploadProps} from "antd";
import {UploadFileService} from "@api/UploadFileService";
import {UploadImgBtn} from "@ord-components/common/img/UploadImgBtn";

import {FileUploadDto} from "@api/index.defs";
import {UploadFile} from "antd/es/upload/interface";
import {UploadProgressEvent, UploadRequestError, UploadRequestFile} from "rc-upload/lib/interface";
import {set} from "lodash";

const UploadImgMulti = (props: {
    isValueJson?: boolean
    blobContainerPath: string,
    value?: string | string[],
    onChange?: (value: any) => void,
}) => {
    const [defaultList, setDefaultList] = useState<Array<UploadFile<string>>>([]);
    useEffect(() => {
        if (props.value) {
            if (props.isValueJson) {
                setDefaultList(JSON.parse(props.value as string).map((x: any) => {
                    return {
                        uid: x,
                        name: x,
                        status: 'done',
                    }
                }));
            } else {
                setDefaultList((props.value as string[]).map((x: any) => {
                    return {
                        uid: x,
                        name: x,
                        status: 'done',
                    } as any
                }));
            }
        }
    }, [props.value]);
    const handleChange: UploadProps['onChange'] = (info) => {
        if (props.onChange) {
            console.log("info", info);
            if (props.isValueJson) {
                // @ts-ignore
                const data = JSON.stringify(info.fileList.map(x => x.uid));
                props.onChange(data);
            } else {
                // @ts-ignore
                props.onChange(info.fileList.map(x => x.uid));
            }
        }
    };
    const customRequest = async (options: {
        onProgress: (event: UploadProgressEvent, file?: UploadRequestFile) => void;
        onError: (event: any, body?: any) => void;
        onSuccess: (body: any, file: any) => void;
        file: UploadFile;
    }) => {
        const {onSuccess, onError, file} = options;

        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/x-icon';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG/ICO file!');
            onError(new Error('You can only upload JPG/PNG/ICO file!'));
            return;
        }

        // @ts-ignore
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            onError(new Error('Image must smaller than 2MB!'));
            return;
        }
        try {
            const response = await UploadFileService.upload({
                // @ts-ignore
                files: [file],
                blobContainerPath: props.blobContainerPath,
            });
            onSuccess(response[0], file);
        } catch (error) {
            onError(error);
        }
    };
    const handleChange2 = () => {
        if (props.onChange) {
            if (props.isValueJson) {
                props.onChange(JSON.stringify(defaultList.map(x => x.response)));
            } else {
                props.onChange(defaultList.map(x => x.response));
            }
        }
    };
    // Xoá file khỏi danh sách
    const handleRemove = (file: UploadFile) => {
        const updatedFileList = defaultList.filter((item) => item.uid !== file.uid);
        setDefaultList(updatedFileList);
        handleChange2(); // Cập nhật Form
    };
    return (
        <div>
            <Upload
                showUploadList={true}
                fileList={defaultList}
                multiple={true}
                // @ts-ignore
                customRequest={customRequest}
                onChange={handleChange}
                style={{
                    width: '100%',
                }}
            >
                <UploadImgBtn/>
            </Upload>
        </div>
    );
};

UploadImgMulti.propTypes = {};

export default UploadImgMulti;