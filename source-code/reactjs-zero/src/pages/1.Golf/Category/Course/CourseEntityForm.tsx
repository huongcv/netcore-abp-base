import {
  FlagOutlined,
  HarmonyOSOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import InfoLeftTabWithAvatar from "@ord-components/forms/Avt/InfoLeftTabWithAvatar";
import { useStore } from "@ord-store/index";
import { Form, Tabs, TabsProps } from "antd";
import { TabBarExtraContent } from "rc-tabs/lib/interface";
import { useTranslation } from "react-i18next";
import { useWatch } from "antd/es/form/Form";
import { TabGameTypeSetting } from "./TabGameTypeSetting";
import { TabInformation } from "./TabInformation";
import { TabCourseMaintenance } from "./TabCourseMaintenance";

const CourseEntityForm = () => {
  const { golfCourseStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const form = Form.useFormInstance();
  const idHidden_w = useWatch("id", form);

  const itemTab: TabsProps["items"] = [
    {
      icon: <FlagOutlined />,
      key: "1",
      label: t("information"),
      children: <TabInformation />,
    },
    {
      icon: <HarmonyOSOutlined />,
      key: "2",
      label: t("gameTypeSetting"),
      children: <TabGameTypeSetting />,
      forceRender: true,
    },
    {
      icon: <SettingOutlined />,
      key: "3",
      label: t("tabCourseMaintenance"),
      children: <TabCourseMaintenance courseId={idHidden_w} />,
    },
  ];
  const extraTab: TabBarExtraContent = {
    left: (
      <div className={"text-center"}>
        <InfoLeftTabWithAvatar />
      </div>
    ),
  };

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        className={"tab-cru-customer"}
        tabBarExtraContent={extraTab}
        tabPosition={"left"}
        items={itemTab}
      ></Tabs>
    </>
  );
};
export default CourseEntityForm;
