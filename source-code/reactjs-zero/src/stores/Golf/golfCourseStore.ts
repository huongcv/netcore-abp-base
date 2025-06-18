import { GolfCourseService } from "@api/GolfCourseService";
import { GolfCourseDto } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";

class GolfCourseStore extends CommonListStore<GolfCourseDto> {
    getNamespaceLocale(): string {
        return 'golf-course'
    }
    apiService() {
        return {
            getPaged: GolfCourseService.getPaged,
            remove: GolfCourseService.remove,
            createOrUpdate: GolfCourseService.createOrUpdate,
        };
    }
    getInitModal(): ICreateOrUpdateModal<any> {
        return {
            width: 1200
        };
    }
    async beforeSaveEntity(input: any, isAddNew: boolean): Promise<any> {
        console.log(input);
        // if (true) {
        //     return;
        // }
        return super.beforeSaveEntity(input, isAddNew);
    }
    getListColumnNameExcel(): string[] {
        throw new Error("Method not implemented.");
    }
}
export default GolfCourseStore