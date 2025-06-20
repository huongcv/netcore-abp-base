import {createTableStore} from "@ord-components/paged-table";
import {UserService} from "@api/base/UserService";
import {createModalFormStore} from "@ord-components/paged-table/useModalFormStoreFactory";

export const userTableStore = createTableStore(UserService);
export const userCreateOrUpdateModalStore = createModalFormStore(UserService, {});