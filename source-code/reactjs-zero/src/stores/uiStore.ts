import {action, makeObservable, observable} from "mobx";

class UiStore {
    constructor() {
        makeObservable(this, {
            fullscreenLoading: observable,
            setBusy: action,
            clearBusy: action
        })
    }

    fullscreenLoading: boolean = false;

    setBusy() {
        this.fullscreenLoading = true;
    }

    clearBusy() {
        this.fullscreenLoading = false;
    }

}

export default UiStore;
