import {Input, Modal} from "antd";
import {useTranslation} from "react-i18next";
import React from "react";

interface IProp {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    count: number;
    userName?: string;
    reason: string;
    setReason: (value: string) => void;
}

export const ConfirmRevokeModal: React.FC<IProp> = ({
                                                        open,
                                                        onCancel,
                                                        onConfirm,
                                                        count,
                                                        userName,
                                                        reason,
                                                        setReason
                                                    }) => {
    const {t: tConfirm} = useTranslation("confirm");

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            onOk={onConfirm}
            title={tConfirm("revokeToken.title")}
            okText={tConfirm("okText")}
            cancelText={tConfirm("cancelText")}
        >
            <div>
                <b>
                    {tConfirm("revokeToken.description", {
                        count,
                        userName
                    })}
                </b>
                <div style={{marginTop: '12px'}}>
                    <label>{tConfirm("revokeToken.revokeReason")}</label>
                    <Input.TextArea
                        rows={3}
                        maxLength={100}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
            </div>
        </Modal>
    );
};
