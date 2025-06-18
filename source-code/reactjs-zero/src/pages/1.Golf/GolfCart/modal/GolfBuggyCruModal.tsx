import { useStore } from "@ord-store/index";
import { FormInstance, Tabs, TabsProps } from "antd";
import { useTranslation } from "react-i18next";
import { GolfCartInfoForm } from "../form/GolfCartInfoForm";
import { useEffect } from "react";
import { TabBarExtraContent } from "rc-tabs/lib/interface";
import PartnerAvatar from "@pages/Partner/Shared/PartnerAvatar";
import { observer } from "mobx-react-lite";
import { CompassOutlined, InfoCircleOutlined, QuestionCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { GolfCartEngineeringInforForm } from "../form/GolfCartEngineeringInforForm";
import { BuggyCurrentStatusEnum } from "@api/index.defs";
import { BuggyStatusCell } from "../components/BuggyStatusCell";

interface GolfCartCruModalProps {
  cusForm: FormInstance;
}

const GolfCartCruModal = (props: GolfCartCruModalProps) => {
  const { t } = useTranslation("GolfBuggy");
  const { golfBuggyStore: mainStore } = useStore();

  const itemTab: TabsProps["items"] = [
    {
      icon: <InfoCircleOutlined />,
      key: "1",
      label: t("golfCartBaseInfo"),
      children: <GolfCartInfoForm />,
    },
    {
      icon: <QuestionCircleOutlined />,
      key: "2",
      label: t("golfCartEngineeringInfo"),
      children: <GolfCartEngineeringInforForm />,
    },
    {
      icon: <SettingOutlined />,
      key: "3",
      label: t("maintenanceLog"),
      disabled: mainStore.isAddNewEntity
    },
    {
      icon: <CompassOutlined />,
      key: "4",
      label: t("postionLog"),
      disabled: mainStore.isAddNewEntity
    },
    {
      icon: <CompassOutlined />,
      key: "5",
      label: t("drivenByLog"),
      disabled: mainStore.isAddNewEntity
    },
  ];

  const getStatusColor = (status: BuggyCurrentStatusEnum | undefined): string => {
    if (!status) return 'inherit';
    
    switch(status) {
      case 1: // Available
        return '#52c41a'; // Màu xanh lá cây
      case 2: // InUse
        return '#1890ff'; // Màu xanh dương
      case 3: // Maintenance
        return '#faad14'; // Màu cam
      case 4: // Charging
        return '#722ed1'; // Màu tím
      case 5: // Broken
        return '#f5222d'; // Màu đỏ
      default:
        return 'inherit';
    }
  };

  const extraTab: TabBarExtraContent = {
    left: (
      <div className="text-center">
        {/* <PartnerAvatar />      */}
        {mainStore.createOrUpdateModal.entityData?.currentStatus && (
          <div className="my-2">
            <strong style={{ color: getStatusColor(mainStore.createOrUpdateModal.entityData?.currentStatus) }}>
              <BuggyStatusCell status={mainStore.createOrUpdateModal.entityData?.currentStatus} />
            </strong>
          </div>
        )}
      </div>
    ),
  };

  useEffect(() => {
    const { mode, entityData } = mainStore.createOrUpdateModal;
    
    if (mode === "addNew") {
      props.cusForm.resetFields();
      props.cusForm.setFieldsValue(mainStore.getInitModal().entityData);
    } else if (mode === "update" || mode === "viewDetail") {
      props.cusForm.setFieldsValue(entityData);
    }
  }, [mainStore.createOrUpdateModal.entityData]);

  return (
    <Tabs
      className="tab-cru-customer"
      tabBarExtraContent={extraTab}
      tabPosition="left"
      items={itemTab}
    />
  );
};

export default observer(GolfCartCruModal);