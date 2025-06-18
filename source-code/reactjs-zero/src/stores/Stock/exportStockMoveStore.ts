import { ImportStockTicketDto, OrderStockTicketDto } from "@api/index.defs";
import { action, makeObservable, observable } from "mobx";

class ExportStockMoveStore {
  receiptImportStockIdHash: any | undefined;
  callback: (() => void) | null = null;
  constructor() {
    makeObservable(this, {
      isModalOpen: observable,
      receiptImportStockIdHash: observable,
      triggerFlag: observable,
      closeModal: action,
      triggerCallback: action,
      updateReceiptImportStockIdHash: action,
    });
  }
  triggerFlag = false;
  isModalOpen = false;
  openDetail = () => {
    this.isModalOpen = true;
  };
  updateReceiptImportStockIdHash = (update: any) => {
    this.receiptImportStockIdHash = { ...update };
  };
  closeModal = () => {
    this.isModalOpen = false;
  };
  triggerCallback = () => {
    this.triggerFlag = true;
  };
  setTriggerFlag = () => {
    this.triggerFlag = false;
  };
}

export default ExportStockMoveStore;
