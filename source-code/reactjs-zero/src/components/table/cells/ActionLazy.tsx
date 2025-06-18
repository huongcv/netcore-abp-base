import React from "react";
import {Space} from "antd";
import EntityModalStore from "@ord-store/entityModalStore";

type Props = {
    record: any,
    title: string,
    entityModalStore: EntityModalStore,
    callBackSuccess?: (data: any) => void;
}

export abstract class ActionLazy extends React.Component<Props> {
    record: any;

    componentDidMount() {
        this.record = this.props.record;
    }

    render() {
        return <div onClick={() => this.onClick(this.props.record)}>
            <Space>{this.icon()}{this.props.title}</Space>
        </div>;
    }

    callBackSuccess() {
        if (this.props.callBackSuccess) {
            this.props.callBackSuccess(this.record);
        }
    }

    abstract icon(): React.ReactNode;

    abstract onClick(record: any): void;
}
