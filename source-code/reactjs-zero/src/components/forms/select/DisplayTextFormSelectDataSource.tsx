import {observer} from "mobx-react-lite";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useEffect, useState} from "react";

const DisplayTextFormSelectDataSource = (props: {
    datasource: SelectDataSource;
    value: any,
    renderDisplay?: (option: any) => React.ReactNode;
}) => {
    const {renderDisplay} = props;
    const [display, setDisplay] = useState<any>(null);
    useEffect(() => {
        if (!props.value) {
            setDisplay(null);
            return;
        }
        if (props.datasource.data) {
            const f = props.datasource.data.find(x => x.value == props.value);
            if (renderDisplay) {
                setDisplay(renderDisplay(f));
            } else {
                setDisplay(f?.label);
            }

            return;
        } else {
            setDisplay(null);
        }

    }, [props.datasource.data, props.value]);
    return (<span>{display}</span>)

}
export default observer(DisplayTextFormSelectDataSource);
