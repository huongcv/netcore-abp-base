import React, {useMemo} from 'react';
import {v4 as uuidv4} from "uuid";
import {HotkeysProvider} from "react-hotkeys-hook";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {Form, FormInstance} from "antd";
import {TableSearchForm} from "@ord-components/paged-table/components/TableSearchForm";

interface PageLayoutWithTableProps {
    children: React.ReactNode;
    tableStore: ReturnType<typeof import('@ord-components/paged-table/hooks/useTableStoreFactory').createTableStore>;
    topActions?: IActionBtn[],
    topActionContent?: React.ReactNode,
    hiddenTopAction?: boolean;
    searchFields: React.ReactNode;
    searchInitData?: any;
    form?: FormInstance;

}

export const PageLayoutWithTable = ({
                                        topActions,
                                        topActionContent,
                                        hiddenTopAction,
                                        children,
                                        searchFields,
                                        tableStore,
                                        searchInitData,
                                        form
                                    }: PageLayoutWithTableProps) => {
    const hotKeyScopeId = useMemo(() => `crudPageScope-${uuidv4()}`, []);
    const [internalForm] = Form.useForm();
    const usedForm = form || internalForm;
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
                <div className={'ord-container-box'}>
                    <TableSearchForm
                        form={usedForm}
                        initialValues={searchInitData}
                        layout='vertical'
                        tableStore={tableStore}>
                        {searchFields}
                        <Form.Item hidden name={'hotKeyScopeId'} initialValue={hotKeyScopeId} noStyle/>

                    </TableSearchForm>
                </div>
                <div className={'ord-container-box ord-crud-list'}>
                    {/* Table */}
                    {children}
                </div>
            </div>
        </HotkeysProvider>

    );
};
