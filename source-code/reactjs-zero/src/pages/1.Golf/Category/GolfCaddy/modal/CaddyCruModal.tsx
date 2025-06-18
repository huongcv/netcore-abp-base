import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { useStore } from "@ord-store/index";
import { Tabs, TabsProps } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { TabBarExtraContent } from "rc-tabs/lib/interface";
import PartnerAvatar from "@pages/Partner/Shared/PartnerAvatar";
import { CaddyBaseInfoForm } from "../form/CaddyBaseInfoForm";
import CaddyWorkScheduleForm from "../form/CaddyWorkScheduleForm";

const CaddyCruModal = () => {
  const { t } = useTranslation("GolfCaddy");
  const { golfCaddyStore: mainStore } = useStore();

  const itemTab: TabsProps["items"] = [
    {
      icon: <UserOutlined />,
      key: "1",
      label: t("golfCaddyBaseInfo"),
      children: <CaddyBaseInfoForm />,
    },
    {
      icon: <CalendarOutlined />,
      key: "2",
      label: t("workSchedule"),
      disabled: mainStore.isAddNewEntity,
      children: <CaddyWorkScheduleForm />,
    },
  ];

  const extraTab: TabBarExtraContent = {
    left: (
      <div className="text-center">
        <PartnerAvatar />
        {/* {mainStore.createOrUpdateModal.entityData?.currentStatus && (
          <div className="my-2">
            <strong style={{ color: getStatusColor(mainStore.createOrUpdateModal.entityData?.currentStatus) }}>
              <BuggyStatusCell status={mainStore.createOrUpdateModal.entityData?.currentStatus} />
            </strong>
          </div>
        )} */}
      </div>
    ),
  };

  return (
    <Tabs
      className="tab-cru-customer"
      tabBarExtraContent={extraTab}
      tabPosition="left"
      items={itemTab}
    />
  );
};

export default observer(CaddyCruModal);
