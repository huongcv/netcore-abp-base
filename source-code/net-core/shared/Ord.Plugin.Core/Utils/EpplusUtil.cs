using OfficeOpenXml.Style;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.DataExporting;
using Ord.Plugin.Contract.Factories;
using System.Drawing;

namespace Ord.Plugin.Core.Utils
{
    public static class EpplusUtil
    {
        public static void BoderAll(ExcelStyle cellStyle)
        {
            cellStyle.Border.Top.Style = ExcelBorderStyle.Thin;
            cellStyle.Border.Left.Style = ExcelBorderStyle.Thin;
            cellStyle.Border.Right.Style = ExcelBorderStyle.Thin;
            cellStyle.Border.Bottom.Style = ExcelBorderStyle.Thin;
        }

        public static OrdExportColumnData<T> ActivedColumn<T>(IAppFactory factory)
        where T: IHasActived
        {
            return new OrdExportColumnData<T>(
                x => factory.GetValueColumnIsActived(x.IsActived), 20)
            {
                FuncStyle = (dto, style) =>
                {
                    if (dto.IsActived)
                    {
                        style.Font.Color.SetColor(Color.Blue);
                    }
                    else
                    {
                        style.Font.Color.SetColor(Color.Red);
                    }
                }
            };
        }
    }
}
