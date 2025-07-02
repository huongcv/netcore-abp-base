import {RolePagedDto, UserPagedDto} from "@api/base/index.defs";
import {RoleService} from "@api/base/RoleService";
import {useTableSearchModal} from "@ord-components/modal/GlobalModalManager/hook/useTableSearchModal";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import TableUtil from "@ord-core/utils/table.util";
import {UserDto} from "@api/index.defs";
import {UserDataColumns} from "@pages/Admin/Users/UserDataColumns";
import {BulkAssignableToRoleActionToolbar} from "@pages/Admin/Roles/components/BulkAssignableToRoleActionToolbar";
import {useTranslation} from "react-i18next";

export const useListUserAssignableModal = () => {
    const {t} = useTranslation('modal');
    const {openTableModal} = useTableSearchModal<UserPagedDto>({
        tableProps: {
            apiService: {
                getPaged: RoleService.getUsersAssignableToRole
            },
            searchFields: <SearchFilterText span={12}/>,
            rowKey: 'userId',
            columns: TableUtil.getColumns<UserDto>([
                ...UserDataColumns
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
    const openListUserAssignableModal = (roleDto: RolePagedDto, callBack: () => void) => {
        openTableModal({
            title: t('usersAssignableToRole.title', roleDto),
            modalData: {
                encodedId: roleDto.encodedId
            },
            renderBulkActions: (input) => {
                const {selectedRowKeys, clearSelection, onReloadTableModal} = input;
                return <BulkAssignableToRoleActionToolbar
                    onSaved={() => {
                        clearSelection();
                        onReloadTableModal();
                        callBack();
                    }}
                    selectedRowKeys={selectedRowKeys}
                    roleDto={roleDto}
                />;
            }
        })
    }
    return {
        openListUserAssignableModal
    }
};
