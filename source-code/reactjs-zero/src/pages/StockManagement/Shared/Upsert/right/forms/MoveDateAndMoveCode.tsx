import {Col, Form} from "antd";
import {MoveDateInput} from "@pages/StockManagement/Shared/Upsert/right/forms/MoveDateInput";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import RegexUtil from "@ord-core/utils/regex.util";
import {useTranslation} from "react-i18next";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {ImportStockMoveDto} from "@api/index.defs";

export const MoveDateAndMoveCode = () => {
    const [t] = useTranslation('stock');
    const form = Form.useFormInstance();

    const {editData} = useUpsertStockMove();
    const moveHashId_w = Form.useWatch('moveHashId', form);

    return (<>
        <Col span={24}>
            <FloatLabel label={t('moveCode')} required={!!editData?.moveDto?.moveId ||
                !!(editData?.moveDto as ImportStockMoveDto)?.moveHashId}>
                <Form.Item name={'moveCode'}>
                    <OrdInputRegexText disabled={!!moveHashId_w} regex={RegexUtil.CodeRegex}/>
                </Form.Item>
            </FloatLabel>
        </Col>
        <Col span={24}>
            <MoveDateInput/>
        </Col>
    </>)
}
