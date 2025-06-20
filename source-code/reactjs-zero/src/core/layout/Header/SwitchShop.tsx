import {CheckCircleTwoTone, StarFilled,} from "@ant-design/icons";
import {AuthService} from "@api/AuthService";
import CurrentShopUtil from "@ord-core/utils/currentShop.util";
import jwtUtils from "@ord-core/utils/jwt.utils";
import uiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import {Button, Form, Modal, Space} from "antd";
import React, {useEffect, useState} from "react";
import "./HeaderRight.scss";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {ShopType} from "@ord-core/model/side-nav.type";


const shopTypeDisplay: Record<number, { title: string; icon: string }> = {
    [ShopType.KhoTrungTam]: { title: "Kho trung tâm", icon: "/images/shop.png" },
    [ShopType.ThoiTrang]: { title: "Thời trang", icon: "/images/shop.png" },
    [ShopType.DienThoaiDienMay]: { title: "Điện thoại - Điện máy", icon: "/images/shop.png" },
    [ShopType.VatLieuXayDung]: { title: "Vật liệu xây dựng", icon: "/images/shop.png" },
    [ShopType.NhaThuoc]: { title: "Nhà thuốc", icon: "/images/shop.png" },
    [ShopType.MeVaBe]: { title: "Mẹ và bé", icon: "/images/shop.png" },
    [ShopType.SachVanPhongPham]: { title: "Sách & Văn phòng phẩm", icon: "/images/shop.png" },
    [ShopType.SanXuat]: { title: "Sản xuất", icon: "/images/shop.png" },
    [ShopType.TapHoaVaSieuThi]: { title: "Tạp hóa & Siêu thị", icon: "/images/shop.png" },
    [ShopType.MyPham]: { title: "Mỹ phẩm", icon: "/images/shop.png" },
    [ShopType.NongSangThucPham]: { title: "Nông sản & Thực phẩm", icon: "/images/shop.png" },
    [ShopType.XeMayMoc]: { title: "Xe & Máy móc", icon: "/images/shop.png" },
    [ShopType.NoiThatGiaDung]: { title: "Nội thất & Gia dụng", icon: "/images/shop.png" },
    [ShopType.HoaQuaTang]: { title: "Hoa & Quà tặng", icon: "/images/shop.png" },
    [ShopType.Khac]: { title: "Khác", icon: "/images/shop.png" },
    [ShopType.NhaHang]: { title: "Nhà hàng", icon: "/images/restaurant-building.png" },
    [ShopType.QuanAn]: { title: "Quán ăn", icon: "/images/shop.png" },
    [ShopType.CafeTraSua]: { title: "Cafe & Trà sữa", icon: "/images/shop.png" },
    [ShopType.KaraokeBia]: { title: "Karaoke & Bia", icon: "/images/shop.png" },
    [ShopType.BarPubClub]: { title: "Bar, Pub, Club", icon: "/images/shop.png" },
    [ShopType.CangTinTramDungNghi]: { title: "Căng tin & Trạm dừng nghỉ", icon: "/images/shop.png" },
    [ShopType.BeautySpaMassage]: { title: "Beauty, Spa & Massage", icon: "/images/shop.png" },
    [ShopType.HairSalon]: { title: "Hair Salon", icon: "/images/shop.png" },
    [ShopType.KhachSanNhaNghi]: { title: "Khách sạn", icon: "/images/hotel.png" },
    [ShopType.HomestayVillaResort]: { title: "Homestay, Villa, Resort", icon: "/images/shop.png" },
    [ShopType.FitnessYoga]: { title: "Fitness & Yoga", icon: "/images/shop.png" },
    [ShopType.PhongKham]: { title: "Phòng khám", icon: "/images/shop.png" },
    [ShopType.NhaKinhDoanhPhanPhoiDuocPham]: { title: "Kinh doanh Dược phẩm", icon: "/images/shop.png" },
    [ShopType.Golf]: { title: "Golf", icon: "/images/golf.png" },
    [ShopType.ProShop]: { title: "ProShop", icon: "/images/shop.png" },
};

const SwitchShop = () => {
    const { sessionStore } = useStore();
    const [shopName, setShopName] = useState("Chọn cửa hàng");
    const [shopId, setShopId] = useState<number>();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const currentShopId = CurrentShopUtil.getShop();
        if (currentShopId) {
            const id = parseInt(currentShopId);
            setShopId(id);
            const found = sessionStore.shops.find((x) => x.shopId === id);
            if (found) setShopName(found.shopName as string);
        }
    }, [sessionStore.shops]);

    const onFinish = async (values: any) => {
        const { shopId } = values;
        setConfirmLoading(true);
        try {
            const ret = await AuthService.changeShop({ body: { shopPublishViewId: shopId } });
            if (ret.isSuccessful) {
                jwtUtils.saveToken(ret.data?.accessToken ?? "");
                jwtUtils.saveRefreshToken(ret.data?.refreshToken ?? "");
                CurrentShopUtil.setShop(shopId);
                location.href = "/";
            } else {
                uiUtils.showError(ret.notification?.message ?? "Có lỗi xảy ra!");
            }
        } catch {
            uiUtils.showError("Không thể đổi cửa hàng. Vui lòng thử lại!");
        }
        setConfirmLoading(false);
    };

    const getGroupKey = (type?: number) => {
        return [ShopType.Golf, ShopType.ProShop, ShopType.KhachSanNhaNghi, ShopType.NhaHang].includes(type as ShopType)
            ? type!
            : ShopType.Khac;
    };

    const grouped = sessionStore.shops.reduce((acc: Record<number, typeof sessionStore.shops>, shop) => {
        const key = getGroupKey(shop.shopType);
        if (!acc[key]) acc[key] = [];
        acc[key].push(shop);
        return acc;
    }, {});

    const onCancel = () => {
        setShopId(sessionStore.currentShopId); 
        setOpen(false); 
    }

    return (
        <Space>
            <Button
                onClick={() => setOpen(true)}
                className="btn-other border-0" type="default"
                icon={<IconlyLight type={'Location.svg'} />} size="middle">
                <div className={'hidden ord-switch-shop-md:block'}>{shopName}</div>
            </Button>
            <Modal
                title={<span >CHỌN CỬA HÀNG</span>}
                open={open}
                onCancel={() => onCancel()}
                onOk={() => form.submit()}
                okText={"Đổi cửa hàng"}
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item name="shopId" initialValue={shopId}>
                        <div
                            style={{ maxHeight: "60vh", overflowY: "auto" }}
                            className="shop-list-container px-1"
                        >
                            {Object.keys(grouped).map((type) => (
                                <React.Fragment key={type}>
                                    <div className="h-3" />
                                    {grouped[parseInt(type)].map((shop) => {
                                        const isSelected = shopId === shop.shopId;
                                        const iconUrl = shopTypeDisplay[shop.shopType as any]?.icon || "/images/shop.png";
                                        const typeName = shopTypeDisplay[shop.shopType as any]?.title || "Proshop";
                                        return (
                                            <div
                                                key={shop.shopId}
                                                className={`relative flex items-center justify-between px-5 py-4 rounded-xl mb-4 cursor-pointer transition-all duration-200 ease-in-out shadow-md border border-transparent bg-white hover:bg-[#f5f7fa]
              ${isSelected ? "ring-2 ring-blue-300 bg-[#e6f4ff]" : ""}`}
                                                onClick={() => {
                                                    requestAnimationFrame(() => {
                                                        form.setFieldsValue({ shopId: shop.shopId });
                                                        setShopId(shop.shopId);
                                                    });
                                                }}
                                            >
                                                {isSelected && (
                                                    <CheckCircleTwoTone
                                                        twoToneColor="#1890ff"
                                                        className="absolute top-2 right-2 text-lg"
                                                    />
                                                )}
                                                <div className="flex items-center gap-3 text-[16px] font-medium text-gray-800">
                                                    <img src={iconUrl} alt="icon" className="w-6 h-6 object-contain" />
                                                    <div>
                                                        <div className="font-semibold">{shop.shopName}</div>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            {shop.isMain && <StarFilled className="text-yellow-500 text-sm" />}
                                                            <span>{typeName}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default SwitchShop;
