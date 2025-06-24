import {createModalStore} from "@ord-components/paged-table/useModalStoreFactory";
import {useTranslation} from "react-i18next";
import {GenericModalForm} from "@ord-components/paged-table/GenericModalForm";
import React, {useEffect, useMemo, useState} from "react";
import {createTableStore, PagedTable} from "@ord-components/paged-table";
import {UserAccessTokenService} from "@api/base/UserAccessTokenService";
import {UserDto} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import {PagedTableSearchForm} from "@ord-components/paged-table/PagedTableSearchForm";
import {Form} from "antd";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {GetUserAccessTokenPagedInput, UserPagedDto} from "@api/base/index.defs";
import {UserAccessTokenColumns} from "@pages/Admin/Users/access-token/Columns";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";

export const userAccessTokenListModalStore = createModalStore();
export const userAccessTokenTableStore = createTableStore({
    getPaged: params => {
        // @ts-ignore
        const body: GetUserAccessTokenPagedInput = params?.body;
        if (body?.isActived == null) {
            body.isActived = true;
        }
        return UserAccessTokenService.getPaged({
            body
        });
    }
});

export const UserAccessTokenListModal = () => {
    const {t} = useTranslation('modal');
    const {open, dataItem} = userAccessTokenListModalStore();
    const [searchForm] = Form.useForm();
    const [user, setUser] = useState<UserPagedDto>();
    useEffect(() => {
        if (dataItem) {
            setUser(dataItem);
        }
    }, [open]);
    useEffect(() => {
        if (user) {
            searchForm.setFieldsValue({
                userEncodedId: user.encodedId
            });
        }
    }, [user]);
    const title = useMemo(() => t('userAccessTokenListModal.title', {...user}), [user]);

    const handleSave = async () => {
        return true;
    }
    const columns = TableUtil.getColumns<UserDto>([
        {
            title: 'user_name',
            dataIndex: 'userName',
            render: (value, dto) => {
                return user?.userName;
            },
            width: 200,
        },
        ...UserAccessTokenColumns
    ], {
        actions: []
    });

    return (
        <>
            <GenericModalForm modalStore={userAccessTokenListModalStore}
                              width={1200} hiddenOk
                              title={title}
                              onSave={handleSave}>
                <PagedTableSearchForm form={searchForm} tableStore={userAccessTokenTableStore} searchFields={<>
                    <SearchFilterText span={12}/>
                    <Form.Item name={'userEncodedId'} noStyle/>
                </>} initialValues={{
                    userEncodedId: user?.encodedId
                }}/>
                <div className={'mt-5'}>
                    <OrdCounterByStatusSegmented tableStore={userAccessTokenTableStore} statusFieldName={'isActived'}
                                                 initialValueStatus={true}
                                                 fetcher={UserAccessTokenService.getCountByStatus}/>
                </div>
                <PagedTable columns={columns} tableStore={userAccessTokenTableStore}/>

            </GenericModalForm>
        </>
    );
}