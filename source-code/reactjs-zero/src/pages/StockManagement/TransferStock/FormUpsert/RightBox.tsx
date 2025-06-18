import {Col, Form, Row} from "antd";
import {useTranslation} from "react-i18next";
import React, {useEffect} from "react";
import '../../Shared/Upsert/index.scss';
import {observer} from "mobx-react-lite";
import {useStore} from "@ord-store/index";
import {NoteInput} from "@pages/StockManagement/Shared/Upsert/right/forms/NoteInput";
import {IRightBoxProp} from "@pages/StockManagement/Shared/Upsert/Props";
import {SaveBtnGroup} from "@pages/StockManagement/Shared/Upsert/right/SaveBtnGroup";
import {MoveDateAndMoveCode} from "@pages/StockManagement/Shared/Upsert/right/forms/MoveDateAndMoveCode";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectShop} from "@ord-components/forms/select/selectDataSource/useSelectShop";
import Utils from "@ord-core/utils/utils";
import {MoveTypeHeader} from "@pages/StockManagement/Shared/Upsert/right/MoveTypeHeader";
import StockInitialValueInput from "@pages/StockManagement/Shared/Upsert/right/forms/StockInitialValueInput";
import {StockInventoryService} from "@api/StockInventoryService";
import {ShopService} from "@api/ShopService";

const TransferRightBox = (props: IRightBoxProp) => {
    const {formProductItems} = useUpsertStockMove();
    const [t] = useTranslation('stock');
    const {sessionStore, selectDataSourceStore} = useStore();

    const form = Form.useFormInstance();
    const shopId_w = Form.useWatch('shopId', form);
    const toShopId_w = Form.useWatch('toShopId', form);

    const productItems_w = Form.useWatch('productItems', formProductItems);

    useEffect(() => {
        let totalAmount = 0;
        const items: {
            totalAmount: number
        }[] = productItems_w || [];
        items.forEach(it => {
            totalAmount = totalAmount + (it.totalAmount || 0);
        });
        form.setFieldValue('totalAmount', Utils.parseFloatWithFixed(totalAmount));
    }, [productItems_w]);

    //set mặc định kho khi chọn cửa hàng
    useEffect(() => {
        StockInventoryService.getStockByShopId({
            shopId: toShopId_w
        }).then(data => {
            if (data?.length) {
                const find = data.find(x => x.data?.inventoryType == 1);
                form.setFieldValue('toInventoryId', find?.value ?? 0);
            }
        })

    }, [toShopId_w]);

    useEffect(() => {
        if (shopId_w) {
            clearDatasourceShop();
        }
    }, [shopId_w])

    const clearDatasourceShop = () => {
        const key = 'ShopId_exclude'
        selectDataSourceStore.clearByName(key);
        selectDataSourceStore.getOptions(key, async () => {
            const result = await ShopService.getComboOptions({
                body: {
                    excludeShopIds: [`${shopId_w}`]
                }
            });
            return Utils.mapCommonSelectOption(result);
        });
    };

    return (
        <div className='stock-right'>
            <Row gutter={16}>
                <MoveTypeHeader/>
                <MoveDateAndMoveCode/>
                <Col span={24}>
                    <FloatLabel label={(
                        <span>
                                {t('transfer.fromShopId')}
                            </span>

                    )} required>
                        <Form.Item name={'shopId'} rules={[ValidateUtils.requiredShortMess]}
                                   initialValue={sessionStore.currentShopId}>
                            <OrdSelect datasource={useSelectShop()} disabled/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <StockInitialValueInput/>
                <Col span={24}>
                    <FloatLabel label={(
                        <span>
                                {t('transfer.toShop')}
                            </span>

                    )} required>
                        <Form.Item name={'toShopId'} rules={[ValidateUtils.requiredShortMess]}>
                            <OrdSelect datasource={useSelectShop(false, shopId_w > 0 ? [shopId_w.toString()] : [])}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                {/*<Col span={24}>*/}
                {/*    <FloatLabel label={(*/}
                {/*        <span>*/}
                {/*                {t('transfer.toInventory')}*/}
                {/*            </span>*/}

                {/*    )} required>*/}
                {/*        <Form.Item name={'toInventoryId'} rules={[ValidateUtils.requiredShortMess]}>*/}
                {/*            <OrdSelect datasource={useSelectStockByShopId(toShopId_w)}></OrdSelect>*/}
                {/*        </Form.Item>*/}
                {/*    </FloatLabel>*/}
                {/*</Col>*/}
                <Form.Item noStyle name={'toInventoryId'}></Form.Item>
                <Col span={24}>
                    <FloatLabel label={(
                        <span>
                                {t('transferStock.totalAmount')}
                            </span>

                    )} required>
                        <Form.Item name={'totalAmount'}>
                            <PriceNumberInput disabled></PriceNumberInput>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <NoteInput/>
            </Row>
            <SaveBtnGroup {...props}/>
        </div>
    );
}
export default observer(TransferRightBox);
