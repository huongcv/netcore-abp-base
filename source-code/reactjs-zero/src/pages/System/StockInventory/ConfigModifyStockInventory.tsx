import React, {useEffect, useState} from "react";
import {Checkbox, Form, Spin} from "antd";
import {useTranslation} from "react-i18next";
import {ComboOptionDto} from "@ord-core/service-proxies/dto";
import {EmployeeService} from "@api/EmployeeService";

const ConfigModifyStockInventory = () => {
    const {t} = useTranslation(['stock']);
    const [options, setOptions] = useState<ComboOptionDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await EmployeeService.getComboOptions({});
                setOptions(response);
            } catch (error) {

            } finally {
                setLoading(false);
            }
        };
        fetchOptions().then();
    }, []);



    return <>
        <p style={{marginBottom: 15, fontWeight: "600"}}>{t('titleEmployeeAccess')}</p>
        {
            loading ? (<Spin></Spin>) : (
                <Form.Item name='listEmployeeId'>
                    <Checkbox.Group style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                        {options.map(option => (
                            <Checkbox key={option.value} value={option.value}>
                                {option.displayName}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>
            )
        }</>;
}

export default ConfigModifyStockInventory
