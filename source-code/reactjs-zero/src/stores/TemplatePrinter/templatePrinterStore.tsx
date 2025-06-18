import {makeObservable} from "mobx";
import {TemplatePrinterService} from "@api/TemplatePrinterService";
import {OrdPagedRequestDto} from "@api/index.defs";

class TemplatePrinterStore {
    // dataSource: TemplatePrinterDto[] = []

    constructor() {
        makeObservable(this, {
            // dataSource: observable
        })
    }

    getDataList(input: OrdPagedRequestDto) {
        return TemplatePrinterService.getListPaging({
            body: input
        })
    }

}

export default TemplatePrinterStore;
