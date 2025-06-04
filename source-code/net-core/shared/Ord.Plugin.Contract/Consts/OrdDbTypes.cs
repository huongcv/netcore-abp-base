using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ord.Plugin.Contract.Consts
{
    public class OrdDbTypes
    {
        /// <summary>
        /// Cho số lượng
        /// </summary>
        public const string DecimalQty = "decimal(10,3)";
        /// <summary>
        /// Giá
        /// </summary>
        public const string DecimalPrice = "decimal(15,5)";
        /// <summary>
        /// Tổng cộng các kiểu
        /// </summary>
        public const string DecimalAmount = "decimal(25,5)";
        /// <summary>
        /// Gía trị phần trăm
        /// </summary>
        public const string DecimalPercent = "decimal(5,2)";
        /// <summary>
        /// Cho tỷ lệ chuyển đổi
        /// </summary>
        public const string DecimalConvertRate = "decimal(10,2)";
        
    }
}
