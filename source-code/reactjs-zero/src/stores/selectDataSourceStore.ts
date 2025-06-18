import {action, makeObservable, observable} from 'mobx';
import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";

class SelectDataSourceStore {
    lock: any = {};
    dataOptions: any = {};
    dataGetOptionsApi: any = {};

    constructor() {
        makeObservable(this, {
            dataOptions: observable,
            getOptions: action,
            clearByName: action
        })
    }

    async getOptions(key: string, optionsFunc: () => Promise<IOrdSelectOption[]>) {
        if (this.dataOptions[key] && this.dataOptions[key]?.length > 0) {
            return;
        }
        if (this.lock[key]) {
            return;
        }
        this.lock[key] = true;
        try {
            this.dataGetOptionsApi[key] = optionsFunc;
            this.dataOptions[key] = await optionsFunc();
        } catch {

        } finally {
            this.lock[key] = false;
        }

    }

    clearByName(key: string) {
        if (key) {
            Object.keys(this.dataOptions).forEach((keyProperty) => {
                if (keyProperty && keyProperty.toLowerCase().includes(key.toLowerCase())) {
                    this.lock[keyProperty] = false;
                    delete this.dataOptions[keyProperty];
                }
            });
        }
    }
}

export default SelectDataSourceStore;
