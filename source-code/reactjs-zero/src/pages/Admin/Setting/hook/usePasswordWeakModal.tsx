import {
    RenderBulkActionInput,
    useTableSearchModal
} from "@ord-components/modal/GlobalModalManager/hook/useTableSearchModal";
import {UserPagedDto} from "@api/base/index.defs";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import TableUtil from "@ord-core/utils/table.util";
import {useTranslation} from "react-i18next";
import {HostSystemSettingService} from "@api/base/HostSystemSettingService";
import {ColumnBuilder} from "@ord-components/paged-table/columns";
import {
    BulkActionButtonModal
} from "@ord-components/modal/GlobalModalManager/components/TableSearchModal/BulkActionButtonModal";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {Button, Col, Form} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {usePasswordWeakAddModal} from "@pages/Admin/Setting/hook/usePasswordWeakAddModal";

const SearchFields = () => {
    const {openPasswordAddModal} = usePasswordWeakAddModal();
    const form = Form.useFormInstance();
    return <>
        <SearchFilterText span={18}/>
        <Col span={6} className={'text-right'}>
            <Button type='primary' icon={<PlusOutlined/>} onClick={() => {
                openPasswordAddModal(form);
            }}>
                Thêm mới
            </Button>
        </Col>
    </>;
}
const RemoveBulkAction = (props: RenderBulkActionInput) => {
    const {selectedRowKeys, clearSelection, onReloadTableModal} = props;
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
                                  handlerClick={async (selected) => {
                                      const apiResult = await HostSystemSettingService.removePasswordBlacklisted({
                                          encodedIds: [...selected]
                                      });
                                      ServiceProxyUtils.notifyErrorResultApi(apiResult);
                                      if (apiResult.isSuccessful) {
                                          UiUtils.showErrorNs('modal', 'hostSetting.passWordWeak.remove');
                                          onReloadTableModal();
                                          clearSelection();
                                      }

                                  }}
    />;
}
const ClearSelected = (props: RenderBulkActionInput) => {
    const {selectedRowKeys, clearSelection, onReloadTableModal} = props;
    return <BulkActionButtonModal selectedRowKeys={selectedRowKeys}
                                  isHiddenIfEmpty
                                  buttonProps={{
                                      type: 'default'
                                  }}
                                  titleButton={'Bỏ chọn tất cả'}
                                  handlerClick={async (selected) => {
                                      clearSelection();
                                  }}
    />;
}
export const usePasswordWeakModal = () => {
    const {t} = useTranslation('modal');
    const builder = new ColumnBuilder();
    builder.addText({
        title: 'value_password_weak',
        dataIndex: 'value',
        copyable: true,
    });
    const {openTableModal} = useTableSearchModal<UserPagedDto>({
        tableProps: {
            apiService: {
                getPaged: HostSystemSettingService.getPasswordBlacklisted
            },
            searchFields: <SearchFields/>,
            rowKey: 'encodedId',
            columns: TableUtil.getColumns([
                ...builder.build()
            ], {
                actions: []
            })
        },
        rowSelectionConfig: {
            preserveSelection: true
        },
        modalProps: {
            width: 699,
            style: {
                top: 10
            }
        }
    });

    const openListPasswordWeakModal = () => {
        openTableModal({
            title: t('hostSetting.passWordWeak.title'),
            renderBulkActions: (input) => {
                const {selectedRowKeys, clearSelection, onReloadTableModal} = input;
                return [
                    <RemoveBulkAction {...input}/>,
                    <ClearSelected {...input}/>
                ];
            }
        })
    }
    return {
        openListPasswordWeakModal
    }
}