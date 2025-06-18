import React, {useEffect, useState} from 'react';
import {useStore} from "@ord-store/index";
import {
    Alert,
    Button,
    Col,
    Collapse,
    CollapseProps,
    ConfigProvider,
    Dropdown,
    Empty,
    Form,
    MenuProps,
    Row,
    Space,
    Table,
    Tag,
    theme,
    Typography
} from "antd";
import {TEMPLATE_PRINTER, TemplatePrinterDto, TemplatePrinterGroupDto} from "@api/index.defs";
import {
    CheckOutlined,
    DeleteOutlined,
    DownloadOutlined,
    DownOutlined,
    EditOutlined,
    PaperClipOutlined,
    PlusOutlined,
    StarOutlined
} from "@ant-design/icons";
import {Trans, useTranslation} from "react-i18next";
import UiUtils from "@ord-core/utils/ui.utils";
import {TemplatePrinterService} from "@api/TemplatePrinterService";
import {ItemType} from "antd/es/menu/interface";
import {UploadFileService} from "@api/UploadFileService";
import FileSaver from "file-saver";
import {WordIcon} from "@ord-components/icon/WordIcon";
import {ExcelIcon} from "@ord-components/icon/ExcelIcon";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {debounce} from "lodash";
import Utils from "@ord-core/utils/utils";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {useNavigate} from "react-router-dom";

const {Paragraph} = Typography;
export const getFileTypeByPrinteEnum = (templatePrintEnumId?: TEMPLATE_PRINTER) => {
    switch (templatePrintEnumId) {
        default:
            return '.doc, .docx';
    }
}
const ns = 'template-printer';

function TemplatePrinterHost({}) {
    const {templatePrinter: mainStore, entityModalStore} = useStore();
    const {t} = useTranslation(ns);
    const [data, setData] = useState<TemplatePrinterGroupDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {token} = theme.useToken();
    const navigate = useNavigate();
    useEffect(() => {
        loadData();

    }, []);
    const loadData = () => {
        setIsLoading(true);

        mainStore.getDataList({
            skipCount: 0,
            maxResultCount: 50
        }).then(res => {
            setData(res.items ?? []);
            setIsLoading(false);
        })
    }
    const getItems: () => CollapseProps['items'] = () => data.map((item, index) => {
        return {
            key: index,
            label: <span className='font-bold'>{t('templateName.' + item.staticName)}</span>,
            children: <>
                <PanelContent data={item} itemDefaultByDev={item.itemDefaultByDev}></PanelContent>
            </>,
            style: {
                marginBottom: 16,
                background: "white",
                borderRadius: token.borderRadiusLG,
                border: 'none',
            },
        }
    })
    const PanelContent = (props: {
        data: TemplatePrinterGroupDto,
        itemDefaultByDev?: TemplatePrinterDto
    }) => {
        const {
            details,
            templatePrintEnumId,
            staticName
        } = props?.data;
        const {itemDefaultByDev} = props;
        const [dataSourceFilter, setDataSourceFilter] = useState<TemplatePrinterDto[]>([]);
        const [dataSource, setDataSource] = useState<TemplatePrinterDto[]>([]);
        const [isActiveItemDefaultDev, setIsActiveItemDefaultDev] = useState(false);
        useEffect(() => {
            setDataSourceFilter(details ?? []);
            setDataSource(details ?? [])
        }, [details]);
        const [fromSeach] = Form.useForm();
        const onResetClick = () => {
            fromSeach.resetFields();
            setDataSourceFilter(dataSource);
        }
        useEffect(() => {
            setIsActiveItemDefaultDev(dataSource.findIndex(x => x.isDefault && x.isActived) == -1)
        }, [dataSource])

        const downloadFile = (fileName: string | undefined,
                              documentId: string | undefined, templatePrintEnumId: TEMPLATE_PRINTER) => {
            if (documentId) {
                UiUtils.setBusy()
                UploadFileService.downloadFile({
                    fileId: documentId
                }, {
                    responseType: 'blob',
                }).then(response => {
                    if (response) {
                        FileSaver.saveAs(response, fileName);
                    } else {
                        throw new Error(t(response.data ?? 'excelAlert.errorDownload'));
                    }
                    UiUtils.clearBusy()
                })
            } else {
                UiUtils.setBusy()
                TemplatePrinterService.downloadDefaultSystemFile({
                    enumId: templatePrintEnumId
                }, {
                    responseType: 'blob',
                }).then(response => {
                    if (response) {
                        FileSaver.saveAs(response, fileName);
                    } else {
                        throw new Error(t(response.data ?? 'excelAlert.errorDownload'));
                    }
                    UiUtils.clearBusy()
                })
            }
        }

        const actionBtnTplDev = (key: 'download' | 'allowShopChangeTpl' | 'view') => {
            switch (key) {
                case "download":
                    if (props.itemDefaultByDev && props.itemDefaultByDev.templatePrintEnumId) {
                        downloadFile(props.itemDefaultByDev?.fileName, undefined, props.itemDefaultByDev?.templatePrintEnumId)
                    }
                    break;
                case "allowShopChangeTpl":
                    if (itemDefaultByDev && itemDefaultByDev.templatePrintEnumId) {
                        UiUtils.setBusy()
                        TemplatePrinterService.alowShopChangeTplPrinter({
                            enumId: itemDefaultByDev?.templatePrintEnumId,
                            alow: isActiveItemDefaultDev
                        }).then((res) => {
                            if (isActiveItemDefaultDev) {
                                if (res.data)
                                    dataSource.push(res.data)
                            } else {
                                dataSource.forEach(item => {
                                    item.isDefault = false
                                    item.isActived = false
                                })
                            }
                            setDataSource([...dataSource])

                            UiUtils.clearBusy()
                        })
                    }
                    break;
                case "view":
                    // setOpenView(true);
                    break;
            }
        }
        const onMenuTplDevClick: MenuProps['onClick'] = (e) => {
            actionBtnTplDev(e.key as any)
        };
        return <>
            <Form form={fromSeach} layout={'vertical'}
                  onFinish={debounce((d) => {
                      setDataSourceFilter(dataSource.filter(item => {
                          if (d.filter)
                              return Utils.toLowerCaseNonAccentVietnamese(item.name).indexOf(Utils.toLowerCaseNonAccentVietnamese(d.filter)) > 0
                          else return true;
                      }))
                  }, 250)}>
                <Row gutter={16}>
                    <SearchFilterText onReset={onResetClick} span={10}></SearchFilterText>
                    <Col {...useResponsiveSpan(5)}>
                        <Button color="primary" variant="outlined"
                                onClick={() => {
                                    navigate(`create/${templatePrintEnumId}/${staticName}`)
                                }}
                        >
                            <div>
                                <PlusOutlined></PlusOutlined>
                                {t('actionBtn.add')}</div>
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Alert
                className='mb-2'
                message={<>
                    {itemDefaultByDev && <Dropdown
                        menu={{
                            onClick: onMenuTplDevClick,
                            items: [
                                {
                                    key: 'download',
                                    label: t("actionBtn.download"),
                                    disabled: !itemDefaultByDev
                                },
                                {
                                    key: 'allowShopChangeTpl',
                                    label: isActiveItemDefaultDev ? t("actionBtn.allowShopChangeTpl") : t("actionBtn.notAllowShopChangeTpl"),
                                    disabled: !itemDefaultByDev
                                },
                                {
                                    key: 'view',
                                    label: t("actionBtn.view"),
                                    disabled: !itemDefaultByDev
                                },
                            ]
                        }}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                {!isActiveItemDefaultDev ? <span>{t("statusShopAllowChangeTplPrinter")} </span>
                                    : <span>{t("statusShopNotAllowChangeTplPrinter")} </span>}
                                <DownOutlined/>
                            </Space>
                        </a>
                    </Dropdown>}
                    {!itemDefaultByDev && <div>{t('alertDevNotConfig')}</div>}

                </>}
                type="info"
                closable
            />

            <ConfigProvider renderEmpty={(data) => {
                return dataSource.length == 0 ? <div style={{textAlign: 'center'}}>
                    {/*<SmileOutlined style={{fontSize: 20}}/>*/}
                    <WordIcon></WordIcon>
                    <p>{t('usingSystemTemplate')}</p>
                </div> : <Empty description={t('notFind')} image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
            }}>

                <Table pagination={false}
                       dataSource={dataSourceFilter}
                       rowKey='id'
                       columns={[
                           {
                               title: t("name"),
                               dataIndex: "name",
                               render: (v: string, record) => {

                                   return <>
                                       <div className={!record.isActived ? 'line-through' : ''}>{v}</div>
                                       {record.isDefault ? <Tag className="bg-[#FFEAEE]" color={"#e5ffee"}>
                                           <span className="text-[#3BB54A]"> {t('default')}</span>
                                       </Tag> : ""}
                                       {!record.isActived ?
                                           <Tag className='bg-[#EEE] border-0'>{t('notActive')}</Tag> : ""}
                                   </>
                               }
                           },
                           {
                               title: t("notes"),
                               dataIndex: "notes"

                           },
                           {
                               title: t("actionBtn.download"),
                               dataIndex: "download",
                               align: 'center',
                               width: "150px",
                               render: (v: any, record) => {
                                   return <>
                                       <Button type='link' onClick={() => {
                                           downloadFile(record.fileName, record.documentId, record.templatePrintEnumId ?? 0);
                                       }}>
                                           <span className='text-[#145AFC]'>{t('actionBtn.download')}</span>
                                       </Button>
                                   </>;
                               },
                           },
                           {
                               title: t("action"),
                               dataIndex: "action",
                               align: 'center',
                               width: "200px",
                               render: (v: any, item2, index) => {
                                   type ActionKey =
                                       'download'
                                       | 'setDefault'
                                       | 'remove'
                                       | "view"
                                       | "changeActive"
                                       | "edit";
                                   const items: ItemType[] = [
                                       {
                                           key: 'edit' as ActionKey,
                                           icon: <EditOutlined></EditOutlined>,
                                           label: t("actionBtn.edit"),
                                       },
                                       {
                                           key: 'download' as ActionKey,
                                           icon: <DownloadOutlined></DownloadOutlined>,
                                           label: t("actionBtn.download"),
                                       },
                                       {
                                           key: 'changeActive' as ActionKey,
                                           icon: <CheckOutlined></CheckOutlined>,
                                           // disabled: file.response?.isDefault,
                                           label: item2?.isActived ? t("actionBtn.changeDeActive") : t("actionBtn.changeActive"),
                                       },

                                       {
                                           key: 'setDefault' as ActionKey,
                                           icon: <StarOutlined></StarOutlined>,
                                           disabled: item2?.isDefault,
                                           label: t("actionBtn.setDefault"),
                                       },

                                       {
                                           key: 'remove' as ActionKey,
                                           icon: <DeleteOutlined></DeleteOutlined>,
                                           // disabled: file.response?.isDefault,
                                           danger: true,
                                           label: t("actionBtn.remove"),
                                       },

                                   ];
                                   const actionBtn = (key: ActionKey) => {
                                       switch (key) {
                                           case "edit":
                                               navigate(`update/${item2.templatePrintEnumId}/${item2.id}/${staticName}`)
                                               break;
                                           case "download":
                                               downloadFile(item2.fileName, item2.documentId, item2.templatePrintEnumId ?? 0);
                                               break;
                                           case "setDefault":
                                               if (item2?.id) {
                                                   UiUtils.setBusy();
                                                   TemplatePrinterService.setDefault({
                                                       id: parseInt(item2.id),
                                                       templatePrintEnumId: item2.templatePrintEnumId ?? 0
                                                   }).then(res => {
                                                       if (dataSourceFilter) {
                                                           dataSourceFilter.forEach((itemF, idx) => {
                                                               if (idx == index) {
                                                                   itemF.isDefault = true;
                                                                   itemF.isActived = true;
                                                               } else {
                                                                   itemF.isDefault = false;
                                                               }
                                                           })
                                                           setData([...data])
                                                       }
                                                       UiUtils.clearBusy();
                                                   })

                                               }

                                               break;
                                           case "remove":
                                               UiUtils.showConfirm({
                                                   data: {
                                                       name: item2.name
                                                   },
                                                   title: t('confirmDeleteItemTitle'),
                                                   content: (<Trans ns={ns}
                                                                    i18nKey="confirmDeleteItem"
                                                                    values={item2}
                                                                    components={{
                                                                        italic: <i/>,
                                                                        bold: <strong/>
                                                                    }}></Trans>),
                                                   onOk: (d) => {
                                                       if (item2?.id) {
                                                           UiUtils.setBusy()
                                                           TemplatePrinterService.delete({
                                                               id: parseInt(item2.id)
                                                           }).then(res => {
                                                               if (dataSourceFilter) {
                                                                   dataSourceFilter.splice(index, 1);
                                                                   setData([...data])
                                                               }
                                                               UiUtils.clearBusy();
                                                           })
                                                       }

                                                   }
                                               });


                                               break;
                                           case "view":
                                               break;
                                           case "changeActive":
                                               if (item2?.id) {
                                                   UiUtils.setBusy()
                                                   TemplatePrinterService.changeActive({
                                                       id: parseInt(item2.id)
                                                   }).then(res => {
                                                       if (dataSourceFilter) {
                                                           if (item2.isActived) {
                                                               item2.isActived = false;
                                                               item2.isDefault = false;
                                                           } else {
                                                               item2.isActived = true;
                                                               if (dataSourceFilter.findIndex(
                                                                   f => f.isDefault && f.isActived
                                                               ) === -1) {
                                                                   // Nếu không có default nào thì item hiện tại default
                                                                   item2.isDefault = true;
                                                               }
                                                           }
                                                           setData([...data])
                                                       }

                                                       UiUtils.clearBusy();
                                                   })
                                               }

                                               break;
                                       }
                                   }
                                   const onMenuClick: MenuProps['onClick'] = (e) => {
                                       actionBtn(e.key as ActionKey)
                                   };
                                   return <>
                                       <Dropdown menu={{items, onClick: onMenuClick,}}>
                                           <Button style={{width: 36, height: 36, borderColor: '#5e5a5a'}}
                                                   icon={<IconlyLight type={'Group.svg'}/>}>
                                           </Button>
                                       </Dropdown>
                                   </>;
                               },
                           },
                       ]}
                >
                </Table>
            </ConfigProvider>

        </>
    }
    return (
        <div>
            <PageTopTitleAndAction>
            </PageTopTitleAndAction>

            <Collapse
                expandIconPosition='end'
                className='bg-none'
                bordered={false}
                defaultActiveKey={['0']}
                items={getItems()}
            >
            </Collapse>

            {/*<Row gutter={[16, 16]}>*/}
            {/*    {data.map((item)=>{*/}
            {/*        return  <Col sm={24} md={24} lg={8}>*/}

            {/*            <ItemCardUpload*/}
            {/*                staticName={item.staticName}*/}
            {/*                templatePrintEnumId={item.templatePrintEnumId}*/}
            {/*                itemDefaultByDev={item.itemDefaultByDev}*/}
            {/*                details={item.details ?? []}></ItemCardUpload>*/}
            {/*        </Col>*/}
            {/*    })}*/}

            {/*</Row>*/}
        </div>
    );
}

export const AvatarItem = (props: { fileName: string | undefined }) => {
    const {fileName} = props;
    if (fileName?.endsWith('.docx') || fileName?.endsWith('.doc')) {
        return <WordIcon></WordIcon>
    } else if (fileName?.endsWith('.xlsx') || fileName?.endsWith('.xls')) {
        return <ExcelIcon></ExcelIcon>
    } else
        return <PaperClipOutlined/>;
}
export default TemplatePrinterHost;
