import {ProductDto} from "@api/index.defs";
import * as React from "react";
import {useEffect, useState} from "react";
import {NumericFormat} from "react-number-format";
import {currencyDefault} from "@ord-core/AppConst";
import {round} from "lodash";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";

export const PriceProductApiItem = (props: {
    product: ProductDto
}) => {
    const {product} = props;
    const [oldPrice, setOldPrice] = useState<number>();
    const [newPrice, setNewPrice] = useState<number>();
    const [vatShow, setVatShow] = useState<string>();

    useEffect(() => {
        const oldPrice = CalculatorCurrencyUtil.calculatePriceWithTax(
            product.productPrice, product.taxPercent, product.isProductPriceIncludeTax);
        const newPrice = CalculatorCurrencyUtil.calculatePriceWithTax(
            product.productPriceByPriceList, product.taxPercent, product.isProductPriceIncludeTax);
        setOldPrice(oldPrice);
        if (newPrice) {
            setOldPrice(newPrice);
        }

        if (product.isProductPriceIncludeTax) {
            setVatShow("(VAT:" + product.taxPercent + "%)");
        } else {
            setVatShow("");
        }
    }, [product]);

    interface PriceDisplayProps {
        oldPrice?: number;
        newPrice?: number;
        vatShow?: string;
    }

    const PriceDisplay: React.FC<PriceDisplayProps> = ({oldPrice, newPrice, vatShow}) => {
        const showNewPrice = newPrice !== undefined && newPrice !== null && newPrice !== oldPrice;
        return (
            <div>
                {
                    <div className="text-black font-semibold">
                        <NumericFormat value={round(oldPrice || 0, 2) || 0}
                                       displayType={'text'}
                                       thousandSeparator={true}/> {currencyDefault}
                    </div>
                }

            </div>
        );
    };

    return (<>
        <div>
            <PriceDisplay newPrice={newPrice} oldPrice={oldPrice} vatShow={vatShow}></PriceDisplay>
        </div>
    </>)
}
