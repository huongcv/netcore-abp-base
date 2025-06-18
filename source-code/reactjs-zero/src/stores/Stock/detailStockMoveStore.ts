import {action, makeObservable, observable} from "mobx";

class DetailStockMoveStore {
  constructor() {
    makeObservable(this, {
      isModalOpen: observable,
      ticketDto: observable,
      closeModal: action,
    });
  }

  isModalOpen = false;
  ticketDto: any | undefined | null = null;
  openDetail = (ticketDto: any) => {
    this.ticketDto = { ...ticketDto };
    this.isModalOpen = true;
  };
  closeModal = () => {
    this.isModalOpen = false;
    this.ticketDto = null;
  };
}

export default DetailStockMoveStore;
