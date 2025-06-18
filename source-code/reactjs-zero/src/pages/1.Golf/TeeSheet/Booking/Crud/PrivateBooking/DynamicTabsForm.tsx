import React, {useEffect, useState} from "react";
import {Button, Form, Tabs} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import DateUtil from "@ord-core/utils/date.util";

const {TabPane} = Tabs;

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface DynamicTabsFormProps {
    maxTab: number;
    currentTab: number;
}

const DynamicTabsForm: React.FC<DynamicTabsFormProps> = ({maxTab, currentTab}) => {
    const [form] = Form.useForm();
    const [activeKey, setActiveKey] = useState(currentTab.toString());
    const [tabKeys, setTabKeys] = useState<string[]>([currentTab.toString()]);

    useEffect(() => {
        form.setFieldsValue({
            customers: Array.from({length: currentTab}, () => ({}))
        });
    }, [currentTab, form]);

    const findNextAvailableKey = () => {
        for (let i = 1; i <= maxTab; i++) {
            if (!tabKeys.includes(i.toString())) {
                return i.toString();
            }
        }
        return null;
    };

    const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
        if (action === 'add') {
            const nextKey = findNextAvailableKey();
            if (nextKey) {
                const customers = form.getFieldValue('customers') || [];
                customers[Number(nextKey) - 1] = {}; // Insert đúng vị trí
                form.setFieldsValue({customers});

                setTabKeys((prev) => [...prev, nextKey].sort((a, b) => Number(a) - Number(b)));
                setActiveKey(nextKey);
            }
        } else if (action === 'remove' && typeof targetKey === 'string') {
            const index = Number(targetKey) - 1;
            const customers = form.getFieldValue('customers') || [];
            customers.splice(index, 1);
            form.setFieldsValue({customers});

            const newKeys = tabKeys.filter(key => key !== targetKey);
            setTabKeys(newKeys);

            if (newKeys.length) {
                const targetIndex = tabKeys.indexOf(targetKey);
                if (targetIndex > 0) {
                    setActiveKey(newKeys[targetIndex - 1]);
                } else {
                    setActiveKey(newKeys[0]);
                }
            }
        }
    };

    const renderTabContent = (index: number) => (
        <>DataTab</>
    );

    return (
        <Form
            form={form}
            layout="vertical"
            // onFinish={onFinish}
            initialValues={{customers: [{}]}}
        >
            <Form.List name="customers">
                {(fields) => (
                    <>
                        <Tabs
                            type="editable-card"
                            activeKey={activeKey}
                            onChange={(key) => setActiveKey(key)}
                            onEdit={onEdit}
                            tabBarExtraContent={
                                <div>
                                    <FloatLabel label={'đâs'}>
                                        <Form.Item
                                            name='birthDay'>
                                            <OrdDateInput disabledDate={DateUtil.disableAfterNow}/>
                                        </Form.Item>
                                    </FloatLabel>
                                </div>
                            }
                        >
                            {tabKeys.map((key) => {
                                const index = Number(key) - 1;
                                return (
                                    <TabPane
                                        key={key}
                                        tab={`Khách ${key}`}
                                        closable={tabKeys.length > 1}
                                    >
                                        {renderTabContent(index)}
                                    </TabPane>
                                );
                            })}
                        </Tabs>
                    </>
                )}
            </Form.List>

            <div className="mt-6 flex justify-end">
                <Button type="primary" htmlType="submit">
                    Lưu thông tin
                </Button>
            </div>
        </Form>
    );
};

export default DynamicTabsForm;
