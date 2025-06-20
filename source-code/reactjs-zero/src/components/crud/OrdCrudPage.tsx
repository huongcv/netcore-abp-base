import {observer} from "mobx-react-lite";
import React, {useEffect} from "react";
import {CommonListStore} from "@ord-core/base/CommonListStore";
import uiUtils from "@ord-core/utils/ui.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {Form, FormInstance, Row, TableColumnsType} from "antd";
import {Trans, useTranslation} from "react-i18next";
import {TableRowSelection} from "antd/es/table/interface";
import {TopAction} from "@ord-components/crud/TopAction";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {useWatch} from "antd/es/form/Form";
import {debounce} from "lodash";
import {HotkeysProvider} from "react-hotkeys-hook";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";

interface IProp {
    searchForm?: (form: FormInstance) => React.ReactNode,
    initSearchFormData?: any,
    searchBtnSpan?: number,
    searchBtnInCenterBottom?: boolean,

    stored: CommonListStore<any>,
    columns: TableColumnsType<any>,
    sttRowWidth?: number,
    rowSelection?: TableRowSelection<any>,
    topActions?: IActionBtn[],
    topActionContent?: React.ReactNode,
    entityForm?: (form: FormInstance) => React.ReactNode,
    entityFormMore?: (form: FormInstance) => {
        afterFormContent?: React.ReactNode,
        formContent?: React.ReactNode,
        beforeFormContent?: React.ReactNode,
    },
    onEntitySavedSuccess?: (entityDto: any) => void,
    hiddenTopAction?: boolean;
    classNameTable?: string;

    contentBetweenSearchAndTable?: React.ReactNode;
    contentTopTable?: React.ReactNode;
    tableRowKey?: string,
    tableSummary?: (data: any) => React.ReactNode;
    tableBordered?: boolean;
    dataSource?: any[],
    onSearchSuccess?: (entityDto: any) => void,
}

export interface IActionBtn {
    title?: 'addNew' | 'exportExcel' | string;
    icon?: React.ReactNode;
    onClick?: () => void;
    permission?: string;
    content?: React.ReactNode;
}


const OrdCrudPage = (prop: IProp) => {
    const {stored, hiddenTopAction} = prop;
    const {t} = useTranslation([prop.stored.getNamespaceLocale() || 'common']);
    const {t: tCommon} = useTranslation(['common']);

    const [searchFormRef] = Form.useForm();
    useEffect(() => {
        if (!!prop.stored.removeRecord) {
            const {removeRecord} = prop.stored;
            UiUtils.showConfirm({
                title: tCommon('confirmDelete'),
                icon: "remove",
                content: (<Trans ns={stored.getNamespaceLocale()}
                                 i18nKey="confirmRemove"
                                 values={removeRecord}
                                 components={{italic: <i/>, bold: <strong/>}}></Trans>),
                onOk: (d) => {
                    stored.removeEntity().then(() => {
                        if (prop.onEntitySavedSuccess) {
                            prop.onEntitySavedSuccess(null);
                        }
                    });
                },
                onCancel: () => {
                    prop.stored.closeRemoveById();
                }
            });
        }

    }, [prop.stored.removeRecord]);
    const extendResetTick = useWatch('extendResetTick', searchFormRef);
    useEffect(() => {
        if (extendResetTick) {
            searchFormRef.resetFields();
            searchFormRef.submit();
        }
    }, [useWatch('extendResetTick', searchFormRef)]);
    useEffect(() => {
        if (stored) {
            stored.setSearchFormRef(searchFormRef);
        }
    }, []);

    // Tạo phạm vi hotkey ngẫu nhiên
    const scopeId = React.useMemo(() => `crudPageScope-${Math.random().toString(36).substring(2, 15)}`, []);

    return (
        <>
            <HotkeysProvider initiallyActiveScopes={[scopeId]}>
                {
                    hiddenTopAction !== true &&
                    <PageTopTitleAndAction>
                        <>
                            {prop?.topActionContent}
                            <TopAction topActions={prop?.topActions} hotkeyScope={scopeId}/>
                        </>
                    </PageTopTitleAndAction>
                }
                <Form form={searchFormRef} className={'crud-search-box'}
                      initialValues={prop?.initSearchFormData}
                      layout='vertical'
                      disabled={stored.disableFormSearch}
                      onFinish={debounce((d) => {
                          stored.searchData(d)
                      }, 250)}
                      onFinishFailed={() => uiUtils.showCommonValidateForm()}>
                    {

                        (prop.searchForm) &&
                        <div className={'ord-container-box'}>
                            <Row gutter={[16, 8]}>
                                {prop.searchForm(searchFormRef)}
                            </Row>
                            <div hidden>
                                <Form.Item name={'onSearchBeginning'} initialValue={0} noStyle/>
                            </div>

                        </div>
                    }
                    {
                        prop?.contentBetweenSearchAndTable
                    }
                </Form>
                <div className={'ord-container-box ord-crud-list' + prop?.classNameTable}>
                    <Form form={searchFormRef} className={'crud-search-box'}
                          initialValues={prop?.initSearchFormData}
                          layout='vertical'
                          onFinish={debounce((d) => {
                              stored.searchData(d)
                              if (prop.onSearchSuccess) {
                                  prop.onSearchSuccess(d)
                              }
                          }, 250)}
                          onFinishFailed={() => uiUtils.showCommonValidateForm()}>
                        {
                            prop.contentTopTable
                        }
                        <Form.Item hidden name={'hotKeyScopeId'} initialValue={scopeId}></Form.Item>
                    </Form>
                    <AntTableWithDataPaged searchForm={searchFormRef}
                                           rowKey={prop?.tableRowKey}
                                           getPageResult={(d) => {
                                               return stored.apiService().getPaged({
                                                   body: {
                                                       ...prop.initSearchFormData,
                                                       ...d.body,
                                                   }
                                               }, {})
                                           }}
                                           dataSource={prop.dataSource}
                                           summary={prop?.tableSummary}
                                           bordered={prop?.tableBordered}

                                           columns={prop.columns}
                                           searchData={stored.searchDataState}
                                           refreshDatasource={stored.refreshDataState}
                                           rowSelection={prop.rowSelection}
                                           onChangePageResult={(d) => {


                                               if (stored) {
                                                   stored.setPageResult(d);
                                               }

                                           }}
                    />
                </div>
                {
                    (!!prop.entityForm || !!prop.entityFormMore) &&
                    <OrdCreateOrUpdateModal stored={prop.stored}
                                            entityFormMore={prop.entityFormMore}
                                            entityForm={prop.entityForm}
                                            hotkeyScope={scopeId}
                                            onSavedSuccess={prop.onEntitySavedSuccess}
                    />
                }

            </HotkeysProvider>

        </>
    );
}
export default observer(OrdCrudPage);
