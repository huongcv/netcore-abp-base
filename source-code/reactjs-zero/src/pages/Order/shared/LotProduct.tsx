import {PlusOutlined} from "@ant-design/icons";
import {StockProductUnitDto} from "@api/index.defs";
import StockDisplayEllipsisTextLong from "@ord-components/displays/StockDisplayEllipsisTextLong";
import {Delete2Icon} from "@ord-components/icon/DeleteIcon";
import DateUtil from "@ord-core/utils/date.util";
import UiUtils from "@ord-core/utils/ui.utils";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {IProductIItemFormInputProp} from "@pages/StockManagement/Shared/Upsert/grid-product/forms/model";
import {Button, Divider, Form, Modal, Select, Space, Tag} from "antd";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

interface LotDto {
    lotNumber: string;
    expiryDate: Date;
}

const renderOptionLot = (item: StockProductUnitDto) => {
    return {
        value: item.lotNumber,
        label: (
            <div className='inline-flex items-center'>
                <StockDisplayEllipsisTextLong className={"text-sm leading-5 inline-flex items-center"}
                                              text={item.lotNumber!} maxWidth={120}/>
                <span className={"ms-1 italic text-sm"}>
         - HSD: {DateUtil.showWithFormat(item.expiryDate)}
        </span>
            </div>
        ),
        data: item
    };
};

const LotProductInput = (props: IProductIItemFormInputProp) => {
    const {productItem, field, enableAddNewEntity} = props;
    const {isProductUseLotNumber} = productItem;
    const form = Form.useFormInstance();
    const [lotItem, setLotItem] = useState<LotDto | null>(null);
    const [lotOptionItems, setLotOptionItems] = useState<StockProductUnitDto[] | null>(
        null
    );
    const [showAddNewLot, setShowAddNewLot] = useState(false);
    const [t] = useTranslation("stock");
    const [addNewLotForm] = Form.useForm();

    const lotOptions = form.getFieldValue([StockMoveFormName.ProductItems, field.name, 'lotNumbers']);
    useEffect(() => {
        setLotOptionItems([...(lotOptions || [])]);
    }, [lotOptions]);
    const saveAddNewLot = (value: any) => {
        if (value) {
            const checkDuplicateLotNumber = lotOptions?.some(
                (lot: any) =>
                    lot.lotNumber?.trim().toLocaleLowerCase() ===
                    value?.lotNumber?.toString().trim().toLocaleLowerCase()
            );
            if (checkDuplicateLotNumber) {
                UiUtils.showError("Đã tồn tại số lô trong hệ thống");
                return;
            }
            setLotItem({
                ...value,
            });

            form.setFieldsValue({
                [StockMoveFormName.ProductItems]: {
                    [field.name]: {
                        lotNumber: value.lotNumber,
                        expiryDate: value.expiryDate,
                        isNewLot: true,
                        lotNumberId: null
                    },
                },
            });

            addNewLotForm.resetFields();
        }
        setShowAddNewLot(false);
    };
    const removeLot = () => {
        setLotItem(null);
        form.setFieldsValue({
            [StockMoveFormName.ProductItems]: {
                [field.name]: {
                    lotNumber: null,
                    expiryDate: null,
                    isNewLot: false,
                    lotNumberId: null
                },
            },
        });
    };


    const changeLotNumber = (lotItem: StockProductUnitDto) => {
        if (!lotItem.inventoryLineDetailsId) {
            UiUtils.showError("Không tìm thấy số lô");
            form.setFieldsValue({
                [StockMoveFormName.ProductItems]: {
                    [field.name]: {
                        lotNumber: null,
                        expiryDate: null,
                        isNewLot: false,
                        lotNumberId: null
                    },
                },
            });
            return;
        }

        form.setFieldsValue({
            [StockMoveFormName.ProductItems]: {
                [field.name]: {
                    lotNumber: lotItem.lotNumber,
                    expiryDate: lotItem.expiryDate,
                    isNewLot: false,
                    lotNumberId: lotItem.inventoryLineDetailsId
                },
            },
        });
    }

    return (
        <div>
            {isProductUseLotNumber && (
                <>
                    <Form.Item
                        name={[field.name, "lotNumberId"]}
                    >
                        {lotItem === null && (
                            <Select
                                options={lotOptionItems?.map((item) => renderOptionLot(item))}
                                onChange={(event, option: any) => {
                                    changeLotNumber(option.data);
                                }}
                                placeholder={t("selectLotNumberPlaceholder")}
                                className="w-full ord-input-bottom-line lot-number-select-import"
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        {enableAddNewEntity === true && (
                                            <>
                                                <Divider style={{margin: "8px 0"}}/>
                                                <Button
                                                    size={"small"}
                                                    onClick={() => setShowAddNewLot(true)}
                                                    type={"primary"}
                                                    icon={<PlusOutlined/>}
                                                >
                                                    {t("addNewLot")}
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}
                            />
                        )}
                        {lotItem !== null && (
                            <Space.Compact className='mt-2 inline-flex items-center'>
                                <Tag color="#87d068">
                                    <StockDisplayEllipsisTextLong text={lotItem.lotNumber}
                                                                  className='text-base inline-flex' maxWidth={120}/>
                                </Tag>
                                <Tag className='h-fit'>{DateUtil.showWithFormat(lotItem.expiryDate)} </Tag>
                                <Button type="text" danger onClick={() => {
                                    removeLot();
                                }} icon={<Delete2Icon/>}/>
                            </Space.Compact>
                        )}
                    </Form.Item>

                    <Modal
                        title={t("addNewLotNumberTitle", {...productItem})}
                        width={600}
                        open={showAddNewLot}
                        onCancel={() => {
                            addNewLotForm.resetFields();
                            setShowAddNewLot(false);
                        }}
                        footer={null}
                    >
                    </Modal>
                    <div hidden>
                        <Form.Item name={"lotItemFromExcel"}/>
                        <Form.Item name={[field.name, "expiryDate"]}
                                   rules={[ValidateUtils.requiredShortMess]}/>
                        <Form.Item name={[field.name, "lotNumber"]}
                                   rules={[ValidateUtils.requiredShortMess]}/>
                    </div>
                </>
            )}
        </div>
    );
};
export default LotProductInput;
