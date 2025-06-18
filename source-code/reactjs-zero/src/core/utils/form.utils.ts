import {FormInstance} from "antd";

class FormUtils {
    resetFields(form: FormInstance<any>) {
        const fields = form.getFieldsValue();
        const clearedFields = Object.keys(fields).reduce((acc: any, key) => {
            acc[key] = undefined;
            return acc;
        }, {});

        form.setFieldsValue(clearedFields);
    }
}

export default new FormUtils()