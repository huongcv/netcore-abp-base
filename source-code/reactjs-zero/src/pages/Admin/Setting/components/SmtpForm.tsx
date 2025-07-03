import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";
import {Form} from "antd";

export const SmtpForm = () => {
    const oldPassword = Form.useWatch('oldPassword');
    const formConfig = new FormBuilder()
        .addText({
            span: 16,
            label: 'smtp_host',
            name: 'host',
            required: true,
            maxLength: 200
        }).addNumber({
            span: 8,
            label: 'smtp_port',
            name: 'port',
            required: true
        }).addText({
            name: 'username',
            label: 'smtp_userName',
            required: true,
            maxLength: 200
        })
        .addText({
            name: 'password',
            label: 'smtp_password',
            componentProps: {
                placeholder: "Để trống nếu không muốn thay đổi"
            },
            required: !oldPassword,
            maxLength: 200
        })
        .addText({
            label: 'smtp_displayName',
            name: 'displayName',
            maxLength: 200
        })
        .addCheckbox({
            name: 'enableSsl',
        }).addCustom({
            render: () => <>
                <div hidden>
                    <Form.Item noStyle name={'oldPassword'}/>
                </div>

            </>
        })
        .build();
    return <OrdFormBuilder config={formConfig}/>;
}