import {Form, Input, InputNumber, Space} from "antd";
import {useEnterToNext} from "@pages/SalesInvoice/Utils/useEnterToNext";
import {EventHandler, useContext, useEffect, useState} from "react";
import {ProductService} from "@api/ProductService";
import UiUtils from "@ord-core/utils/ui.utils";
import {SellContext} from "@pages/SalesInvoice/Sell";
import {ProductDto} from "@api/index.defs";
import {CloseOutlined} from "@ant-design/icons";

export const BarcodeSearchForm = (props:{
    searchBarcode: boolean,
    selectProductHandle: EventHandler<any>,
}) => {
    const form = Form.useFormInstance();
    const { handleKeyPress, registerInput, handleFocus, inputsRef } = useEnterToNext(2);
    // @ts-ignore
    const {formSearch} = useContext(SellContext);
    const [product, setProduct] = useState<ProductDto>();
    const [barcodeInputDisabled, setBarcodeInputDisabled] = useState(false);

    useEffect(() => {
        if(props.searchBarcode) {
            handleFocus(0);
        }
    }, [props.searchBarcode]);

    const handleBarcode = (e:any) => {
        if(e.key === 'Enter') {
            getProductByBarCode();
        }
    }

    const handleInputNumber = (e:any) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            const num = form.getFieldValue('productQty');

            // @ts-ignore
            product['qty'] = num;
            props.selectProductHandle(product);
            clear();
        }
    }

    const getProductByBarCode = () => {
        const barcode = form.getFieldValue('barcode');
        const num = form.getFieldValue('productQty');
        const priceListId = formSearch.getFieldValue('priceListId');
        UiUtils.setBusy();
        ProductService.getByBarcode({body: {barCode: barcode, priceListId: priceListId}}).then(rsp => {
            if(rsp.isSuccessful) {
                const product = rsp.data;
                setValueAndDisable(product);
                handleFocus(1);
            } else {
                // @ts-ignore
                inputsRef.current[0]?.select();
                UiUtils.showError(rsp.errorDetail?.message)
            }
            UiUtils.clearBusy();
        })
    }

    const setValueAndDisable = (product?: ProductDto) => {
        setProduct(product);
        form.setFieldValue('barcode', product?.productName);
        setBarcodeInputDisabled(true);
    }

    const clear = () => {
        setProduct({})
        setBarcodeInputDisabled(false);
        form.setFieldValue('barcode', null)
        form.setFieldValue('productQty', null)
        setTimeout(() => {handleFocus(0)}, 500);
        // handleFocus(0);
    }

    return <>
        <Space.Compact style={{width:'100%'}}>
            <Form.Item style={{flex: 1}} name="barcode">
                <Input disabled={barcodeInputDisabled}
                       ref={registerInput(0)}
                       onKeyDown={(e) => handleBarcode(e)}
                       placeholder="Nhập barcode"
                       suffix={barcodeInputDisabled && <CloseOutlined onClick={clear} />}/>
            </Form.Item>
            <Form.Item name="productQty">
                <InputNumber ref={registerInput(1)}
                             onKeyDown={(e) => handleInputNumber(e)}
                             placeholder="Số lượng" controls={false} step={1} style={{width: 100, borderRadius: 0}}/>
            </Form.Item>
        </Space.Compact>
    </>
}
