import {useTranslation} from "react-i18next";
import {ImportStockMoveDto, ImportStockTicketDto} from "@api/index.defs";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

const MoveRightPriceInformation = (props: {
    moveDto?: ImportStockMoveDto | null,
    ticketDto: ImportStockTicketDto
}) => {
    const {moveDto} = props;
    const {t} = useTranslation('stock');

    return (<div className={'stock-right detail-amount-move-box-' + props.moveDto?.moveType}
                 style={{
                     paddingLeft: 0,
                     paddingRight: 0
                 }}>
        <div className="border-t border-2 border-b-blue-600 my-4"></div>
        {
            moveDto?.moveType != MoveType.PhieuDieuChuyen &&
            moveDto?.moveType != MoveType.PhieuDieuChuyenNhan &&
            <table className='box-price-move-tbl w-full'>
                <tbody className={'price-infor-' + props.moveDto?.moveType}>
                <tr className={'totalAmountBeforeDiscount'}>
                    <td style={{width: 120}}>
                        {t('priceBoxMove.totalAmountBeforeDiscount')}
                    </td>
                    <td className='text-right number-readonly'>
                        {<PriceCell fixed={2} value={moveDto?.totalAmountBeforeDiscount}></PriceCell>}
                    </td>
                </tr>
                <tr className={'discountAmount'}>
                    <td>
                        {t('priceBoxMove.discountAmount')}
                        {
                            moveDto?.discountType === DiscountTypeEnum.Percent &&
                            <span> ({moveDto?.discountPercent}%)</span>
                        }
                    </td>
                    <td className='text-right number-readonly has-discount'>
                        {<PriceCell fixed={2} value={moveDto?.discountAmountDisplay}></PriceCell>}
                    </td>
                </tr>
                <tr className={'taxAmount'}>
                    <td>
                        {t('priceBoxMove.taxAmount')}
                    </td>
                    <td className='text-right number-readonly'>
                        {<PriceCell fixed={2} value={moveDto?.taxAmount}></PriceCell>}
                    </td>
                </tr>
                <tr className={'totalAmount font-bold'}>
                    <td>
                        {t('priceBoxMove.totalAmount')}
                    </td>
                    <td className='text-right number-readonly'>
                        {<PriceCell fixed={0} value={moveDto?.totalAmountRound}></PriceCell>}
                    </td>
                </tr>
                <tr className={'paymentAmount font-bold'}>
                    <td>
                        {t('priceBoxMove.paymentAmount')}
                    </td>
                    <td className='text-right'>
                        {<PriceCell fixed={0} value={moveDto?.paymentAmount}></PriceCell>}
                    </td>
                </tr>
                <tr className={'debtAmount font-bold'}>
                    <td>
                        {t('priceBoxMove.debtAmount')}
                    </td>
                    <td className='text-right number-readonly'>
                        {<PriceCell fixed={0} value={moveDto?.debtAmount}></PriceCell>}
                    </td>
                </tr>
                <tr className={'paymentMethod'}>
                    <td>
                        {t('priceBoxMove.paymentMethod')}
                    </td>
                    <td className='text-right'>
                        {
                            moveDto?.paymentMethodName ?? ""
                        }
                    </td>
                </tr>
                </tbody>

            </table>
        }
        {
            (moveDto?.moveType == MoveType.PhieuDieuChuyen ||
                moveDto?.moveType == MoveType.PhieuDieuChuyenNhan) &&
            <table className='box-price-move-tbl w-full'>
                <tr className={'totalAmount font-bold'}>
                    <td>
                        {t('priceBoxMove.totalAmount')}
                    </td>
                    <td className='text-right number-readonly'>
                        {<PriceCell fixed={0} value={moveDto?.totalAmount}></PriceCell>}
                    </td>
                </tr>
            </table>
        }
    </div>);
}
export default MoveRightPriceInformation;
