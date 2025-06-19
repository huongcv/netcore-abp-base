import React from 'react';
import {v4 as uuidv4} from "uuid";
import {HotkeysProvider} from "react-hotkeys-hook";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";

interface PageLayoutWithTableProps {
    topActions?: IActionBtn[],
    topActionContent?: React.ReactNode,
    hiddenTopAction?: boolean;
    searchForm: React.ReactNode;
    tableContent?: React.ReactNode;

}

export const PageLayoutWithTable = ({
                                        topActions,
                                        topActionContent,
                                        hiddenTopAction,
                                        tableContent,
                                        searchForm,
                                    }: PageLayoutWithTableProps) => {
    const hotKeyScopeId = React.useMemo(() => `crudPageScope-${uuidv4()}`, []);
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
                    {/* Form Search */}
                    {searchForm}
                </div>
                <div className={'ord-container-box ord-crud-list'}>
                    {/* Table */}
                    {tableContent}
                </div>
            </div>
        </HotkeysProvider>

    );
};
