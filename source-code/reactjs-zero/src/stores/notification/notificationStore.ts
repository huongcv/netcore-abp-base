import {NotificationUserDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {NotificationUserService} from "@api/NotificationUserService";

class NotificationStore extends CommonListStore<NotificationUserDto> {

    getNamespaceLocale(): string {
        return "notifications"
    }

    apiService() {
        return {
            getPaged: NotificationUserService.getList,
        } as CommonCrudApi<NotificationUserDto>;
    }

    setAllAsRead() {
        return NotificationUserService.updateReadAll();
    }
    setAsRead(data: NotificationUserDto) {
        return NotificationUserService.updateRead({
            notificationUserId: data.id??""
        });
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt']
    }
}

export default NotificationStore;
