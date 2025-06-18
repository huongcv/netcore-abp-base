import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {StockInventoryDto} from "@api/index.defs";
import {Space, Tag} from "antd";
import {CheckOutlined, PhoneOutlined} from "@ant-design/icons";
import {StockInventoryService} from "@api/StockInventoryService";

export const useSelectStock = (): SelectDataSource => {
    const key = 'Stock';

    return useSelectDataSource(key, async () => {
        const result = await StockInventoryService.getComboOptions({});
        if (!result || result.length === 0) {
            return [];
        }
        return result.map(it => {
            return {
                ...StockInventoryRenderSelectItem(it.data)
            }
        });
    });
};

export const useSelectStockByShopId = (shopId: number): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = 'StockByShoId' + shopId;

    return useSelectDataSource(key, async () => {
        if (!(shopId > 0)) {
            return [];
        }
        const result = await StockInventoryService.getStockByShopId({
            shopId: shopId
        });
        if (!result || result.length === 0) {
            return [];
        }
        return result.map(it => {
            return {
                ...StockInventoryRenderSelectItem(it.data),
                data: it.data
            }
        });
    });
};


export const StockInventoryRenderSelectItem = (dto: StockInventoryDto) => {
    return {
        value: dto.id,
        label: (<Space.Compact>
            <span className='mx-1'>{dto.inventoryName}</span>
            {/*{*/}
            {/*    dto.inventoryType === 1 && <CheckOutlined/>*/}
            {/*}*/}
        </Space.Compact>),
        data: {...dto},
        fts: Utils.removeAccentVietnamese([
            dto.inventoryName,
            dto.inventoryCode,
            dto.inventoryTel,
            dto.inventoryEmail,
            dto.inventoryAddress]),
    }
}


export const StockInventoryLabel = (props: {
    dto: StockInventoryDto
}) => {
    const {dto} = props;
    return (<>
        {
            dto && (<>
                <Space.Compact>
                    <b>{dto?.inventoryName}</b>
                    {
                        dto.inventoryCode && <Tag className='mx-1'>{dto.inventoryCode}</Tag>
                    }
                    {
                        dto.inventoryType === 1 && <CheckOutlined/>
                    }
                    {
                        dto.inventoryTel && <Tag color={'blue'}>
                            <PhoneOutlined></PhoneOutlined> {dto.inventoryTel}
                        </Tag>
                    }

                </Space.Compact>
                {
                    dto.inventoryAddress && <div className='italic'>{dto.inventoryAddress}</div>
                }
            </>)

        }
    </>)
}
