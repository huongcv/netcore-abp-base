import {ProductDto} from "@api/index.defs";
import {KeyStorage} from "@pages/SalesInvoice/Utils/saleCommon";

export interface FavProductDto {
    productId?: string;
}

export class FavoriteProduct {
    static Save = (product: ProductDto, listData: ProductDto[]) => {
        const data = FavoriteProduct.getProducts();
        const index = data.findIndex(x=>x.productId === product.id);
        const idx = listData.findIndex(x=>x.id === product.id);
        if (index >= 0) {
            data.splice(index, 1);
            listData[idx].isFavorite = false
        } else {
            data.push({productId: product.id});
            listData[idx].isFavorite = true;
        }
        localStorage.setItem(KeyStorage.FAVORITE_PRODUCTS, JSON.stringify(data));
        return [...listData];
    }

    static getProducts = () : FavProductDto [] => {
        const stores = localStorage.getItem(KeyStorage.FAVORITE_PRODUCTS);
        if(stores) {
            return JSON.parse(stores) as FavProductDto[];
        }
        return  []
    }

    static getFavorite = (product: ProductDto) : boolean => {
        const data = FavoriteProduct.getProducts();
        const idx = data.findIndex(x=>x.productId === product.id);
        return idx >= 0;
    }
}