import {MoveTypeView} from "@ord-store/Stock/stockMoveStore";
import {Segmented, SegmentedProps} from "antd";
import {useEffect, useState} from "react";
import {useSelectStockMoveType} from "@ord-components/forms/select/selectDataSource/useSelectStockMoveType";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {useStore} from "@ord-store/index";

interface Props extends SegmentedProps {
    moveTypeGroup: MoveTypeView,
}

const MoveTypeInput = (props: {
    moveTypeGroup: MoveTypeView,
    value?: any,
    onChange?: (value: any) => void;
    disabled?: boolean;
}) => {
    const {stockMoveStore} = useStore();
    const {moveTypeGroup, onChange, ...rest} = props;
    const {t} = useTranslation('comboEnum');
    const [options, setOptions] = useState<any[]>([]);
    const selectStockMoveType = useSelectStockMoveType(moveTypeGroup);
    useEffect(() => {
        if (selectStockMoveType) {
            setOptions(selectStockMoveType.data);
        }
    }, [selectStockMoveType]);
    const handlerOnChange = (v: any) => {
        stockMoveStore.setMoveTypeValue(v);
        if (onChange) {
            onChange(v);
        }
    }

    return (<Segmented style={{marginTop: -10}}
                       defaultValue={'1'}
                       {...rest}
                       onChange={handlerOnChange}
                       options={options}
    />);
}
export default observer(MoveTypeInput);
