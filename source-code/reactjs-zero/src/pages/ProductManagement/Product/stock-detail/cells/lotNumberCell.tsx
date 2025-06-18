import {ProductDto} from "@api/index.defs";
import {useTranslation} from "react-i18next";
import DateUtil from "@ord-core/utils/date.util";

export const LotNumberCell = (props: {
    productDto?: ProductDto | null | undefined,
    lotNumber?: string,
    expiryDate?: Date | null | undefined
}) => {
    const [t] = useTranslation('product');
    const {productDto, lotNumber, expiryDate} = props;
    return (<>
        {
            productDto?.isProductUseLotNumber !== true ?
                t('productNotLot') :
                <>
                    <span>{lotNumber} - {DateUtil.showWithFormat(expiryDate, 'dd/MM/yyyy')}</span>
                    {/*<div className={'italic'}>*/}
                    {/*    {t('expiryDate')}{DateUtil.showWithFormat(expiryDate, 'dd/MM/yyyy')}*/}
                    {/*</div>*/}
                </>
        }
    </>);
}
