import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import { Button, Input, Space, Spin } from "antd";
import {
  CloseCircleOutlined,
  EyeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import { getPartnerCustomerById } from "@ord-core/db/queries/partners/getPartnerCustomerById";
import { GolfCustomerDto, PARTNER_TYPE, PartnerSyncDto } from "@api/index.defs";
import { useStore } from "@ord-store/index";
import { observer } from "mobx-react-lite/src/observer";
import { useTranslation } from "react-i18next";
import { GolfCustomerService } from "@api/GolfCustomerService";
import { InputProps } from "antd/es/input/Input";

interface IGolfPlayerPartnerInputProp extends Omit<InputProps, "onChange"> {
  value?: string | undefined;
  onChange?: (
    value: number | undefined,
    option: PartnerSyncDto|undefined
  ) => void;
  partner_type: PARTNER_TYPE | undefined;
  requiredPhone?: boolean;
}

const GolfPlayerPartnerInput = (props: IGolfPlayerPartnerInputProp) => {
  const { golfCustomerStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const [inputValue, setInputValue] = useState<string>("");
  const [partnerData, setPartnerData] = useState<PartnerSyncDto | undefined>();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const debouncedFetchPartner = useMemo(
    () =>
      debounce(
        async (params: {
          partnerId?: string;
          code?: string;
          codeOrPhone?: string;
        }) => {
          try {
            setLoading(true);
            const response = await getPartnerCustomerById(params);
            if (response) {
              setPartnerData({ ...response });
              props.onChange?.(Number(response.id),response);
              return;
            }
            UiUtils.showError(t("notFoundCustomer"));
          } catch (error) {
            UiUtils.showError(t("errFindCustomer"));
          } finally {
            setLoading(false);
          }
        },
        1000
      ),
    []
  );

  useEffect(() => {
    if (props.value && props.value != partnerData?.id) {
      debouncedFetchPartner({ partnerId: props.value });
    }
  }, [props.value]);

  useEffect(() => {
    if (inputValue && !partnerData) {
      if (inputValue.length < 4) {
        setLoading(false);
        return;
      }
      debouncedFetchPartner({ codeOrPhone: inputValue.trim() });
    }
  }, [inputValue, partnerData, debouncedFetchPartner]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if(val){
        setLoading(true);
    }
    setInputValue(val);
    setPartnerData(undefined);
  };

  const handleClear = () => {
    setInputValue("");
    setPartnerData(undefined);
    props.onChange?.(undefined, undefined);
  };
  const handlAddNewCustomer = (data: GolfCustomerDto) => {
    if (data && data.code) {
      setPartnerData(undefined);
      setInputValue(data.code);
    }
  };
  const handleViewOrUpdateCustomer = async () => {
    const data = await GolfCustomerService.getById({
      findId: Number(partnerData?.id),
    });
    if (data) {
      setOpenModal(true);
      mainStore.openUpdateModal(data);
    }
  };

  const LazyModalCruCustomer = lazy(
    () => import("../../GolfCustomer/Customer/Form/ModalCruCustomer")
  );

  return (
    <Space.Compact className="w-full">
      <Input
        {...props}
        value={partnerData?.name || inputValue}
        onChange={handleInputChange}
        readOnly={!!partnerData}
        allowClear={false}
        suffix={
          loading ? (
            <Spin indicator={<LoadingOutlined spin />} size="small" />
          ) : (
            <CloseCircleOutlined
              onClick={handleClear}
              style={{
                color: "rgba(0, 0, 0, 0.45)",
                fontSize: "12px",
                cursor: "pointer",
                // visibility: inputValue || partnerData ? "visible" : "hidden",
                visibility: partnerData ? "visible" : "hidden",
              }}
              className="ant-input-clear-icon-custome"
            />
          )
        }
      />
      {partnerData && partnerData.id ? (
        <Button style={{ width: "38px" }} onClick={handleViewOrUpdateCustomer}>
          <EyeOutlined />
        </Button>
      ) : (
        <Button
          style={{ width: "38px" }}
          onClick={() => {
            setOpenModal(true);
            mainStore.openCreateModal();
          }}
        >
          <PlusOutlined />
        </Button>
      )}

      <Suspense fallback={<Spin />}>
        {openModal && (
          <LazyModalCruCustomer
            onModalCancel={() => {
              setOpenModal(false);
            }}
            stored={mainStore}
            isCustomerGolf={true}
            requiredPhone={props.requiredPhone}
            onNewCusSelected={handlAddNewCustomer}
          ></LazyModalCruCustomer>
        )}
      </Suspense>
    </Space.Compact>
  );
};
export default observer(GolfPlayerPartnerInput);
