import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

export const BoolStatusIcon = (props: {
    status?: boolean | null
}) => {
    return (<span className={'me-2 text-[18px]'}>
        {props.status == true ? <span className={'status-true'}>
            <CheckOutlined/>
        </span> : <span className={'text-red-500'}>
            <CloseOutlined/>
        </span>}
    </span>)
}
