export enum TABLE_ORDER_STATUS_ENUM {
    AVAILABLE = 100,
    RESERVED = 200,
    OCCUPIED = 300,
    CLEANING = 400,
}

export const colorClassMap = {
    [TABLE_ORDER_STATUS_ENUM.AVAILABLE]: '#E6FFEA',
    [TABLE_ORDER_STATUS_ENUM.RESERVED]: '#FFE6E6',
    [TABLE_ORDER_STATUS_ENUM.OCCUPIED]: '#E6F4FF',
    [TABLE_ORDER_STATUS_ENUM.CLEANING]: '#FFF7E6',
};

export enum ORDER_STATUS_ENUM {
    // Đơn hàng
    NHAP = 0,                  // TrangThaiPhieu.Nhap
    MOI = 100,                 // TrangThaiPhieu.Moi
    DA_XAC_NHAN = 200,         // TrangThaiPhieu.DaXacNhan
    DANG_DONG_HANG = 300,      // TrangThaiPhieu.DangDongHang
    CHO_GIAO_HANG = 399,       // TrangThaiPhieu.ChoGiaoHang
    DANG_LAY_HANG = 400,       // TrangThaiPhieu.DangLayHang
    CHO_LAY_LAI = 401,         // TrangThaiPhieu.ChoLayLai
    DA_LAY_HANG = 499,         // TrangThaiPhieu.DaLayHang
    DANG_GIAO_HANG = 500,      // TrangThaiPhieu.DangGiaoHang
    CHO_GIAO_LAI = 501,        // TrangThaiPhieu.ChoGiaoLai
    DA_GIAO_HANG = 599,        // TrangThaiPhieu.DaGiaoHang
    DA_NHAN_HANG = 600,        // TrangThaiPhieu.DaNhanHang
    CHO_HOAN_HANG = 700,       // TrangThaiPhieu.ChoHoanHang
    DANG_HOAN_HANG = 701,      // TrangThaiPhieu.DangHoanHang
    DA_HOAN_HANG = 799,        // TrangThaiPhieu.DaHoanHang
    DA_HUY = 100000            // TrangThaiPhieu.DaHuy
}

export const currencyName = 'vnđ';

export const prefixNewOrderCode = 'NEW';
export const prefixOrderCode = 'OD';

export const getSysNoFromOrderCode = (orders: any) => {
    if (!orders?.length) {
        return 1;
    }

    const max = orders.reduce((max: number, item: any) => {
        const orderCode = item.orderCode;

        if (!orderCode.includes(prefixNewOrderCode)) {
            return max;
        }

        const num = parseInt(orderCode.match(/\d+/)?.[0] || "0");
        return num > max ? num : max;
    }, 0);

    return max + 1;
}