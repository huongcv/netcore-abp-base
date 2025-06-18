import { Card, Descriptions } from "antd";
import DateUtil from "@ord-core/utils/date.util";

export const MemberInfoCard = ({ memberInfo, tEnum }: { memberInfo: any; tEnum: any }) => (
  <Card title="Thông tin thành viên" className="shadow-md rounded-xl">
    <Descriptions column={2} bordered size="small">
      <Descriptions.Item label="Tên">{memberInfo.name}</Descriptions.Item>
      <Descriptions.Item label="Giới tính">{tEnum("GENDER." + memberInfo.gender) ?? '—'}</Descriptions.Item>
      <Descriptions.Item label="Số điện thoại">{memberInfo.phone ?? '—'}</Descriptions.Item>
      <Descriptions.Item label="Mã thẻ">{memberInfo.code}</Descriptions.Item>
      <Descriptions.Item label="UID">{memberInfo.uid}</Descriptions.Item>
      <Descriptions.Item label="Thời gian hiệu lực">
        <div>
          {memberInfo.startDate ? DateUtil.toFormat(memberInfo.startDate, "DD/MM/YYYY") : '—'} →
          {memberInfo.endDate ? DateUtil.toFormat(memberInfo.endDate, "DD/MM/YYYY") : '—'}
        </div>
      </Descriptions.Item>
    </Descriptions>
  </Card>
);