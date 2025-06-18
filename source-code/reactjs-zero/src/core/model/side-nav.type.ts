import React from "react";

export type UserMenuType = 'all' | 'admin-host' | 'admin-tenant' | 'shop';

export interface SideNavInterface {
    path?: string;
    title: string;
    icon?: React.ReactNode;
    permission?: string;
    isLeaf?: boolean;
    children?: SideNavInterface[];
    parentName?: string;
    key?: string;
    label?: React.ReactNode;
    menuType?: UserMenuType;
    keyCheck?: number
}

export enum ShopType {
    KhoTrungTam = -1,
    ThoiTrang = 1,
    DienThoaiDienMay = 2,
    VatLieuXayDung = 3,
    NhaThuoc = 4,
    MeVaBe = 5,
    SachVanPhongPham = 6,
    SanXuat = 7,
    TapHoaVaSieuThi = 8,
    MyPham = 9,
    NongSangThucPham = 10,
    XeMayMoc = 11,
    NoiThatGiaDung = 12,
    HoaQuaTang = 13,
    Khac = 100,
    NhaHang = 101,
    QuanAn = 102,
    CafeTraSua = 103,
    KaraokeBia = 104,
    BarPubClub = 105,
    CangTinTramDungNghi = 106,
    BeautySpaMassage = 201,
    HairSalon = 202,
    KhachSanNhaNghi = 203,
    HomestayVillaResort = 204,
    FitnessYoga = 205,
    PhongKham = 206,
    NhaKinhDoanhPhanPhoiDuocPham = 207,
    Golf = 300,
    ProShop = 301,
}
