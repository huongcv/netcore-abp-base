import { CreateSalesPromotionDto, TimeRange } from "@api/index.defs";
import Item from "antd/es/list/Item";
import dayjs from "dayjs";

export const mapToFormData = (dto: CreateSalesPromotionDto) => {
  return {
    id: dto.id,
    name: dto.name,
    code: dto.code,
    description: dto.description,
    isActived: dto.isActived,
    startDate: dayjs(dto.startDate),
    endDate: dayjs(dto.endDate),
    promotionType: dto.promotionType,
    details: dto.details,
    applyDaysDto: {
      ...dto.applyDaysDto,
      specificDates: dto.applyDaysDto?.specificDates?.map((item) =>
        dayjs(item).format("DD-MM-YYYY")
      ),
    },
  };
};

export const mapToApiFormat = (formData: CreateSalesPromotionDto) => {
  return {
    id: formData.id,
    name: formData.name,
    code: formData.code,
    description: formData.description,
    startDate: formData.startDate
      ? dayjs(formData.startDate).startOf("day").toDate()
      : null,
    endDate: formData.endDate
      ? dayjs(formData.endDate).startOf("day").toDate()
      : null,
    promotionType: formData.promotionType,
    details: formData.details,
    applyDaysDto: {
      ...formData.applyDaysDto,
      specificDates: formData.applyDaysDto?.specificDates?.map((date: any) => {
        if (!date) return null;
        const [day, month, year] = date.split("-").map(Number);
        return new Date(year, month - 1, day);
      }),
    },
    isActived: formData.isActived,
  } as CreateSalesPromotionDto;
};

export const optionsUnit = [
  {
    value: "VND",
    label: "VND",
  },
  {
    value: "%",
    label: "Phần trăm",
  },
];
export interface ModelUnitAmountPromotion {
  nameIndex: number;
  valueSelected: string;
}
export const specialDaysList = [
  { date: "01-01", name: "Tết Dương lịch (Tết tây)" },
  { date: "09-01", name: "Ngày truyền thống học sinh, sinh viên Việt Nam" },
  { date: "03-02", name: "Ngày thành lập Đảng Cộng Sản Việt Nam" },
  { date: "14-02", name: "Lễ tình nhân (Valentine)" },
  { date: "27-02", name: "Ngày thầy thuốc Việt Nam" },
  { date: "08-03", name: "Ngày Quốc tế Phụ nữ" },
  { date: "20-03", name: "Ngày Quốc tế Hạnh phúc" },
  { date: "26-03", name: "Ngày thành lập Đoàn TNCS Hồ Chí Minh" },
  { date: "01-04", name: "Ngày Cá tháng Tư" },
  { date: "30-04", name: "Ngày giải phóng miền Nam" },
  { date: "01-05", name: "Ngày Quốc tế Lao động" },
  { date: "07-05", name: "Ngày chiến thắng Điện Biên Phủ" },
  { date: "13-05", name: "Ngày của mẹ" },
  { date: "19-05", name: "Ngày sinh Chủ tịch Hồ Chí Minh" },
  { date: "01-06", name: "Ngày Quốc tế thiếu nhi" },
  { date: "17-06", name: "Ngày của cha" },
  { date: "21-06", name: "Ngày báo chí Việt Nam" },
  { date: "28-06", name: "Ngày gia đình Việt Nam" },
  { date: "11-07", name: "Ngày dân số thế giới" },
  { date: "27-07", name: "Ngày Thương binh liệt sĩ" },
  { date: "28-07", name: "Ngày thành lập công đoàn Việt Nam" },
  { date: "19-08", name: "Ngày kỷ niệm Cách mạng Tháng 8 thành công" },
  { date: "02-09", name: "Ngày Quốc Khánh" },
  { date: "10-09", name: "Ngày thành lập Mặt trận Tổ quốc Việt Nam" },
  { date: "01-10", name: "Ngày quốc tế người cao tuổi" },
  { date: "10-10", name: "Ngày giải phóng thủ đô" },
  { date: "13-10", name: "Ngày doanh nhân Việt Nam" },
  { date: "20-10", name: "Ngày Phụ nữ Việt Nam" },
  { date: "31-10", name: "Ngày Halloween" },
  { date: "09-11", name: "Ngày pháp luật Việt Nam" },
  { date: "19-11", name: "Ngày Quốc tế Nam giới" },
  { date: "20-11", name: "Ngày Nhà giáo Việt Nam" },
  { date: "23-11", name: "Ngày thành lập Hội chữ thập đỏ Việt Nam" },
  { date: "01-12", name: "Ngày thế giới phòng chống AIDS" },
  { date: "19-12", name: "Ngày toàn quốc kháng chiến" },
  { date: "24-12", name: "Ngày lễ Giáng sinh" },
  { date: "22-12", name: "Ngày thành lập quân đội nhân dân Việt Nam" },
];
