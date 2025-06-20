import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Input, Row, Space, Upload} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useForm} from "antd/lib/form/Form";
import FormItem from "antd/es/form/FormItem";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {ArrowLeftOutlined, SaveOutlined, UploadOutlined} from "@ant-design/icons";
import {getFileTypeByPrinteEnum} from "@pages/Admin/TemplatePrinter/TemplatePrinterHost";
import {UploadFile} from "antd/es/upload/interface";
import UiUtils from "@ord-core/utils/ui.utils";
import {UploadFileService} from "@api/UploadFileService";
import FileSaver from "file-saver";
import {TEMPLATE_PRINTER, TemplatePrinterDto, TplFileInfo} from "@api/index.defs";
import {TemplatePrinterService} from "@api/TemplatePrinterService";
import {OrdBreadcrumb} from "@ord-components/common/page/PageBreadcrumb";

const ns = 'template-printer';
const CruTemplatePrinterHost = (props: {}) => {
    const {enumId, id, name} = useParams();
    const {t} = useTranslation(ns);
    const navigate = useNavigate();
    // const openModal
    const isCreate = !id
    const [cusForm] = useForm()
    const [fileList, setFileList] = useState<UploadFile<TplFileInfo>[]>([]);
    useEffect(() => {
        if (id) {
            TemplatePrinterService.get({
                id: parseInt(id)
            }).then(res => {
                cusForm.setFieldsValue(res);
                setFileList([{
                    uid: res.fileInfo?.fileId ?? "",
                    name: res.fileInfo?.fileName ?? "",
                    status: 'done',
                    response: res.fileInfo,
                }])
                if (res.fileInfo?.fileId)
                    viewFileByMinIO(res.fileInfo?.absPath ?? "")
                else
                    viewFileInServer(res.templatePrintEnumId ?? 0)
            })
        }

    }, [id]);

    const viewFileByMinIO = (urlMauIn: string) => {
        const base = import.meta.env.VITE_MINIO ?? "https://s3.minio.orenda.vn/vpos";
        // const urlMauIn = "";
        const blobUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${base}/${urlMauIn}?version=${new Date().getTime()}`;
        const elm = document.getElementById("site-frame-mau-in-khach-hang");
        if (elm) {
            elm.innerHTML = "";
            const iframe = document.createElement('iframe');
            iframe.src = blobUrl;
            iframe.style.width = '100%';
            iframe.style.height = 'calc(100vh - 300px)';
            iframe.style.border = 'none';
            elm.append(iframe);
        }
    }
    const viewFileInServer = (d: TEMPLATE_PRINTER) => {
        TemplatePrinterService.downloadDefaultSystemFilePdf({
            enumId: d
        }, {
            responseType: 'blob',
        }).then(response => {
            if (response) {
                viewPdfFileInBlog(response);
            }
        })
    }
    const viewFileInTempCache = (fileCacheId: string) => {
        UploadFileService.getFileFromCacheByPdf({
            fileCacheId: fileCacheId
        }, {
            responseType: 'blob',
        }).then(response => {
            if (response) {
                viewPdfFileInBlog(response);
            }
        })
    }
    const viewPdfFileInBlog = (blob: any) => {
        const elm = document.getElementById("site-frame-mau-in-khach-hang");
        if (elm) {
            elm.innerHTML = "";
            const iframeRef = document.createElement('iframe');
            iframeRef.src = URL.createObjectURL(blob);
            iframeRef.style.width = '100%';
            iframeRef.style.height = 'calc(100vh - 300px)';
            iframeRef.style.border = 'none';
            elm.append(iframeRef);
        }
    }
    const titlePage = () => {
        if (isCreate)
            return t('pageTitleCreate', {
                name: t('templateName.' + name)
            })
        else
            return t('pageTitleUpdate', {
                name: t('templateName.' + name)
            })
    }
    const cruData = async () => {
        try {
            const data = await cusForm.validateFields();
            UiUtils.setBusy();
            try {

                const input: TemplatePrinterDto = isCreate ? {
                    ...data,
                    templatePrintEnumId: enumId
                } : {
                    ...data,
                    templatePrintEnumId: enumId
                }
                console.log("InputInsert", input)
                await TemplatePrinterService.cruTemplate({
                    body: input,
                }).then(result => {
                    if (result) {
                        UiUtils.showSuccess(t(isCreate ? 'addNewSuccess' : 'updateSuccess', {
                            ...data
                        }) as any);
                        cusForm.resetFields();
                        navigate(-1);
                    }

                }).catch((e) => {
                    UiUtils.showError(t(e.response?.data?.error?.message))
                })
            } catch (e) {

            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }
    }
    return (
        <>

            <div
                className="flex flex-wrap items-center justify-between mb-3">
                <OrdBreadcrumb mainTitle={titlePage()}
                               items={[t('pageTitleLvl1'), t('pageTitleLvl2')]}></OrdBreadcrumb>
                <div className="flex items-center">
                    <Space wrap>
                        <Button onClick={() => {
                            navigate(-1);
                        }}>
                            <ArrowLeftOutlined/>{t('actionBtn.back')}
                        </Button>
                        <Button className='ml-2' type='primary' onClick={cruData}>
                            <SaveOutlined></SaveOutlined> {t('actionBtn.save')}
                        </Button>
                    </Space>
                </div>
            </div>

            <Row gutter={8}>
                <Col span={8}>
                    <Card>
                        <Form form={cusForm}>
                            <FormItem hidden name='id'>
                                <Input></Input>
                            </FormItem>
                            <FormItem hidden name='fileName'>
                                <Input></Input>
                            </FormItem>
                            <FormItem hidden name='isActive'>
                                <Input></Input>
                            </FormItem>
                            <FormItem hidden name='isDefault'>
                                <Input></Input>
                            </FormItem>

                            <FloatLabel label={t('name')} required>
                                <FormItem required name='name'
                                          rules={[{required: true, message: t('requiredField')}]}
                                >
                                    <Input></Input>
                                </FormItem>
                            </FloatLabel>
                            <FloatLabel label={t('notes')}>
                                <FormItem required name='notes'>
                                    <Input.TextArea rows={3}></Input.TextArea>
                                </FormItem>
                            </FloatLabel>
                            <Form.Item hidden name='documentId'>
                                <Input></Input>
                            </Form.Item>
                            <Form.Item rules={[{required: true, message: t('requiredFile')}]}
                                       name='documentId'>
                                <Upload
                                    maxCount={1}
                                    beforeUpload={(rcFile) => {
                                        UploadFileService.uploadFileToCache({
                                            file: [rcFile] as any,
                                        }).then(res => {
                                            setFileList([{
                                                uid: res.fileId ?? "-1",
                                                name: res.fileName ?? rcFile.name,
                                                status: 'done',
                                                response: res
                                            }]);
                                            cusForm.setFieldValue('documentId', res.fileId);
                                            cusForm.setFieldValue('fileName', rcFile.name);
                                            viewFileInTempCache(res.fileId ?? "")
                                        })
                                        return false;
                                    }}
                                    onDownload={(file: UploadFile<TplFileInfo>) => {
                                        UiUtils.setBusy()
                                        if (file.response?.fileId) {
                                            UiUtils.setBusy()
                                            UploadFileService.downloadFile({
                                                fileId: file.response?.fileId
                                            }, {
                                                responseType: 'blob',
                                            }).then(response => {
                                                if (response) {
                                                    FileSaver.saveAs(response, file.response?.fileName);
                                                } else {
                                                    throw new Error(t(response.data ?? 'excelAlert.errorDownload'));
                                                }
                                                UiUtils.clearBusy()
                                            })
                                        } else {
                                            UiUtils.setBusy()
                                            TemplatePrinterService.downloadDefaultSystemFile({
                                                enumId: file.response?.templatePrintEnumId ?? 0
                                            }, {
                                                responseType: 'blob',
                                            }).then(response => {
                                                if (response) {
                                                    FileSaver.saveAs(response, file.response?.fileName);
                                                } else {
                                                    throw new Error(t(response.data ?? 'excelAlert.errorDownload'));
                                                }
                                                UiUtils.clearBusy()
                                            })
                                        }
                                    }}
                                    fileList={fileList}
                                    showUploadList={{
                                        showDownloadIcon: true,
                                        showRemoveIcon: false
                                    }}
                                    defaultFileList={fileList}
                                    accept={getFileTypeByPrinteEnum(enumId)}>
                                    <Button type={'default'} title={t('actionBtn.changeFile')}>
                                        <UploadOutlined/> {t('actionBtn.changeFile')}
                                    </Button>
                                </Upload>

                            </Form.Item>

                        </Form>
                    </Card>

                </Col>
                <Col span={16}>
                    <div id='site-frame-mau-in-khach-hang'></div>
                </Col>
            </Row>

        </>
    );
};


export default CruTemplatePrinterHost;
