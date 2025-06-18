import {action, makeObservable, observable} from "mobx";
import {MOVE_TYPE, StockMovePagedOutputDto} from "@api/index.defs";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";

export type MoveTypeView = 'import' | 'export' | 'transfer' | 'check' | "order" |'gdp-order';


type IAction = 'none' | 'detail' | 'print' | 'printBarCode' | 'edit' | 'cancel' | 'delete' | 'clone' | 'return';

class StockMoveStore {
    moveType: MoveTypeView;
    moveDto: any;
    productItemsFromExcel: any[] = [];
    onActionGrid: {
        actionName: IAction,
        data: StockMovePagedOutputDto | null | undefined
    }

    constructor() {
        makeObservable(this, {
            moveType: observable,
            moveDto: observable,
            productItemsFromExcel: observable,
            onActionGrid: observable,
            initMoveStock: action
        });
    }

    initMoveStock(moveType: MoveTypeView) {
        this.moveType = moveType;
        this.initMoveDto();
    }

    initMoveType(moveType: MOVE_TYPE) {
        this.moveDto.moveType = moveType;
    }

    private initMoveDto() {
        if (this.moveType === 'import') {
            this.moveDto = {
                //moveType: MoveType.PhieuNhapNhaCungCap
            }
        }
        if (this.moveType === 'export') {
            this.moveDto = {
                // moveType: MoveType.PhieuXuatTraNhaCungCap
            }
        }
        if (this.moveType === 'transfer') {
            this.moveDto = {
                moveType: MoveType.PhieuDieuChuyen
            }
        }
        if (this.moveType === 'order') {
            this.moveDto = {
                moveType: MoveType.PhieuDatHang
            }
        }
        if (this.moveType === 'gdp-order') {
            // this.moveDto = {
            //     moveType: MoveType.PhieuDatHang
            // }
        }
        if (this.moveType === 'check') {
            this.moveDto = {
                moveType: MoveType.PhieuKiemKho
            }
        }
    }

    setMoveUpdate(moveDto: any) {
        this.moveDto = {
            ...moveDto
        }
    }


    handlerClickActionGrid(actionName: IAction, data: StockMovePagedOutputDto) {
        const act = {
            actionName: actionName,
            data: {
                ...data
            }
        }
        this.onActionGrid = {
            ...act
        };
        setTimeout(() => {
            this.onActionGrid = {
                data: null,
                actionName: 'none'
            }
        }, 100);
    }
}

export default StockMoveStore;
