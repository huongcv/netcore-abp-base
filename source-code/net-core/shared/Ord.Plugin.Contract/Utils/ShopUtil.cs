using Ord.Plugin.Contract.Attributes;
using Ord.Plugin.Contract.Dtos;
using System.Reflection;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Core.Enums;

namespace Ord.Plugin.Contract.Utils
{
    public static class ShopUtil
    {
        public static bool IsPhamacyShop(ShopType? type)
        {
            if (type == ShopType.NhaThuoc || 
                type == ShopType.PhongKham ||
                type == ShopType.NhaKinhDoanhPhanPhoiDuocPham
               )
            {
                return true;
            }
            return false;
        }

        public static List<string> GetRoleExtendByShopType(ShopType? type)
        {
            if (IsPhamacyShop(type))
            {
                return new List<string>{RoleDefault.Pharmacy};
            }
            return new List<string>();
        }
       
    }
}
