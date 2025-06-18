import {useTranslation} from "react-i18next";
import './StatusCell.scss';
import {Tag} from "antd";

export const StatusCell = (prop: {
    isActived?: boolean,
    trueText?: string,
    falseText?: string,
}) => {
    const {t} = useTranslation('common');
    const trueText = prop?.trueText || 'dang_hoat_dong';
    const falseText = prop?.falseText || 'ngung_hoat_dong';
    return (prop?.isActived ?
        <Tag className="me-0 ord-cell-actived">
            {t(trueText)}
        </Tag>
        :
        <Tag className="me-0 ord-cell-inactived">
            {t(falseText)}
        </Tag>);
}
