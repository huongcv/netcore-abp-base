import {action, computed, makeObservable, observable} from 'mobx';
import {AppBootstrapDto, BusinessTypeEnum, TenantTypeEnum} from "@ord-core/service-proxies/session/dto";
import {ShopType, UserCurrentShopAssign} from "@api/index.defs";
import {ROLE_PHARMACY, SystemCodeType} from "@ord-core/AppConst";
import {UserFireBaseTokensService} from "@api/UserFireBaseTokensService";

export enum ShopTypeEnum {
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
    ProShop = 301
}


class SessionStore {
    appSession: AppBootstrapDto = new AppBootstrapDto();

    private _firebaseToken: string | undefined = undefined;

    constructor() {
        makeObservable(this, {
            appSession: observable,
            isLogined: computed,
            user: computed,
            hasTenancy: computed,
            permissions: computed,
            tenantCode: computed,
            currentShopId: computed,
            userId: computed,
            shops: computed,
            systemCode: computed,
            setSession: action,
            currentShopName: computed,
            setFirebaseToken: action,
            firebaseToken: computed,
        })
    }

    get isPharmacy() {
        return this.appSession.permissionGranted[ROLE_PHARMACY] == true;
    }
    get isGolfShop() {
        return this.currentShopType == ShopTypeEnum.Golf;
    }
    get isGolfTenant() {
        return this.user?.tenantType == TenantTypeEnum.Golf;
    }
    get isNhaHang() {
        return this.currentShopType == ShopTypeEnum.NhaHang;
    }
    get currentShopInfo(): UserCurrentShopAssign | undefined {
        if (!this.appSession?.currentShop) {
            return;
        }
        return this.appSession.listAssignedShop?.find(x => x.shopId == this.appSession?.currentShop);
    }

    get currentShopCode() {
        const f = this.currentShopInfo;
        return f?.shopCode;
    }

    get currentShopName() {
        const f = this.currentShopInfo;
        return f?.shopName;
    }

    get currentProductPriceListMainId() {
        const f = this.currentShopInfo;
        return f?.productPriceListMainId;
    }

    get currentShopType(): ShopType | undefined {
        const f = this.currentShopInfo;
        return f?.shopType as ShopType;
    }

    get businessType(): ShopType | undefined {
        const f = this.currentShopInfo;
        return f?.businessType as BusinessTypeEnum;
    }

    get isLogined() {
        return this.appSession.isLogined;
    }

    get user() {
        return this.appSession.user;
    }

    get hasTenancy() {
        return this.appSession?.user?.tenantId !== null;
    }

    get tenantCode() {
        return this.appSession?.user?.tenantDto?.code;
    }

    get permissions() {
        return this.appSession?.user?.listPermission || [];
    }

    get userId() {
        return this.appSession?.user?.id || null;
    }

    get shops() {
        return this.appSession?.listAssignedShop || [];
    }

    get systemCode(): SystemCodeType {
        switch (this.currentShopInfo?.shopType as ShopTypeEnum) {
            case ShopTypeEnum.Golf:
                return "golf";
            case ShopTypeEnum.NhaHang:
                return "restaurant";
            case ShopTypeEnum.KhachSanNhaNghi:
                return "hotel";
            default:
                return "shop";
        }
    }

    setSession(session: AppBootstrapDto) {
        if (session?.user) {
            session.permissionGranted = {};
            if (session?.user?.listPermission) {
                session.user.listPermission.forEach(namePermission => {
                    session.permissionGranted[namePermission] = true;
                });
            }
            // if (this.currentShopType == 4 // Nha thuoc
            //     || this.currentShopType == 206 // Phong Kham
            //     || this.currentShopType == 207 // NhaKinhDoanhPhanPhoiDuocPham
            // ) {
            //     session.permissionGranted[ROLE_PHARMACY] = true;
            // }
        }
        this.appSession = session;
    }

    get currentShopId() {
        return this.appSession?.currentShop;
    }

    setFirebaseToken(token: string | undefined) {
        const currentToken = sessionStorage.getItem("firebaseToken") ;
        if(token && currentToken!== token) {
            UserFireBaseTokensService.cruFirebaseTokenFromCurrentUser({
                body:{
                    fireBaseToken: token,
                    platform:"Web",
                }
            }).then(()=>{
                sessionStorage.setItem("firebaseToken", token || "");
            })
        }

        this._firebaseToken = token;
    }

    get firebaseToken() {
        return this._firebaseToken;
    }
}

export default SessionStore;
