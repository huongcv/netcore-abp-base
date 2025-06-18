import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {EmployeeDto} from "@api/index.defs";
import {EmployeeService} from "@api/EmployeeService";
import UiUtils from "@ord-core/utils/ui.utils";
import utils from "@ord-core/utils/utils";
import uiUtils from "@ord-core/utils/ui.utils";
import { l } from "@ord-core/language/lang.utils";
class EmployeeStore extends CommonListStore<EmployeeDto, EmployeeDto> {
    getNamespaceLocale(): string {
        return "employee"
    }

    apiService() {
        return EmployeeService;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 900
        };
    }

    openViewModal(d: any, isEdit: boolean) {
        EmployeeService.getById({
            findId: d.id,
        }).then((result) => {
            if (utils.isNullOrEmpty(result)) {
                uiUtils.showError(l.trans(this.getNamespaceLocale() + '.notFound', null));
                return;
            }
            // d.listRoleId = result.listRoleId;
            // d.listInventoryId = result.listInventoryId;
            // d.listAllowanceId = result.listAllowanceId;
            // d.workCalendarId = result.workCalendarId;
            // d.categoryId = result.categoryId;
            if (isEdit) {
                this.openUpdateModal(result);
            } else {
                this.openViewDetailModal(result);
            }
        });
    }


    getListColumnNameExcel(): string[] {
        return ['stt', 'userNameFull', 'certificate', 'studyField', 'studySchool']
    }

    async beforeSaveEntity(input: any, isAddNew: boolean): Promise<any> {
        if (isAddNew) {
            if (!!input.signatureId) {
                try {
                    const uploadDto = await EmployeeService.uploadSignatureImg({
                        files: [input.signatureId] as any
                    });
                    if (uploadDto.length > 0) {
                        input.signaturePhotoUrl = uploadDto[0].fileId + '';
                    }
                } catch {
                    UiUtils.showError('Upload error');
                }

            }
        } else {
                if(!input.signaturePhotoUrl || (!!input.signatureId && input.signaturePhotoUrl)){
                    try {
                        const uploadDto = await EmployeeService.uploadSignatureImg({
                            files: [input.signatureId] as any
                        });
                        if (uploadDto.length > 0) {
                            input.signaturePhotoUrl = uploadDto[0].fileId + '';
                        }
                    } catch {
                        UiUtils.showError('Upload error');
                    }

            }
        }
        return super.beforeSaveEntity(input, isAddNew);
    }

}

export default EmployeeStore;
