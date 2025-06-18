import { ArrowLeftOutlined } from "@ant-design/icons";
import { HomeIcon } from "@ord-components/icon/HomeIcon";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import { HotKeyScope } from "@ord-core/AppConst";
import GridProductItems from "@pages/Order/shared/GridProductItems";
import RightBox from "@pages/Order/shared/RightBox";
import { Button, Col, Form, Row, Space } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import "@pages/Order/index.scss";

declare var ord: any;

const CreateOrUpdateOrderForm = () => {
    const { t } = useTranslation("order");
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const data = {};

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data);
        }
    }, [data, form]);

    const handleSave = async (isDraft: boolean) => {
        try {
        } catch (error) {
            console.error("Form validation failed:", error);
        }
    };

    useHotkeys(
        "f10",
        (event) => {
            event.preventDefault();
            navigate(-1);
        },
        {
            scopes: [HotKeyScope.crudPageBase],
            enableOnFormTags: true,
        }
    );

    const triggerDirty = () => {
        ord.event.trigger("event@dirty.stock", true);
    };

    const ProductItemsContent = () => (
        <Form form={form} onChange={triggerDirty}>
            <GridProductItems />
        </Form>
    );

    return (
        <Form form={form}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h4 className="flex items-center text-[20px] font-semibold text-dark">
                        <Space>
                            <HomeIcon />
                            <IconlyLight
                                className="mx-1 mt-[6px]"
                                width={20}
                                type="Arrow - Right 2.png"
                            />
                            <Link to="/orders">{t("orderBill")}</Link>
                            <IconlyLight
                                className="mx-1 mt-[6px]"
                                width={20}
                                type="Arrow - Right 2.png"
                            />
                            <Link to="/orders">{t("orderBillForm")}</Link>

                        </Space>
                    </h4>
                    <Link to="/orders">
                        <Button icon={<ArrowLeftOutlined />}>
                            {t("returnList")} (F10)
                        </Button>
                    </Link>
                </div>
    
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <ProductItemsContent />
                    </div>
                    <div className="w-full md:w-[320px]">
                        <Row>
                            <Col span={24}><RightBox /></Col>
                        </Row>
                    </div>
                </div>
            </div>
        </Form>
    );
}

export default observer(CreateOrUpdateOrderForm);