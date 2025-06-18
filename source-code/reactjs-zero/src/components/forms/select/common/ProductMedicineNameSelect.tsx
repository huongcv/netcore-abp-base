import type {AutoCompleteProps} from "antd";
import {AutoComplete, Col, Row, Spin} from "antd";
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState,} from "react";
import debounce from "lodash/debounce";
import {useTranslation} from "react-i18next";
import {ProductDetailDto} from "@api/index.defs";
import {TemplateProductService} from "@api/TemplateProductService";
import "./ProductMedicineNameSelect.scss";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";

interface ProductMedicineNameAutoCompleteProps extends AutoCompleteProps {
    onProductSelected?: (dto: ProductDetailDto | undefined) => void;
}

const ProductMedicineNameSelect = forwardRef<
    any,
    ProductMedicineNameAutoCompleteProps
>((props, ref) => {
    const inputRef = useRef<any>(null);
    const {value, onProductSelected, ...restProps} = props;
    const {t} = useTranslation("product");
    const [data, setData] = useState<ProductDetailDto[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState<string | undefined>(value); // để hiển thị productName
    // const [selectedId, setSelectedId] = useState<string | undefined>();

    const limit = 20;

    const fetchData = async (keyword: string) => {
        setLoading(true);
        try {
            const res = await TemplateProductService.getComboOptionTemplateProduct({
                body: {
                    maxResultCount: limit,
                    skipCount: 0,
                    filter: keyword,
                    type: -1,
                },
            });
            setData(res.items as ProductDetailDto[]);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    const debounceSearch = useCallback(
        debounce((value: string) => {
            fetchData(value);
        }, 400),
        []
    );

    useEffect(() => {
        if (search) debounceSearch(search);
        else setData([]);
    }, [search]);

    const handleSelect = (value: string, option: any) => {
        const selectedDto = data.find(
            (d) => d.productDto?.templateProductId?.toString() === value
        );
        if (selectedDto) {
            setInputValue(selectedDto.productDto?.productName); // Hiển thị tên lên input
            // setSelectedId(value);
            if (onProductSelected) onProductSelected(selectedDto);
        }
    };

    const handleSearch = (val: string) => {
        setInputValue(val);
        setSearch(val);
    };

    const RowOptionsProductMedicineDto = ({
                                              item,
                                          }: {
        item: ProductDetailDto;
    }) => {
        const resizeObject = item.productDto?.productDrug;
        return (
            <Row className="w-full" gutter={[8, 4]} wrap>
                <Col span={4} className="rowOptionsProductMedicineDto">
                    <TextLineClampDisplay
                        rows={2}
                        content={item.productDto?.productName || ''}
                        className="!text-base"
                    />
                </Col>
                <Col span={4} className="rowOptionsProductMedicineDto">
                    <TextLineClampDisplay
                        rows={2}
                        content={resizeObject?.registrationNumber || ''}
                        className="!text-base"
                    />
                </Col>
                <Col span={4} className="rowOptionsProductMedicineDto">
                    <TextLineClampDisplay
                        rows={2}
                        content={resizeObject?.mainIngredient || ''}
                        className="!text-base"
                    />
                </Col>
                <Col span={4} className="rowOptionsProductMedicineDto">
                    <TextLineClampDisplay
                        rows={2}
                        content={resizeObject?.concentration || ''}
                        className="!text-base"
                    />
                </Col>
                <Col span={4} className="rowOptionsProductMedicineDto">
                    <TextLineClampDisplay
                        rows={2}
                        content={resizeObject?.packagingSpecifications || ''}
                        className="!text-base"
                    />
                </Col>
                <Col span={4} className="rowOptionsProductMedicineDto">
                    <TextLineClampDisplay
                        rows={2}
                        content={resizeObject?.manufacturer || ''}
                        className="!text-base"
                    />
                </Col>
            </Row>
        );
    };

    const HeaderRowOptionsProductMedicineDto = () => (
        <Row className="w-full px-3 font-bold py-2" gutter={[8, 4]}>
            <Col span={4}>{t("TemplateProduct.productName")}</Col>
            <Col span={4}>{t("TemplateProduct.numberRegister")}</Col>
            <Col span={4}>{t("TemplateProduct.ingredients")}</Col>
            <Col span={4}>{t("TemplateProduct.hamLuong")}</Col>
            <Col span={4}>{t("TemplateProduct.packingSpecifications")}</Col>
            <Col span={4}>{t("TemplateProduct.manufacturingCompany")}</Col>
        </Row>
    );

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        },
        getValue: () => inputValue,
    }));

    return (
        <AutoComplete
            ref={inputRef}
            value={inputValue}
            className={"w-full " + restProps?.className}
            options={data.map((item) => ({
                label: <RowOptionsProductMedicineDto item={item}/>,
                value: item.productDto?.templateProductId?.toString(),
            }))}
            onSelect={handleSelect}
            onSearch={handleSearch}
            popupClassName="popupClassNameCustome"
            notFoundContent={loading ? <Spin size="small"/> : null}
            dropdownRender={(menu) => (
                <>
                    <HeaderRowOptionsProductMedicineDto/>
                    {menu}
                </>
            )}
            {...restProps}
        />
    );
});

export default ProductMedicineNameSelect;
