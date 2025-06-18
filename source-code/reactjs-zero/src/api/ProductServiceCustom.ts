import {CommonResultDtoOfProductDto, IRequestOptions, ProductDto, UpdateImgUrlProductCommand} from './index.defs';
import {ProductService} from "@api/ProductService";
import {fetchSyncDataProducts} from "@ord-core/db/services/syncDataProducts";
import {fetchSyncDataInventoryLine} from "@ord-core/db/services/syncDataInventoryLine";

export class ProductServiceCustom {


    static createOrUpdate(
        params: {
            /** requestBody */
            body?: ProductDto;
        } = {} as any,
        options: IRequestOptions = {}
    ): Promise<CommonResultDtoOfProductDto> {
        return ProductService.createOrUpdate(params, options).then((d) => {
            fetchSyncDataProducts().then();
            if(d.data?.isProductUseInventory){
                fetchSyncDataInventoryLine().then();
            }
            return d;
        });
    }


    static remove(
        params: {
            /**  */
            removeId: number;
        } = {} as any,
        options: IRequestOptions = {}
    ): Promise<CommonResultDtoOfProductDto> {
        return ProductService.remove(params, options).then((d) => {
            fetchSyncDataProducts().then();
            return d;
        });
    }

    static updateImgUrl(
        params: {
            /** requestBody */
            body?: UpdateImgUrlProductCommand;
        } = {} as any,
        options: IRequestOptions = {}
    ): Promise<boolean> {
        return ProductService.updateImgUrl(params, options).then((d) => {
            fetchSyncDataProducts().then();
            return d;
        });
    }
}
