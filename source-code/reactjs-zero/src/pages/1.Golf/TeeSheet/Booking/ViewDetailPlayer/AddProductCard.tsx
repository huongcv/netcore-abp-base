import React, {useEffect, useState} from 'react';
import {CheckCircleOutlined, CloseOutlined, SaveOutlined} from "@ant-design/icons";
import {Button, Card, Spin} from "antd";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {GolfProductService} from "@api/GolfProductService";
import {
    BookingInvoiceTempDto,
    FlightSlot,
    GolfFlightOutputDto,
    GolfProductSimpleDto, PlayerInfoByIdOutputDto,
    ProductForPlayerProductInputDto,
    ProductTypeGolfServiceEnum
} from "@api/index.defs";
import Utils from "@ord-core/utils/utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {Dictionary, groupBy} from "lodash";
import {GolfIcon} from "@ord-components/icon/GolfIcon";
import {BuggyIcon} from "@ord-components/icon/BuggyIcon";
import {CaddyIcon} from "@ord-components/icon/CaddyIcon";
import {CardIcon} from "@ord-components/icon/CardIcon";
import {CartIcon} from "@ord-components/icon/CartIcon";


export interface IAddProductTemp extends ProductForPlayerProductInputDto {
}

function AddProductCard(props: {
    info: PlayerInfoByIdOutputDto,
    onClose: () => void,
}) {
    const {
        golfSelectProductStore
    } = useStore();
    const {t} = useTranslation(golfSelectProductStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');
    const [datasource, setDatasource] = React.useState<Dictionary<GolfProductSimpleDto[]>>();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        GolfProductService.getProductSimpleDto()
            .then(res => {
                const tGr = groupBy(res, 'productCategoryId');
                setDatasource(tGr);
                setIsLoading(false);
            })
    }, []);

    function onSave() {
        if( props.info.playerInfo?.id &&  props.info.bookingInfo?.id){
            UiUtils.setBusy();
            golfSelectProductStore.saveProductTemplate({
                bookingPlayerId: props.info.playerInfo?.id,
                bookingId: props.info.bookingInfo?.id
            })
                .then(res => {
                    UiUtils.clearBusy();
                    if (res.isSuccessful) {
                        golfSelectProductStore.afterSaveProductTemplate()
                    } else {
                        UiUtils.showError(res.message);
                    }
                }, () => {
                    UiUtils.showError("error");
                    UiUtils.clearBusy();
                })
        }

    }

    const IconByCategoryId = (props: {
        categoryId: string
    }) => {
        const dataCv = parseInt(props.categoryId) as ProductTypeGolfServiceEnum;
        switch (dataCv) {
            case 600:
                return <GolfIcon className='pr-1.5'></GolfIcon>
            case 601:
                return <BuggyIcon className='pr-1.5'></BuggyIcon>
            case 602:
                return <CaddyIcon className='pr-1.5'></CaddyIcon>

            case 604:
                break;
            case 605:
                break;
        }
        return <></>
    }
    return (
        <Card
            className={`w-full h-full`}
            size={"small"}
            style={{
                borderRadius: 0,
                display: 'flex', flexDirection: 'column'
            }}
            styles={{
                body: {
                    flex: 1, overflowY: 'auto'
                }
            }}
            title={<>
                {t('addProduct')}
            </>}
            actions={[
                <Button className='w-full' type='primary'
                        onClick={() => {
                            onSave();
                        }}>
                    <SaveOutlined/> {t('save')}
                </Button>
            ]}
            extra={<>
                <Button size='small' className='w-6' onClick={() => {
                    let haveProduct = false;
                    if(golfSelectProductStore.productAddTempData.listProduct.length>0){
                        haveProduct = true;
                    }
                    if(haveProduct) {
                        UiUtils.showConfirm({
                            title: t("checkSaveProduct"),
                            icon: "custome",
                            customIcon: <CartIcon width={100} height={100}/>,
                            content:  t('checkSaveProductContent'),
                            // okLabel: "Checkin",
                            onOk: (d) => {
                                onSave();
                            },
                            onCancel: () => {
                                props.onClose()
                            },
                        });
                    }else {
                        props.onClose()
                    }
                }}> <CloseOutlined></CloseOutlined> </Button>
            </>}

        >
            <div className="w-full h-full space-y-4">
                <Spin spinning={isLoading}>
                    {Object.entries(datasource ?? {}).map(([categoryId, items]) => (
                        <div key={categoryId} className="mb-4">
                            <h3 className="text-xs font-semibold text-gray-400 mb-1"
                                style={{display: "flex", alignItems: "center"}}>
                                <IconByCategoryId categoryId={categoryId}></IconByCategoryId>
                                {tEnum(`ProductTypeGolfServiceEnum.${categoryId}`) ?? `Category ${categoryId}`}
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            golfSelectProductStore.addProductToTemp(item);
                                        }}
                                        className="p-3 bg-gray-100 rounded shadow-sm hover:bg-gray-200 cursor-pointer"
                                    >
                                        <div
                                            className="text-sm font-medium text-gray-700 truncate">{item.productName}</div>
                                        <div
                                            className="text-sm text-gray-600">{Utils.formatterNumber(item.productPrice ?? 0)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Spin>
            </div>
        </Card>
    );
}

export default AddProductCard;
