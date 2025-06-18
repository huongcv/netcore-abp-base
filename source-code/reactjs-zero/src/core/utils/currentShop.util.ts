class CurrentShopUtil {
    KEY_SHOP = 'shopCurrent';

    setShop(currentShopId?: number) {
        sessionStorage.setItem(this.KEY_SHOP, currentShopId?.toString()??"");
    }

    getShop() {
        return sessionStorage.getItem(this.KEY_SHOP);
    }
}

export default new CurrentShopUtil();
