import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import { Button, Col, Form, Input, Row, Space, Spin } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import "./index.scss";
import { useStore } from "@ord-store/index";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import HowToHanldeADR from "../Components/HowToHandleADR";
import MedicineSameTime from "../Components/MedicienSameTime";
import HeaderReport from "../Components/HeaderReport";
import ResultHandleADR from "../Components/ResultHandleADR";
import AppraisalADR from "../Components/AppraisalADR";
import InfoReporter from "../Components/InfoReporter";
import InformationPatientADR from "../Components/InformationPatientADR";
import InformationDrugCausingADR from "../Components/InformationDrugCausingADR";
import UiUtils from "@ord-core/utils/ui.utils";
import { useHotkeys } from "react-hotkeys-hook";

const CreateOrUpdateFormAdverseReaction: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { t } = useTranslation("report_adverse_reaction");
  const [form] = Form.useForm();
  const { reportPharmacyLogAdverseReactionStore: mainStore } = useStore();
  const [formData, setFormData] = useState(mainStore.formData);
  const [loading, setLoading] = useState(true);

  const isEditMode = !!id;

  const handleSubmit = () => {
    UiUtils.setBusy();
    const formData = form.getFieldsValue();
    mainStore
      .apiServiceCreateOrUpdate(formData)
      .then((res) => {
        if (res?.isSuccessful) {
          UiUtils.showSuccess(t("notiAddUpdateSuccess"));
          redirectTo();
        } else {
          UiUtils.showError(t("notiAddUpdateFaild"));
        }
      })
      .catch(() => {
        UiUtils.showError(t("notiAddUpdateFaildServerSide"));
      })
      .finally(() => {
        UiUtils.clearBusy();
      });
  };
  const redirectTo = () => {
    mainStore.clearFormData();
    navigate("/report/pharmacy-log/adverse-drug-reaction");
  };

  useHotkeys(
    "F8",
    () => {
      form.submit();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        await mainStore.apiServiceGetById(Number(id)).then((res) => {
          form.setFieldsValue(res);
        });
      };
      fetchData();
    }
    setLoading(false);
  }, []);
  console.log("mainStore.entityUpdateData", mainStore.entityUpdateData);

  return (
    <>
      {loading ? (
        <div className="loading-css">
          <Spin></Spin>
        </div>
      ) : (
        <Form
          form={form}
          initialValues={formData}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <PageTopTitleAndAction
            usingCustom={true}
            mainTitle={isEditMode ? t("adjust") : t("addNew")}
            items={[t("titlePageLvl1"), t("titlePageLvl2"), t("titlePage")]}
          >
            <TopAction
              topActions={[
                {
                  content: (
                    <>
                      <Button onClick={redirectTo}>
                        <Space>
                          <ArrowLeftOutlined />
                        </Space>
                        {t("backIndex")}
                      </Button>
                    </>
                  ),
                },
                {
                  content: (
                    <Button type="primary" htmlType="submit">
                      <Space>
                        <SaveOutlined />
                      </Space>
                      {t("btnSubmit")}
                    </Button>
                  ),
                },
              ]}
            />
          </PageTopTitleAndAction>

          <div className="ord-container-box" style={{ padding: "1rem 2rem" }}>
            <div className="header-container-promotion">{t("imformation")}</div>
            <Form.Item noStyle name="id">
              <Input hidden></Input>
            </Form.Item>
            {/* header báo cáo */}
            <HeaderReport />
            {/* Thông tin bệnh nhân về phản ứng có hại ADR */}
            <InformationPatientADR />
            {/* Thông tin về thuốc nghi ngờ gây ADR */}
            <InformationDrugCausingADR
              props={formData.informationMedicineCausingADRModel}
            />
            {/* Các thuốc dùng đồng thời và bệnh sử */}
            <MedicineSameTime />
            {/* Cách xử trí ADR */}
            <HowToHanldeADR />
            {/* Cách xử trí ADR */}
            <ResultHandleADR />
            {/* Phần bình luận của Bác sĩ điều trị */}
            <>
              <Title level={5}>{t("CommentDoctor")}</Title>
              <Row style={{ marginTop: 10 }} gutter={16}>
                <Col span={24}>
                  <Form.Item name="commentDoctor">
                    <TextArea rows={4}></TextArea>
                  </Form.Item>
                </Col>
              </Row>
            </>
            {/* Phần thẩm định ADR */}
            <AppraisalADR />
            {/* Thông tin người báo cáo */}
            <InfoReporter />
          </div>
        </Form>
      )}
    </>
  );
};
export default observer(CreateOrUpdateFormAdverseReaction);
