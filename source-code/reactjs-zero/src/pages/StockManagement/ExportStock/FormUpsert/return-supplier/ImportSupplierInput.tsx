import {SearchOutlined} from "@ant-design/icons";
import {ImportStockService} from "@api/ImportStockService";
import FloatLabel from "@ord-components/forms/FloatLabel";
import UiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import ModalTableImportStockMain from "@pages/StockManagement/ExportStock/ModalTableImportStockMain";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {StockUtil} from "@pages/StockManagement/Shared/StockUtil";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {Button, Col, Form, Input, Space} from "antd";
import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import Utils from "@ord-core/utils/utils";

export const ImportSupplierInput = () => {
    const {formMoveTicket, editData, formProductItems} = useUpsertStockMove();
    const navigate = useNavigate();
    const disabledRef = useRef(false);
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));
    const {id} = useParams();

    const {exportStockMoveStore} = useStore();
    const [t] = useTranslation('stock');

    const onSearch = () => {
        exportStockMoveStore.openDetail();
    }

    useEffect(() => {
        if (id && location.href.includes('add-new-supplier-from-move')) {
            loadImportMove(id).then();
        }
    }, [id]);

    const loadImportMove = async (relatedMoveIdHash: string) => {
        const response = await ImportStockService.getReturnById({
            idHash: relatedMoveIdHash
        });

        if (!response.isSuccessful) {
            UiUtils.showError(response.message);
            navigate(pathNameRef.current + '/export-supplier');
            return;
        }

        const importDto = response.data || {};
        const items = importDto.items || [];

        formProductItems.setFieldsValue({
            productItems: items.map((it) => {
                return {
                    ...StockUtil.bindProductValueRelatedIntoForm(it)
                };
            }),
        });

        //set idHash cua phieu xuat tra la idHash cua phieu nhap
        const moveDto = importDto.moveDto;
        formMoveTicket.setFieldsValue({
            relatedMoveId: moveDto?.moveId,
            relatedMoveIdHash: moveDto?.relatedMoveIdHash,
            relatedMoveCode: moveDto?.moveCode,
            partnerId: moveDto?.partnerId,
            partnerType: moveDto?.partnerType,
            inventoryId: moveDto?.inventoryId,
            discountValue: moveDto?.discountValue,
            discountType: moveDto?.discountType,
            discountAmount: moveDto?.discountAmount,
            taxDiscountPercent: moveDto?.taxDiscountPercent,
            paymentAmount: moveDto?.paymentAmount,
            debtAmount: moveDto?.debtAmount,
        });
    }

    useEffect(() => {
        disabledRef.current = editData?.moveDto?.moveType === MoveType.PhieuXuatTraNhaCungCap
    }, [editData])

    return (<>
        <Col span={24}>
            <FloatLabel label={t('returnForImportMoveLabel')}>
                <Space wrap>
                    <Form.Item name={'relatedMoveCode'}>
                        <Input disabled style={{width: disabledRef.current ? 302 : 255}}
                               placeholder={t('returnForImportMove')}/>
                    </Form.Item>
                    {
                        !disabledRef.current &&
                        <Button htmlType={'button'} className={'mb-[8px]'} onClick={onSearch} style={{width: 40}}
                                icon={<SearchOutlined/>}></Button>
                    }
                </Space>
            </FloatLabel>
        </Col>

        <ModalTableImportStockMain/>
    </>);
}
