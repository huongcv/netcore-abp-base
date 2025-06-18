import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {ComboOptionDto} from "@ord-core/service-proxies/dto";
import {Checkbox, Col, Form, Row, Spin, Tooltip} from "antd";
import {StockInventoryService} from "@api/StockInventoryService";

export const ConfigAccessModifyInventoryForm = () => {
    const {t} = useTranslation('employee');
    const {t: tCommon} = useTranslation('common');

    const [options, setOptions] = useState<ComboOptionDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await StockInventoryService.getComboOptions({});
                setOptions(response);
            } catch (error) {

            } finally {
                setLoading(false);
            }
        };
        fetchOptions().then();
    }, []);


    return <>
        <Row gutter={64}>
            <Col span={12}>
                <p style={{marginBottom: 15, fontWeight: "600"}}>{t('cruAction.inventoryTitle')}</p>
                {
                    loading ? (<Spin></Spin>) : (
                        <Form.Item name='listInventoryId'>
                            <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {options.map(option => (
                                    <Checkbox key={option.value} value={option.value}  className='mb-1'>
                                        <Tooltip title={t('inventoryCode') + option.data.inventoryCode} color={"#3BB54A"} >
                                            {option.displayName}
                                        </Tooltip>
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>
                    )
                }
            </Col>
        </Row>
    </>
}
