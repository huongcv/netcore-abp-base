import {action, makeObservable, observable} from 'mobx';
import {ModalConfig} from "@ord-core/model/OrdEntityModalProp";
import {FormInstance} from "antd";
import React from "react";

interface EntityModalItem {
    id: string,
    entity: any,
    modal: {
        modal?: ModalConfig;
        formContent?: (form: FormInstance) => React.ReactNode;
        onSave?: (formValues: any) => Promise<boolean>;
        onClose?: () => void;
    }
}

class EntityModalStore {
    modalGroup: EntityModalItem[] = [];

    constructor() {
        makeObservable(this, {
            modalGroup: observable,
            openModalForm: action,
            closeModal: action,
            openModalView: action
        })
    }

    openModalForm(input: {
        entity: any,
        modal?: ModalConfig;
        formContent?: (form: FormInstance) => React.ReactNode;
        onSave?: (formValues: any) => Promise<boolean>;
        onClose?: () => void;
    }, id?: string) {
        if (!id) {
            id = '' + Number(new Date());
        }
        if (this.modalGroup.find(x => x.id === id)) {
            return;
        } else {
            this.modalGroup = [
                ...this.modalGroup,
                {
                    id: id,
                    entity: input.entity,
                    modal: {
                        ...input
                    }
                }
            ];
        }
    }

    openModalView(input: {
        modalContent: React.ReactNode,
        modal?: ModalConfig
    }, id?: string) {
        if (!id) {
            id = '' + Number(new Date());
        }
        if (this.modalGroup.find(x => x.id === id)) {
            return;
        } else {
            this.modalGroup = [
                ...this.modalGroup,
                {
                    id: id,
                    entity: {},
                    modal: {
                        modal: {
                            ...input.modal,
                            ignoreFormEntity: true
                        },
                        formContent: () => input.modalContent
                    }
                }
            ];
        }
    }

    closeModal(id: string) {
        const find = this.modalGroup.find(x => x.id === id);
        if (find?.modal?.onClose) {
            find?.modal?.onClose();
        }

        const modal = this.modalGroup.filter(x => x.id !== id);
        this.modalGroup = [...modal];
    }
}

export default EntityModalStore;
