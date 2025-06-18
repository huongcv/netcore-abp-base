import {Button, Form, Input, Space} from "antd";
import {BarcodeIcon} from "@ord-components/icon/BarcodeIcon";
import {SearchIcon} from "@ord-components/icon/SearchIcon";
import {SearchOutlined} from "@ant-design/icons";
import {ReloadIcon} from "@ord-components/icon/ReloadIcon";
import {BarcodeSearchForm} from "@pages/SalesInvoice/Form/barcodeSearchForm";
import {ListStyle} from "@pages/SalesInvoice/Utils/saleCommon";
import {ListIcon} from "@ord-components/icon/ListIcon";
import {GridIcon} from "@ord-components/icon/GridIcon";
import * as React from "react";
import {useRef} from "react";
import {ISellSearchProps} from "@pages/SalesInvoice/Sell/components/search-product/index";
import {useHotkeys} from "react-hotkeys-hook";

const SearchBarCode = () => {
    const form = Form.useFormInstance();
    const searchBarcode = Form.useWatch('searchBarcode');
    return (<>
        {!searchBarcode ?
            <Button onClick={() => {
                form.setFieldValue('searchBarcode', !searchBarcode)
            }}
                    title={!searchBarcode ? "Search by Barcode" : "Search by Keyboard"}
                    className={!searchBarcode ? "border-red text-red" : 'primary'}><BarcodeIcon/></Button>
            : <Button onClick={() => {
                form.setFieldValue('searchBarcode', false)
            }}
                      title={"Search by Keyboard"}
                      type={'primary'}><BarcodeIcon/></Button>
        }
    </>);
}
const SearchInput = (props: ISellSearchProps) => {
    const form = Form.useFormInstance();
    const inputSearch = useRef(null);
    const searchBarcode = Form.useWatch('searchBarcode');
    useHotkeys('F3', (event) => {
        // @ts-ignore
        inputSearch.current.focus();
        event.preventDefault();
    }, {scopes: ['crudPageBase'], enableOnFormTags: true})
    return (<>
        <div className="flex-1">
            {!searchBarcode && <Space.Compact style={{width: '100%'}}>
                <Form.Item name='filter' className='flex-auto'>
                    <Input prefix={<SearchIcon/>} placeholder="Tìm kiếm..." allowClear ref={inputSearch}/>
                </Form.Item>
                <Button hidden type='primary' htmlType={'submit'}><SearchOutlined/></Button>
                <Button type='default' onClick={() => {
                    form.setFieldValue('filter', '');
                }}
                        className="bg-gray-100 border-l-0"><ReloadIcon/></Button>
            </Space.Compact>}
            {searchBarcode &&
                <BarcodeSearchForm searchBarcode={searchBarcode} selectProductHandle={props.onProductSelected}/>}
        </div>

    </>);
}

export const SellProductInputSearch = (props: ISellSearchProps) => {
    const listStyle = Form.useWatch('listStyle');
    const form = Form.useFormInstance();
    return (<>
        <div hidden>
            <Form.Item name={'listStyle'} initialValue={ListStyle.GRID}></Form.Item>
            <Form.Item name={'searchBarcode'} initialValue={false}></Form.Item>
        </div>
        <div className="flex gap-2">
            <SearchBarCode/>
            <SearchInput {...props}/>
            <Button onClick={() => form.setFieldValue('listStyle', ListStyle.LIST)}
                    className={listStyle == ListStyle.LIST ? 'border-[#45494E]' : ''}><ListIcon/></Button>
            <Button onClick={() => form.setFieldValue('listStyle', ListStyle.GRID)}
                    className={listStyle == ListStyle.GRID ? 'border-[#45494E]' : ''}><GridIcon/></Button>
        </div>

    </>)
}
