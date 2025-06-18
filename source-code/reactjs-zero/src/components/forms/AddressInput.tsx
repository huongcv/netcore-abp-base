import {useEffect, useState} from "react";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectProvince} from "@ord-components/forms/select/selectDataSource/useSelectProvince";
import {useSelectDistrict} from "@ord-components/forms/select/selectDataSource/useSelectDistrict";
import FormItem from "antd/es/form/FormItem";
import {Col, Row} from "antd";
import {OrdFormControl} from "@ord-core/model/OrdFormControl";


const AddressInput = (props: {
    id: string,
    value?: any;
    onChange?: (value: any) => void;
    provinceControl?: OrdFormControl,
    districtControl?: OrdFormControl
}) => {
    const {value = {}, onChange} = props;
    const [province, setProvince] = useState<string>('');
    const [district, setDistrict] = useState<string>('');

    const triggerChange = (changedValue: { province?: string; district?: string }) => {
        onChange?.({province, district, ...value, ...changedValue});
    };
    const provinceChange = (value: any) => {
        setProvince(value);
        // @ts-ignore
        setDistrict('');
        triggerChange({province: value, district: ''});
    }
    const districtChange = (value: any) => {
        setDistrict(value);
        triggerChange({district: value});
    }
    useEffect(() => {
        setProvince(props.value?.province);
        setDistrict(props.value?.district);
    }, [props.value]);
    return (<>
        <Row gutter={16}>
            <Col span={12}>
                <FormItem label="tinh" name={[props.id, 'province']} initialValue={'02'}
                          required={props?.provinceControl?.required}
                          rules={props.provinceControl?.rules}>
                    <OrdSelect value={province} onChange={provinceChange} datasource={useSelectProvince()}></OrdSelect>
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label="huyen" name={[props.id, 'district']}
                          required={props?.districtControl?.required}
                          rules={props.districtControl?.rules}>
                    <OrdSelect value={district} onChange={districtChange}
                               datasource={useSelectDistrict(province)}
                    ></OrdSelect>
                </FormItem>
            </Col>

        </Row>


    </>);
}
export default AddressInput;
