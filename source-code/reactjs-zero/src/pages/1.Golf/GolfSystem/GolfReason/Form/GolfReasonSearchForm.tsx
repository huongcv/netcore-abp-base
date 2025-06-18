import FloatLabel from "@ord-components/forms/FloatLabel";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectBuggyCurrentStatus } from "@ord-components/forms/select/selectDataSource/useSelectBuggyCurrentStatus";
import { useSelectGolfBuggyType } from "@ord-components/forms/select/selectDataSource/useSelectGolfBuggyType";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { Col, Form, Space } from "antd";
import { useTranslation } from "react-i18next";

export const GolfReasonSearchForm = () => {
  const { t } = useTranslation("golfReason");
  return (
    <>
      <SearchFilterText span={12} />
    </>
  );
};
