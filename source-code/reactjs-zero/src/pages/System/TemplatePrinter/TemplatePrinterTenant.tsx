import React, {useEffect, useState} from 'react';
import {Trans, useTranslation} from "react-i18next";
import {ShopTemplatePrinterDto} from "@api/index.defs";
import {ShopTemplatePrinterService} from "@api/ShopTemplatePrinterService";
import {
    Button, Col,
    Collapse,
    CollapseProps,
    ConfigProvider,
    Dropdown, Empty,
    Form,
    MenuProps,
    Row,
    Table,
    Tag,
    theme,
    Typography
} from "antd";
import {
    CheckOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined,
    StarOutlined
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import UiUtils from "@ord-core/utils/ui.utils";
import {WordIcon} from "@ord-components/icon/WordIcon";
import {TemplatePrinterService} from "@api/TemplatePrinterService";
import FileSaver from "file-saver";
import {UploadFileService} from "@api/UploadFileService";
import {ItemType} from "antd/es/menu/interface";
import {debounce} from "lodash";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import Utils from "@ord-core/utils/utils";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {TopAction} from "@ord-components/crud/TopAction";

const {Paragraph} = Typography;

const ns = 'template-printer-shop';

function TemplatePrinterTenant({}) {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = () => {
        setIsLoading(true);
        ShopTemplatePrinterService.getListPaging({
            body: {
                skipCount: 0,
                maxResultCount: 100
            }
        }).then(res => {
            setData(res.items ?? []);
            setIsLoading(false);
        })
    }
    const {t} = useTranslation(ns);
    const navigate = useNavigate();
    const downloadFileDefaultFile = (item: ShopTemplatePrinterDto) => {
        if (item?.documentId) {
            UiUtils.setBusy()
            UploadFileService.downloadFile({
                fileId: item?.documentId
            }, {
                responseType: 'blob',
            }).then(response => {
                if (response) {
                    FileSaver.saveAs(response, item?.fileName);
                } else {
                    throw new Error(t(response.data ?? 'excelAlert.errorDownload'));
                }
                UiUtils.clearBusy()
            })
        } else {
            UiUtils.setBusy()
            TemplatePrinterService.downloadDefaultSystemFile({
                enumId: item.templatePrintEnumId ?? 0
            }, {
                responseType: 'blob',
            }).then(response => {
                if (response) {
                    FileSaver.saveAs(response, item?.fileName);
                } else {
                    throw new Error(t(response.data ?? 'excelAlert.errorDownload'));
                }
                UiUtils.clearBusy()
            })
        }
    }
    const {token} = theme.useToken();

    const getItems: () => CollapseProps['items'] = () => data.map((item, index) => {
        return {
            key: index,
            label: <span className='font-bold'>{t('templateName.' + item.staticName)}</span>,
            children: <PanelContent data={item}></PanelContent>,
            style: {
                marginBottom: 16,
                background: "white",
                borderRadius: token.borderRadiusLG,
                border: 'none',
            },
        }
    })
    const PanelContent = (props: {
        data: any
    }) => {
        const {details, itemDefault,
            templatePrintEnumId,
            staticName} = props?.data;
        const [dataSourceFilter, setDataSourceFilter] = useState<ShopTemplatePrinterDto[]>([]);
        const [dataSource, setDataSource] = useState<ShopTemplatePrinterDto[]>([]);
        useEffect(() => {
            setDataSourceFilter(details ?? []);
            setDataSource(details ?? [])
        }, [details]);
        const [fromSeach] = Form.useForm();
        const onResetClick = () => {
            fromSeach.resetFields();
            setDataSourceFilter(dataSource);
        }
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
                                onClick={()=>{
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
            <ConfigProvider renderEmpty={(data) => {
                return dataSource.length ==0 ? <div style={{textAlign: 'center'}}>
                    {/*<SmileOutlined style={{fontSize: 20}}/>*/}
                    <WordIcon></WordIcon>
                    <p>{t('usingSystemTemplate')}</p>
                    <Button type='link' onClick={() => {
                        if (itemDefault)
                            downloadFileDefaultFile(itemDefault);
                    }}>
                        <span className='text-[#145AFC]'>{t('actionBtn.download')}</span>
                    </Button>
                </div>:<Empty description={t('notFind')} image={Empty.PRESENTED_IMAGE_SIMPLE}  />;
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
                                       {record.isDefault ?<Tag className="bg-[#FFEAEE]" color={"#e5ffee"} >
                                           <span className="text-[#3BB54A]"> {t('default')}</span>
                                       </Tag> : ""}
                                       {!record.isActived ? <Tag  className='bg-[#EEE] border-0'>{t('notActive')}</Tag> : ""}
                                   </>
                               }
                           },
                           {
                               title: t("tplType"),
                               dataIndex: "printerType",
                               render: (v: any, record) => {
                                   const plainOptions = [t('tplType.custom'), t('tplType.systemTpl')];
                                   return <>
                                       {record.templatePrintId ? plainOptions[0] : plainOptions[1]}
                                   </>;
                               },
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
                                           downloadFileDefaultFile(record);
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
                                               downloadFileDefaultFile(item2);
                                               break;
                                           case "setDefault":
                                               if (item2?.id) {
                                                   UiUtils.setBusy();
                                                   ShopTemplatePrinterService.setDefault({
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
                                                           ShopTemplatePrinterService.delete({
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
                                                   ShopTemplatePrinterService.changeActive({
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


        </div>
    );
}


export default TemplatePrinterTenant;
