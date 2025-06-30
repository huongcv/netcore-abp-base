import {useTranslation} from "react-i18next";
import './StatusCell.scss';
import {IsActiveStatusDisplay} from "@ord-components/common/display/Status/IsActiveStatusDisplay";

export const StatusCell = (prop: {
    isActived?: boolean,
    trueText?: string,
    falseText?: string,
}) => {
    const {t} = useTranslation('common');
    return (<IsActiveStatusDisplay value={prop?.isActived} config={{
        activeText: prop?.trueText || 'dang_hoat_dong',
        inactiveText: prop?.falseText || 'dang_hoat_dong',
    }}/>);
}
