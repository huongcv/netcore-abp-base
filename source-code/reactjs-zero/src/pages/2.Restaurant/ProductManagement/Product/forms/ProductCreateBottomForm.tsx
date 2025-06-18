import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {Row, Tabs, TabsProps} from "antd";
import {observer} from "mobx-react-lite";
import {ProductUnitBoxForm} from "@pages/ProductManagement/Product/forms/units/ProductUnitBox";
import {ModeProps} from "@pages/ProductManagement/Product/forms/units/ProductUnitTableFormList";

const ProductCreateBottomForm = (props: ModeProps) => {
    const [t] = useTranslation(['product']);
    const [items, setItems] = useState<TabsProps['items']>([
        {
            key: '1',
            label: t('ListUnits'),
            children: <>
                <Row gutter={[16, 16]}>
                    <ProductUnitBoxForm mode={props.mode}/>
                </Row>
            </>,
        }
    ]);

    return (<div className={'w-full'}>
        {<>
            <Tabs defaultActiveKey="1"
                  className={"ml-1.5"}
                  tabBarStyle={{
                      background: "#EEEEEE",
                      color: "#45494E",
                      fontSize: "16px",
                      fontWeight: 500,
                      borderRadius: '6px',
                      padding: '0 10px',
                      height: '45px'
                  }}
                  tabBarExtraContent={<>
                  </>}
                  items={items}/>
        </>}
    </div>);
};


export default observer(ProductCreateBottomForm);