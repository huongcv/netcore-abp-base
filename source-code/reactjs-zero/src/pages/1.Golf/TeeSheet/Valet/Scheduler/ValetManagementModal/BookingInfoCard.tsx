import { Card, Descriptions, Empty } from "antd";
import DateUtil from "@ord-core/utils/date.util";
import { BookIcon } from "@ord-components/icon/BookIcon";
import { formatTime, CheckInStatusEnum, AccessCardTypeEnum, AccessCardStatusEnum } from "../../../Booking/Scheduler/ExtFunction";

export const BookingInfoCard = ({ bookingInfo, t, tEnum }: { bookingInfo?: any; t: any; tEnum: any }) => {
  if (!bookingInfo) {
    return <Empty description={t("notFoundBookingInfo")} image={<BookIcon width={100} height={100} />} />;
  }

  return (
    <Card title="Thông tin booking" className="shadow-md rounded-xl">
        <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Ngày đặt">
                <div>{bookingInfo.bookingDate ? DateUtil.toFormat(bookingInfo.bookingDate, "DD/MM/YYYY HH:mm") : '—'}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng số người chơi">{bookingInfo.totalPlayers}</Descriptions.Item>

            <Descriptions.Item label="TeeTime">
                <div>{formatTime(bookingInfo.teeTime)}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Sân">{bookingInfo.courseName}</Descriptions.Item>

            <Descriptions.Item label="Chơi chung flight">
                {bookingInfo.isSharedFlight ? 'Có' : 'Không'}
            </Descriptions.Item>
            <Descriptions.Item
                label="Loại game">{tEnum("GameTypeEnum." + bookingInfo.gameType)}</Descriptions.Item>
            <Descriptions.Item
                label="Người yêu cầu">{bookingInfo.requestedBy ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="SĐT liên hệ">{bookingInfo.contactNo ?? '—'}</Descriptions.Item>
            <Descriptions.Item span={2} label="Ghi chú">{bookingInfo.note ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái booking">
                {tEnum("BookingStatusEnum." + bookingInfo.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian xác nhận">
                <div>{bookingInfo.comfirmedDate ? DateUtil.toFormat(bookingInfo.comfirmedDate, "DD/MM/YYYY HH:mm") : '—'}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái Checkin">
                {tEnum("CheckinStatusEnum." + bookingInfo.checkInStatus)}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian checkin">
                <div>{bookingInfo.checkInTime && bookingInfo.checkInStatus == CheckInStatusEnum.Checkedin ? DateUtil.toFormat(bookingInfo.checkInTime, "DD/MM/YYYY HH:mm") : '—'}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái Checkout">
                {bookingInfo.checkOutTime ? t('isCheckout') : t('isNotCheckout')}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian Checkout">
                <div>{bookingInfo.checkOutTime ? DateUtil.toFormat(bookingInfo.checkOutTime, "DD/MM/YYYY HH:mm") : '—'}</div>
            </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};