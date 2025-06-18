import React, {useEffect, useState} from "react";
import {Form, FormListFieldData} from "antd";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {useTranslation} from "react-i18next";
import Utils from "@ord-core/utils/utils";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {GdpOrderStockMoveDetailDto} from "@api/index.defs";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

const DiscountGdpOrderProduct = (props: {
    field: FormListFieldData,
    productItem: GdpOrderStockMoveDetailDto,
    enableAddNewEntity?: boolean
}) => {
    const {productItem, field} = props;
    const [maxDiscountValue, setMaxDiscountValue] = useState(0);
    const [discountTypeDisplay, setDiscountTypeDisplay] = useState('%');
    const form = Form.useFormInstance();
    const [t] = useTranslation('stock');
    const [tCommon] = useTranslation();

    function getFieldForm(name: string) {
        return [StockMoveFormName.ProductItems, field.name, name]
    }

    const itemValue_w = Form.useWatch([StockMoveFormName.ProductItems, field.name], form);
    const discountValue_w = Form.useWatch(getFieldForm('discountValue'), form);
    const discountType_w = Form.useWatch(getFieldForm('discountType'), form);
    const discountAmountAllocation_w = Form.useWatch(getFieldForm('discountAmountAllocation'), form);
    const totalAmountAfterDiscount_w = Form.useWatch(getFieldForm('totalAmountAfterDiscount'), form);
    const totalAmountBeforeTax_w = Form.useWatch(getFieldForm('totalAmountBeforeTax'), form);
    const totalAmountBeforeDiscount_w = Form.useWatch(getFieldForm('totalAmountBeforeDiscount'), form);
    const discountAmount_w = Form.useWatch(getFieldForm('discountAmount'), form);
    useEffect(() => {
        if (totalAmountBeforeDiscount_w > 0) {
            setMaxDiscountValue(totalAmountBeforeDiscount_w);
        }
    }, [totalAmountBeforeDiscount_w, discountType_w]);
    useEffect(() => {
            form.setFieldValue(getFieldForm('totalAmountAfterDiscount'),
                (totalAmountBeforeDiscount_w || 0) - (discountAmount_w || 0));
        },
        [discountType_w,
            discountValue_w,
            totalAmountBeforeDiscount_w,
            discountAmount_w]);

    useEffect(() => {
        const discountAmountAllocation = discountAmountAllocation_w || 0;
        const totalAmountAfterDiscount = totalAmountAfterDiscount_w || 0;
        form.setFieldValue(getFieldForm('totalAmountBeforeTax'), totalAmountAfterDiscount - discountAmountAllocation);
    }, [discountAmountAllocation_w, totalAmountAfterDiscount_w]);

    const inputDiscountAmountChange = (discountAmount: number) => {
        form.setFieldValue('discountType', DiscountTypeEnum.Value);
        const totalAmountBeforeDiscount = form.getFieldValue(getFieldForm('totalAmountBeforeDiscount')) || 0;
        let discountValue = 0;
        if (totalAmountBeforeDiscount > 0) {
            discountValue = discountAmount * 100 / totalAmountBeforeDiscount;
        }
        form.setFieldValue(getFieldForm('discountValue'), Utils.parseFloatWithFixed(discountValue, 2));
    }
    const inputPercentAmountChange = (percent: number) => {
        form.setFieldValue('discountType', DiscountTypeEnum.Percent);
        const totalAmountBeforeDiscount = form.getFieldValue(getFieldForm('totalAmountBeforeDiscount')) || 0;
        let discountAmount = 0;
        if (totalAmountBeforeDiscount > 0) {
            discountAmount = percent * totalAmountBeforeDiscount / 100;
        }
        form.setFieldValue(getFieldForm('discountAmount'), Utils.setPriceWithFixed(discountAmount, true));
    }
    return (<>
        <Form.Item noStyle name={[field.name, 'discountValue']} initialValue={0}>
            <PriceNumberInput className={'not-handler-wrap text-right ord-input-bottom-line'}
                              onChange={(v: any) => {
                                  inputPercentAmountChange(v || 0);
                              }}
                              max={100}
                              min={0}
                              addonAfter={'%'}/>
        </Form.Item>
        <Form.Item noStyle name={[field.name, 'discountAmount']} initialValue={0}>
            <PriceNumberInput className={'not-handler-wrap text-right ord-input-bottom-line'}
                              onChange={(v: any) => {
                                  inputDiscountAmountChange(v || 0);
                              }}
                              max={maxDiscountValue}
                              min={0}
                              addonAfter={'VNĐ'}/>
        </Form.Item>
        <p hidden>
            <Form.Item noStyle name={[field.name, 'discountType']} initialValue={2}/>
            <Form.Item noStyle name={[field.name, 'discountValue']}/>
            <Form.Item noStyle name={[field.name, 'discountAmount']}/>
            <Form.Item noStyle name={[field.name, 'discountAmountAllocation']}/>
            <Form.Item noStyle name={[field.name, 'totalAmountBeforeTax']}/>
        </p>
    </>);
}
export default DiscountGdpOrderProduct;


// const setDiscountContent = (<div style={{width: 250}} className='relative'>
//     <Row>
//         <Col span={8}></Col>
//         <Col span={16}>
//             <Form.Item noStyle className={'ms-2'} name={[field.name, 'discountType']} initialValue={2}>
//                 <Radio.Group>
//                     <Radio value={2}>%</Radio>
//                     <Radio value={1}>{tCommon('basicCurrency')}</Radio>
//                 </Radio.Group>
//             </Form.Item>
//         </Col>
//         <Col span={8}>
//             {
//                 t('discountValue')
//             }
//         </Col>
//         <Col span={16}>
//             <Form.Item noStyle name={[field.name, 'discountValue']} initialValue={0}>
//                 <PriceNumberInput className={'not-handler-wrap text-right'}
//                                   max={maxDiscountValue}
//                                   min={0}
//                                   addonAfter={discountTypeDisplay}/>
//             </Form.Item>
//         </Col>
//
//     </Row>
//     <Row className='mt-2'>
//         <Col span={8}>{t('productAmount')}</Col>
//         <Col span={16}>
//             <PriceCell value={totalAmountBeforeDiscount_w}></PriceCell>
//         </Col>
//         <Col span={8}>
//             {t('discountAmount')}
//         </Col>
//         <Col span={16}>
//             <PriceCell value={useWatch([StockMoveFormName.ProductItems, field.name, 'discountAmount'], form)}></PriceCell>
//         </Col>
//         <Col span={8}>
//             {t('afterAmount')}
//         </Col>
//         <Col span={16}>
//             <PriceCell value={totalAmountAfterDiscount_w}></PriceCell>
//         </Col>
//     </Row>
// </div>);

// const setDiscountContent = (<div style={{width: 250}} className='relative'>
//     <Row>
//         <Col span={8}></Col>
//         <Col span={16}>
//             <Form.Item noStyle className={'ms-2'} name={[field.name, 'discountType']} initialValue={2}>
//                 <Radio.Group>
//                     <Radio value={2}>%</Radio>
//                     <Radio value={1}>{tCommon('basicCurrency')}</Radio>
//                 </Radio.Group>
//             </Form.Item>
//         </Col>
//         <Col span={8}>
//             {
//                 t('discountValue')
//             }
//         </Col>
//         <Col span={16}>
//             <Form.Item noStyle name={[field.name, 'discountValue']} initialValue={0}>
//                 <PriceNumberInput className={'not-handler-wrap text-right'}
//                                   max={maxDiscountValue}
//                                   min={0}
//                                   addonAfter={discountTypeDisplay}/>
//             </Form.Item>
//         </Col>
//
//     </Row>
//     <Row className='mt-2'>
//         <Col span={8}>{t('productAmount')}</Col>
//         <Col span={16}>
//             <PriceCell value={totalAmountBeforeDiscount_w}></PriceCell>
//         </Col>
//         <Col span={8}>
//             {t('discountAmount')}
//         </Col>
//         <Col span={16}>
//             <PriceCell value={useWatch([StockMoveFormName.ProductItems, field.name, 'discountAmount'], form)}></PriceCell>
//         </Col>
//         <Col span={8}>
//             {t('afterAmount')}
//         </Col>
//         <Col span={16}>
//             <PriceCell value={totalAmountAfterDiscount_w}></PriceCell>
//         </Col>
//     </Row>
// </div>);
