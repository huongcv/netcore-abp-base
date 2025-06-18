import { ArrowLeftOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { ShopTemplatePrinterDto, TEMPLATE_PRINTER, TplFileInfo } from "@api/index.defs";
import { ShopTemplatePrinterService } from "@api/ShopTemplatePrinterService";
import { TemplatePrinterService } from "@api/TemplatePrinterService";
import { UploadFileService } from "@api/UploadFileService";
import { OrdBreadcrumb } from "@ord-components/common/page/PageBreadcrumb";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect, { IOrdSelectOption } from "@ord-components/forms/select/OrdSelect";
import { useSelectTemplatePrinter } from "@ord-components/forms/select/selectDataSource/useSelectTemplatePrinter";
import { useSelectTemplatePrintTypeEnum } from "@ord-components/forms/select/selectDataSource/useSelectTemplatePrintTypeEnum";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import UiUtils from "@ord-core/utils/ui.utils";
import { getFileTypeByPrinteEnum } from "@pages/Admin/TemplatePrinter/TemplatePrinterHost";
import { Button, Card, Checkbox, Col, Form, Input, Radio, Row, Space, Upload } from "antd";
import { UploadFile } from "antd/es/upload/interface";
import { useForm } from "antd/lib/form/Form";
import FileSaver from "file-saver";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const ns = 'template-printer-shop';
const CruTemplatePrinterTenantV2 = (props: {}) => {
    const { id } = useParams();
    const { t } = useTranslation(ns);
    const navigate = useNavigate();
    // const openModal
    const isCreate = !id;
    const [form] = useForm();
    const [fileList, setFileList] = useState<UploadFile<TplFileInfo>[]>([]);
    let enumId = Form.useWatch('templatePrintEnumId', form);
    const focusRef = useAutoFocus();

    useEffect(() => {
        if (id) {
            ShopTemplatePrinterService.get({
                id: parseInt(id)
            }).then(res => {
                form.setFieldsValue(res);
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
                if (res.templatePrintId == null) {
                    form.setFieldValue('tplType', plainOptions[0])
                    setIsShowTplPrinterId(true)
                } else {
                    form.setFieldValue('tplType', plainOptions[1]);
                    setIsShowTplPrinterId(false)
                }
            })
        } else {
            form.setFieldValue('tplType', plainOptions[0])
            form.setFieldValue('isDefault', true)
            setIsShowTplPrinterId(true)
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
            return t('titleCreate')
        else
            return t('titleUpdate')
    }
    const cruData = async () => {
        try {
            const data = await form.validateFields();
            UiUtils.setBusy();
            try {

                const input: ShopTemplatePrinterDto = isCreate ? {
                    ...data,
                    templatePrintEnumId: enumId
                } : {
                    ...data,
                    templatePrintEnumId: enumId
                }
                await ShopTemplatePrinterService.cruShopTemplate({
                    body: input,
                }).then(result => {
                    if (result) {
                        UiUtils.showSuccess(t(isCreate ? 'addNewSuccess' : 'updateSuccess', {
                            ...data
                        }) as any);
                        form.resetFields();
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
    const plainOptions = [t('tplType.custom'), t('tplType.systemTpl')];
    const [isShowTplPrinterId, setIsShowTplPrinterId] = useState<boolean>(false);

    const lstTemplatePrinter = useSelectTemplatePrinter(parseInt(enumId ?? "0"))

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
                            <ArrowLeftOutlined />{t('actionBtn.back')}
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
                        <Form form={form}>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Form.Item name='tplType'
                                        className='pt-2.5'
                                        rules={[{ required: !isShowTplPrinterId, message: t('requiredField') }]}
                                    >
                                        <Radio.Group

                                            // defaultValue={false}
                                            options={plainOptions} onChange={(d) => {
                                                const isCustom = d.target.value === plainOptions[0];
                                                if (isCustom) {
                                                    form.setFieldValue('templatePrintId', undefined);
                                                    form.setFieldValue("documentId", undefined)
                                                    setFileList([])
                                                }
                                                setIsShowTplPrinterId(isCustom)
                                            }} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <FloatLabel label={t('tplType')} required>
                                        <Form.Item required name='templatePrintEnumId'>
                                            <OrdSelect datasource={useSelectTemplatePrintTypeEnum()} />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={24} hidden={isShowTplPrinterId}>
                                    <FloatLabel label={t('templatePrintId')} required>
                                        <Form.Item name='templatePrintId'
                                            rules={[{ required: !isShowTplPrinterId, message: t('requiredField') }]}
                                        >
                                            <OrdSelect
                                                onChange={(val, op: IOrdSelectOption) => {
                                                    const data = op.data as TplFileInfo;
                                                    if (data.fileId)
                                                        viewFileByMinIO(data.absPath ?? "")
                                                    else
                                                        viewFileInServer(data?.templatePrintEnumId ?? 0)
                                                    form.setFieldValue('name', data.name);
                                                    form.setFieldValue('fileName', data.fileName);
                                                    form.setFieldValue("documentId", data.fileId)
                                                    setFileList([{
                                                        name: op.data.fileName,
                                                        uid: data.fileId ?? "-1",
                                                        status: 'done',
                                                        response: data
                                                    }])
                                                }}
                                                datasource={lstTemplatePrinter}></OrdSelect>
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={24}>
                                    <FloatLabel label={t('name')} required>
                                        <Form.Item required name='name'
                                            rules={[{ required: true, message: t('requiredField') }]}
                                        >
                                            <Input ref={focusRef}></Input>
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={24}>
                                    <FloatLabel label={t('notes')}>
                                        <Form.Item name='notes'>
                                            <Input.TextArea rows={3}></Input.TextArea>
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name='isDefault' valuePropName="checked" initialValue={true}>
                                        <Checkbox>{t('isDefault')}</Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item rules={[{ required: isShowTplPrinterId, message: t('requiredFile') }]}
                                        name='documentId'>
                                        <Upload
                                            disabled={!isShowTplPrinterId}
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
                                                    form.setFieldValue('documentId', res.fileId);
                                                    form.setFieldValue('fileName', rcFile.name);
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
                                            <Button
                                                hidden={Form.useWatch('tplType', form) === plainOptions[1]}
                                                type={'default'} title={t('actionBtn.changeFile')}>
                                                <UploadOutlined /> {t('actionBtn.changeFile')}
                                            </Button>
                                        </Upload>

                                    </Form.Item>
                                </Col>
                            </Row>

                            <div hidden>
                                <Form.Item hidden name='isActive'>
                                    <Input></Input>
                                </Form.Item>
                                <Form.Item hidden name='fileName'>
                                    <Input></Input>
                                </Form.Item>
                                <Form.Item name='documentId'>
                                    <Input></Input>
                                </Form.Item>
                                <Form.Item name='id'>
                                    <Input></Input>
                                </Form.Item>
                            </div>
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

export default CruTemplatePrinterTenantV2;
