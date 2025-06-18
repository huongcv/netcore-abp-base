import {ComponentType, useEffect} from "react";
import {useStore} from "@ord-store/index";
import {observer} from "mobx-react-lite";
import {Spin} from "antd";
import {IFormSettingShop_General} from "@pages/System/ShopSetting/setting-name.const";


export interface PartnerSettingWrapperProps {
    setting?: IFormSettingShop_General,
}

export function withPartnerSetting<T>(WrappedComponent: ComponentType<PartnerSettingWrapperProps>) {
    return observer(function DataTableFetchingComponent(props: T) {
        const {generalInfoSettingStore: store} = useStore();

        useEffect(() => {
            store.getSettingInfo().then();
        }, []);
        useEffect(() => {

        }, [store.settings]);

        return (
            <Spin spinning={store.loadingSetting}>
                <WrappedComponent {...props}
                                  setting={store.settings}
                />
            </Spin>
        );
    })
}
