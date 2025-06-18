import React, {useEffect, useState} from "react";
import {Modal} from "antd";
import {TenantDto} from "@api/index.defs";
import Shop from "../Shop";

interface Prop {
    tenant?: TenantDto | null;
}

const ShopListModal = ({tenant}: Prop) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOk = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        if (!!tenant) {
            setIsModalOpen(true);
        }
    }, [tenant]);

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            {
                isModalOpen ? (<Modal title="Basic Modal"
                                      width={'100vw'}
                                      style={{
                                          top: 2
                                      }}
                                      open={isModalOpen}
                                      onOk={handleOk}
                                      onCancel={handleCancel}>
                    <Shop/>
                </Modal>) : null
            }
        </>

    )
}
export default ShopListModal;
