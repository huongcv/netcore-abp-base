import {Button, Col, Form, Row} from "antd";
import React from "react";
import {IRightBoxProp} from "@pages/StockManagement/Shared/Upsert/Props";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";

export const SaveBtnGroup = (props: IRightBoxProp) => {
    const [t] = useTranslation('stock');
    const {stockMoveStore} = useStore();
    const form = Form.useFormInstance();
    const moveStatus_w = Form.useWatch('moveStatus', form);
    useHotkeys('F9', (event) => {
        props.onSave(false);
        event.preventDefault();
    }, {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true});
    useHotkeys('F8', (event) => {
        props.onSave(true);
        event.preventDefault();
    }, {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true});
    return (<div className='btn-save-group'>
        <Row gutter={12} className={'mt-2'}>
            {
                moveStatus_w !== 4 && <Col span={12}>
                    <Button className={'w-full'} onClick={() => props.onSave(true)}
                            disabled={moveStatus_w === 4}>
                        {t('draftSave')}
                    </Button>
                </Col>
            }
            <Col span={moveStatus_w !== 4 ? 12 : 24}>
                <Button className={'w-full'} onClick={() => props.onSave(false)} type={'primary'}>
                    {t('save')}
                </Button>
            </Col>

        </Row>
    </div>);
}
