import {
  GolfFlightOutputDto,
  FlightSlot,
  InfoPrivateBookingDto,
  GolfBuggyOutPutDto,
} from "@api/index.defs";
import { useStore } from "@ord-store/index";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Utils from "@ord-core/utils/utils";
import {
  PlusCircleOutlined,
  RollbackOutlined,
  SwapOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Avatar, Tag, Button } from "antd";
import Meta from "antd/es/card/Meta";
import BookingBuggyModal from "../Buggy/BookingBuggyModal";

const BuggyBottomCard = (props: {
  boardIdx: number;
  flight: GolfFlightOutputDto;
  slot: FlightSlot;
  colIndex: number;
}) => {
  const { flight, slot, colIndex } = props;
  const { golfBookingStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  // const { t: tEnum } = useTranslation("comboEnum");
  const [isShowBuggyList, setShowBuggyList] = useState(false);
  const [infoBooking, setInfoBooking] = useState<InfoPrivateBookingDto>();
  const [selectedBuggies, setSelectedBuggies] = useState<{
    [key: number]: GolfBuggyOutPutDto;
  }>({});

  const handleCloseBuggyModal = () => {
    setShowBuggyList(false);
  };

  const handleSelectBuggy = (buggy: GolfBuggyOutPutDto, index: number) => {
    setSelectedBuggies((prev) => ({
      ...prev,
      [index]: buggy,
    }));
  };

  const handleRemoveBuggy = (colIndex: number) => {
    const newSelectedBuggies = { ...selectedBuggies };
    delete newSelectedBuggies[colIndex];
    setSelectedBuggies(newSelectedBuggies);
  };

  const selectedBuggy = selectedBuggies[colIndex];

  return (
    <>
      <Card
        className="relative"
        size={"small"}
        // loading={isLoading}
        style={{
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
        }}
        styles={{
          body: {
            flex: 1,
            overflowY: "auto",
          },
        }}
        title={
          <>
            <Avatar className="mr-1.5" icon={<UserOutlined></UserOutlined>} />
            {slot?.groupName ? (
              <span>
                {slot?.groupName}{" "}
                <span className="text-sm">
                  (
                  {infoBooking?.isGuest
                    ? infoBooking.guestName
                    : infoBooking?.partnerName}
                  )
                </span>
              </span>
            ) : (
              <span>{slot?.partnerName}</span>
            )}
          </>
        }
        // extra={
        //   <>
        //     {isGuest ? (
        //       <Tag>{t("isGuest")}</Tag>
        //     ) : (
        //       <Tag className="ml-1" color="green">
        //         {t("member")}
        //       </Tag>
        //     )}
        //     {isCardMember && (
        //       <Tag className="ml-1" color="blue">
        //         {t("cardMember")}
        //       </Tag>
        //     )}
        //   </>
        // }
      >
        {selectedBuggy ? (
          <div
            key={colIndex}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
            // style={{ height: `${contentHeight}px` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-grow">
                <h3 className="font-semibold text-lg m-0">
                  {selectedBuggy.buggyName}
                </h3>
                <p className="text-gray-500 text-sm m-0">
                  {selectedBuggy.buggyCode}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t("licensePlate")}:</span>
                <span>{selectedBuggy.licensePlate}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-gray-500">{t("buggyType")}:</span>
                <span>{tEnum(`buggyType.${selectedBuggy.buggyType}`)}</span>
              </div> */}
              <div className="flex justify-between">
                <span className="text-gray-500">{t("maxSpeedKph")}:</span>
                <span>
                  {selectedBuggy.maxSpeedKph
                    ? `${selectedBuggy.maxSpeedKph} km/h`
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("maxLoadKg")}:</span>
                <span>
                  {selectedBuggy.maxLoadKg
                    ? `${selectedBuggy.maxLoadKg} kg`
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <Button
            className="flex-1 w-full mt-3"
            type="primary"
            onClick={() => {
              setShowBuggyList(true);
            }}
            icon={<PlusCircleOutlined />}
          >
            {t("choosingBuggy")}
          </Button>
        )}
        {selectedBuggy && (
          <div className="flex justify-between w-full mt-3 gap-2">
            <Button
              type="primary"
              icon={<SwapOutlined />}
              className="flex-1"
              onClick={() => setShowBuggyList(true)}
            >
              {t("changeBuggy")}
            </Button>
            <Button
              icon={<RollbackOutlined />}
              className="flex-1"
              onClick={() => handleRemoveBuggy(colIndex)}
            >
              {t("returnBuggy")}
            </Button>
          </div>
        )}
      </Card>
      <BookingBuggyModal
        isOpen={isShowBuggyList}
        onClose={handleCloseBuggyModal}
        onSelectBuggy={(buggy) => {
          handleSelectBuggy(buggy, colIndex);
        }}
      />
    </>
  );
};
export default observer(BuggyBottomCard);
