import React, {useEffect, useMemo} from 'react';
import {v4 as uuidv4} from "uuid";
import {HotkeysProvider} from "react-hotkeys-hook";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {Form, Row} from "antd";
import {useWatch} from "antd/es/form/Form";
import {debounce} from "lodash";

interface PageLayoutWithTableProps {
    topActions?: IActionBtn[],
    topActionContent?: React.ReactNode,
    hiddenTopAction?: boolean;
    searchFields: React.ReactNode;
    searchInitData?: any;
    children: React.ReactNode;
    tableStore?: ReturnType<typeof import('@ord-components/paged-table/useTableStoreFactory').createTableStore>;
}

export const PageLayoutWithTable = ({
                                        topActions,
                                        topActionContent,
                                        hiddenTopAction,
                                        children,
                                        searchFields,
                                        tableStore,
                                        searchInitData
                                    }: PageLayoutWithTableProps) => {
    const hotKeyScopeId = useMemo(() => `crudPageScope-${uuidv4()}`, []);
    const [searchFormRef] = Form.useForm();
    const {setSearchParams} = tableStore?.() || {};
    const extendResetTick_w = useWatch('extendResetTick', searchFormRef);

    const onFinishFormSearch = () => {
        if (setSearchParams) {
            const values = searchFormRef.getFieldsValue();
            setSearchParams(values);
        }
    }
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
                >
                    {
                        (searchFields) &&
                        <div className={'ord-container-box'}>
                            <Row gutter={[16, 8]}>
                                {searchFields}
                            </Row>
                            <div hidden>
                                <Form.Item hidden name={'hotKeyScopeId'} initialValue={hotKeyScopeId} noStyle/>
                                <Form.Item hidden name={'extendResetTick'} initialValue={hotKeyScopeId} noStyle/>
                            </div>

                        </div>
                    }
                </Form>
                <div className={'ord-container-box ord-crud-list'}>
                    {/* Table */}
                    {children}
                </div>
            </div>
        </HotkeysProvider>

    );
};
