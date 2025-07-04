import {useTableSearchModal} from "@ord-components/modal/GlobalModalManager/hook/useTableSearchModal";
import {UserPagedDto} from "@api/base/index.defs";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import TableUtil from "@ord-core/utils/table.util";
import {useTranslation} from "react-i18next";
import {HostSystemSettingService} from "@api/base/HostSystemSettingService";
import {ColumnBuilder} from "@ord-components/paged-table/columns";
import {
    BulkActionButtonModal
} from "@ord-components/modal/GlobalModalManager/components/TableSearchModal/BulkActionButtonModal";

export const usePasswordWeakModal = () => {
    const {t} = useTranslation('modal');
    const builder = new ColumnBuilder();
    builder.addText({
        title: 'value_password_weak',
        dataIndex: 'value',
        copyable: true,
    })
    const {openTableModal} = useTableSearchModal<UserPagedDto>({
        tableProps: {
            apiService: {
                getPaged: HostSystemSettingService.getPasswordBlacklisted
            },
            searchFields: <SearchFilterText span={12}/>,
            rowKey: 'userId',
            columns: TableUtil.getColumns([
                ...builder.build()
            ], {
                actions: []
            })
        },
        modalProps: {
            width: 1200,
            style: {
                top: 10
            }
        }
    });
    const openListPasswordWeakModal = () => {
        openTableModal({
            title: t('usersAssignableToRole.title'),
            renderBulkActions: (input) => {
                const {selectedRowKeys, clearSelection, onReloadTableModal} = input;
                return <BulkActionButtonModal selectedRowKeys={selectedRowKeys}
                                              isHiddenIfEmpty
                                              titleButton={'bulk_remove.blacklisted'}
                                              buttonProps={{
                                                  danger: true,
                                                  type: 'primary'
                                              }}
                                              confirm={{
                                                  titleI18nKey: 'before_remove_title',
                                                  contentI18nKey: 'removePasswordWeak.description'
                                              }}
                                              handlerClick={(selected) => {

                                              }}
                />
            }
        })
    }
    return {
        openListPasswordWeakModal
    }
}