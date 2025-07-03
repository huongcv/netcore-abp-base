import React, {useMemo} from 'react';
import {v4 as uuidv4} from "uuid";
import {HotkeysProvider} from "react-hotkeys-hook";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {Form, FormInstance} from "antd";
import {TableSearchForm} from "@ord-components/paged-table/components/TableSearchForm";
import {TitleAndAction} from "@ord-components/common/page/TitleAndAction";
import AddNewEntity from "@ord-components/crud/btn-action/AddNewEntity";

interface PageLayoutWithTableProps {
    children: React.ReactNode;
    tableStore: ReturnType<typeof import('@ord-components/paged-table/hooks/useTableStoreFactory').createTableStore>;
    titleHeader?: React.ReactNode;
    topActions?: IActionBtn[],
    topActionContent?: React.ReactNode,
    hiddenTopAction?: boolean;
    searchFields: React.ReactNode;
    searchInitData?: any;
    form?: FormInstance;

}

export const PageLayoutWithTable = ({
                                        topActions,
                                        titleHeader,
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
    const rightActionGroups = <>
        {topActionContent}
        <TopAction topActions={topActions} hotkeyScope={hotKeyScopeId}/>
    </>
    const renderHeader = useMemo(() => {
        if (hiddenTopAction) {
            return null;
        }
        if (titleHeader) {
            return <TitleAndAction title={titleHeader}>
                {rightActionGroups}
            </TitleAndAction>
        }
        return <PageTopTitleAndAction>
            {rightActionGroups}
        </PageTopTitleAndAction>
    }, [titleHeader, hiddenTopAction, rightActionGroups]);
    return (
        <HotkeysProvider initiallyActiveScopes={[hotKeyScopeId]}>
            <div>
                {renderHeader}
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
