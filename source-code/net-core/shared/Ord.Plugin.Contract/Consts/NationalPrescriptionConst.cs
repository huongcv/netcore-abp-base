namespace Ord.Plugin.Contract.Consts
{
    public class NationalPrescriptionConst
    {
        public const string AppName = "Viettel";
        public const string AppKey = "6bRog2jRWLf0qByYCywAfm0SolcwNjsVLXj9IRHlzzGXTn3RbPDf1WSepEwr";

        public static class ApiUrl
        {
            public static string GetDonThuoc = "https://donthuocquocgia.vn/api/v1/thong-tin-don-thuoc/";
            public static string Post_CapNhatSoLuongBan = "http://donthuocquocgia.vn/api/v1/cap-nhat-don-thuoc/";
            public static string Post_DonThuoc = "https://api.donthuocquocgia.vn/api/v1/gui-don-thuoc";
            public static string Post_DangNhapCSKCB = "https://api.donthuocquocgia.vn/api/auth/dang-nhap-co-so-kham-chua-benh";
            public static string Post_ThemBacSi = "https://api.donthuocquocgia.vn/api/v1/them-bac-si";
            public static string Post_XoaBacSi = "https://api.donthuocquocgia.vn/api/v1/xoa-bac-si";
            public static string Post_DangNhapBacSi = "https://api.donthuocquocgia.vn/api/auth/dang-nhap-bac-si";

            public static string Post_DonThuoc_YTeBox = "https://guidonthuoc.vn/api/v1/gui-don-thuoc";
            public static string Post_DangNhapBacSi_YTeBox = "https://guidonthuoc.vn/api/auth/dang-nhap-bac-si";
        }
    }
}
