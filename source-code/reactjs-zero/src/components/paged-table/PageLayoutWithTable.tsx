import React, {useEffect} from 'react';
import {v4 as uuidv4} from "uuid";
import {HotkeysProvider} from "react-hotkeys-hook";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {Form, Row} from "antd";
import uiUtils from "@ord-core/utils/ui.utils";
import {useWatch} from "antd/es/form/Form";
import {debounce} from "lodash";

interface PageLayoutWithTableProps {
    topActions?: IActionBtn[],
    topActionContent?: React.ReactNode,
    hiddenTopAction?: boolean;
    searchFields: React.ReactNode;
    searchInitData?: any;
    tabCounterStatus?: React.ReactNode;
    tableContent?: React.ReactNode;
    tableStore?: ReturnType<typeof import('@ord-components/paged-table/useTableStoreFactory').createTableStore>;
}

export const PageLayoutWithTable = ({
                                        topActions,
                                        topActionContent,
                                        hiddenTopAction,
                                        tabCounterStatus,
                                        tableContent,
                                        searchFields,
                                        tableStore,
                                        searchInitData
                                    }: PageLayoutWithTableProps) => {
    const hotKeyScopeId = React.useMemo(() => `crudPageScope-${uuidv4()}`, []);
    const [searchFormRef] = Form.useForm();
    const onFinishFormSearch = () => {
        if (tableStore) {
            const values = searchFormRef.getFieldsValue();
            tableStore.getState().setSearchParams({
                ...values
            });
        }
    }
    const extendResetTick_w = useWatch('extendResetTick', searchFormRef);
    useEffect(() => {
        if (extendResetTick_w) {
            searchFormRef.resetFields();
            searchFormRef.submit();
        }
    }, [extendResetTick_w]);
    return (
        <HotkeysProvider initiallyActiveScopes={[hotKeyScopeId]}>
            <div>
                {/* Header */}
                {
                    hiddenTopAction !== true &&
                    <PageTopTitleAndAction>
                        <>
                            {topActionContent}
                            <TopAction topActions={topActions} hotkeyScope={hotKeyScopeId}/>
                        </>
                    </PageTopTitleAndAction>
                }
                <Form form={searchFormRef} className={'crud-search-box'}
                      initialValues={searchInitData}
                      layout='vertical'
                      onFinish={debounce((d) => {
                          onFinishFormSearch()
                      }, 250)}
                      onFinishFailed={() => uiUtils.showCommonValidateForm()}
                >
                    {
                        (searchFields) &&
                        <div className={'ord-container-box'}>
                            <Row gutter={[16, 8]}>
                                {searchFields}
                            </Row>
                            <div hidden>
                                <Form.Item name={'onSearchBeginning'} initialValue={0} noStyle/>
                                <Form.Item hidden name={'hotKeyScopeId'} initialValue={hotKeyScopeId} noStyle/>
                                <Form.Item hidden name={'extendResetTick'} initialValue={hotKeyScopeId} noStyle/>
                            </div>

                        </div>
                    }
                </Form>
                <div className={'ord-container-box ord-crud-list'}>
                    {
                        tabCounterStatus &&
                        <div>
                            {tabCounterStatus}
                        </div>

                    }
                    {/* Table */}
                    {tableContent}
                </div>
            </div>
        </HotkeysProvider>

    );
};
