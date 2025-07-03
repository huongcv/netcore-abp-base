import {Form, FormInstance} from "antd";
import UiUtils from "@ord-core/utils/ui.utils";

type Props<T> = {
    internalForm: FormInstance;
    formFields: React.ReactNode;
    onFinish: (values: T, form: FormInstance) => Promise<void>;
    initialValues?: any;
    disabled?: boolean;
};

export const FormModalBodyContent: React.FC<Props<any>> = ({
                                                               internalForm,
                                                               formFields,
                                                               onFinish,
                                                               initialValues = {},
                                                               disabled = false,
                                                           }) => {
    return (<Form
        form={internalForm}
        clearOnDestroy
        initialValues={initialValues}
        autoComplete="off"
        layout="vertical"
        disabled={disabled}
        onFinishFailed={() => {
            UiUtils.showCommonValidateForm();
        }}
        onFinish={async (formValues) => {
            await onFinish(formValues, internalForm);
        }}
    >
        {formFields}
        <Form.Item noStyle name="encodedId"/>
        <Form.Item noStyle name={['extendUi', 'modifyMode']}/>
    </Form>);

}