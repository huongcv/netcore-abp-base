import {create} from 'zustand';
import UiUtils from "@ord-core/utils/ui.utils";
import {ICommonResultDtoApi, IModifyApiService} from "@ord-components/paged-table/types";

export type ModalMode = 'create' | 'edit' | 'viewDetail';

export interface ModalFormState<T = any> {
    open: boolean;
    editingItem?: T | null;
    deletingItem: { encodedId?: string } | null;
    mode: ModalMode;
    setMode: (mode: ModalMode) => void;
    openCreate: () => void;
    openEdit: (item: T) => void;
    openView: (item: T) => void;
    openDelete: (item: T) => void;
    close: () => void;
    onSubmit: (values: T) => Promise<ICommonResultDtoApi<any> | null>;
    onDelete: () => Promise<ICommonResultDtoApi<any> | null>;
}

export const createModalFormStore = <TDetail, TCreate, TUpdate>(service: IModifyApiService,
                                                                options?: {
                                                                    transformBeforeCreate?: (values: any) => void;
                                                                    transformBeforeUpdate?: (values: any, editingItem: any) => void;
                                                                    onSuccess?: (result: ICommonResultDtoApi<any>, mode: ModalMode) => void;
                                                                }) =>
    create<ModalFormState<TDetail>>((set, get) => ({
        open: false,
        editingItem: null,
        deletingItem: null,
        mode: 'create',
        setMode: (mode) => set({mode}),
        openCreate: () => set({open: true, editingItem: null, mode: 'create'}),
        openEdit: (item) => set({open: true, editingItem: item, mode: 'edit'}),
        openView: (item) => set({open: true, editingItem: item, mode: 'viewDetail'}),
        openDelete: (deletingItem: any) => set({deletingItem}),
        close: () => set({open: false, editingItem: null, deletingItem: null, mode: 'create'}),
        onSubmit: async (values: TDetail) => {
            const {mode, editingItem} = get();
            if (!mode) return null;
            const isCreate = mode === 'create';
            UiUtils.setBusy();
            try {
                const body = isCreate
                    ? values
                    : options?.transformBeforeUpdate?.(editingItem ?? null, values) ?? {
                    ...editingItem,
                    ...values,
                    // @ts-ignore
                    encodedId: editingItem['encodedId']
                };
                if (mode === 'create' && options?.transformBeforeCreate) {
                    options.transformBeforeCreate(body);
                }
                if (mode === 'edit' && options?.transformBeforeUpdate) {
                    options.transformBeforeUpdate(body, editingItem);
                }

                const result = isCreate
                    ? await service.create({body: body})
                    : await service.update({body: body as any});

                if (options?.onSuccess) {
                    options.onSuccess(result, mode);
                }
                return result;
            } catch (err) {
                console.error('Modal submit error', err);
                throw err;
            } finally {
                UiUtils.clearBusy();
            }
        },
        onDelete: async () => {
            const {deletingItem} = get();
            if (!deletingItem || !service.remove) {
                return null;
            }
            UiUtils.setBusy();
            try {
                const body = {
                    encodedId: deletingItem['encodedId']
                };
                const result = await service.remove({body: body});
                return result;
            } catch (err) {
                console.error('Modal submit error', err);
                throw err;
            } finally {
                UiUtils.clearBusy();
            }

        }
    }));
