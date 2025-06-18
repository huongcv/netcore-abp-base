import {ProductDto, ProductPriceListDetailSyncDto, ProductSyncDto} from "@api/index.defs";
import * as React from "react";
import {useEffect, useState} from "react";
import {NumericFormat} from "react-number-format";
import {Form, Tag} from "antd";
import {useFilterProductPriceListById} from "@ord-core/db/queries/productPriceList/useFilterProductPriceListById";
import {currencyDefault} from "@ord-core/AppConst";

export const PriceProductItem = (props: {
    product: ProductSyncDto | ProductDto
}) => {
    const {product} = props;
    const priceListId_w = Form.useWatch('priceListId');
    const [productCurrentPrice, setProductCurrentPrice] = useState<any>(null);
    const [hasSetProductCurrentPrice, setHasSetProductCurrentPrice] = useState(false);
    const [showPrice, setShowPrice] = useState<any>(null);
    const [priceListName, setPriceListName] = useState<any>(null);

    const priceList_db = useFilterProductPriceListById(priceListId_w);
    const setShowDisplayPrice = (v: any) => {
        product.productPrice = v;
        setShowPrice(v);
    }
    useEffect(() => {
        setCurrentPrice()
        if ((product as ProductDto).productPriceByPriceList) {
            setShowDisplayPrice((product as ProductDto).productPriceByPriceList);
            setPriceListName("NEW_PRICE");
        } else if (priceList_db) {
            const {priceList, details} = priceList_db;
            setPriceListName(null);
            if (priceList.isMain) {
                return;
            } else {
                const detailPriceLists: ProductPriceListDetailSyncDto[] = details || [];
                if (detailPriceLists && detailPriceLists.length > 0) {
                    const findInDetails = detailPriceLists.find(x => x.productUnitId == (product as ProductSyncDto).productBasicUnitId);
                    if (findInDetails) {
                        setShowDisplayPrice(findInDetails.productPrice);
                        setPriceListName(priceList.name);
                        return;
                    }
                }
            }
        }

    }, [priceList_db]);

    const setCurrentPrice = () => {
        if (!hasSetProductCurrentPrice) {
            setProductCurrentPrice(product.productPrice);
            setHasSetProductCurrentPrice(true);
            setShowPrice(product.productPrice);
        } else {
            setShowDisplayPrice(productCurrentPrice);
        }
        return;
    }

    return (<>
        <div>
            {
                priceListName && productCurrentPrice !== showPrice &&
                <div className="line-through text-[12px] text-red">
                    <NumericFormat value={productCurrentPrice || 0}
                                   displayType={'text'}
                                   thousandSeparator={true}/> {currencyDefault}
                </div>
            }
            <Tag style={{lineHeight: "20px"}} bordered={false}
                 className="text-[14px] font-semibold text-[#45494E] bg-[#F1F1F1]">{
                <NumericFormat value={showPrice || 0}
                               displayType={'text'}
                               thousandSeparator={true}/>} {currencyDefault}


            </Tag>
        </div>
    </>)
}
