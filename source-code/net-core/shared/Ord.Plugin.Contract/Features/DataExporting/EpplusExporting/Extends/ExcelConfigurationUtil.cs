using OfficeOpenXml.Style;
using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;
using System.Drawing;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting.Extends
{
    public static class ExcelConfigurationUtil
    {
        public static OrdExcelConfigurationBuilder DefaultConfig(this OrdExcelConfigurationBuilder config, string titleText, string? sheetName = null)
        {
            config
                .WithWorksheetName(sheetName ?? titleText)
                .WithTitle(title => title
                    .WithText(titleText)
                    .WithMargin(1, 3)
                    .WithRowHeight(35)
                    .WithStyle(style => style
                        .WithFont("Arial", 18)
                        .WithBoldFont()
                        .WithCenterAlignment()
                        .WithWrapText(true)
                        .WithFontColor(Color.DarkBlue)))
                .WithHeaderStyle(style => style
                    .WithBoldFont()
                    .WithRowHeight(25)
                    .WithFontSize(15)
                    .WithBackgroundColor(Color.LightBlue)
                    .WithCenterAlignment()
                    .WithAllBorders())
                .WithHeaderRowIndex(5)
                .WithAutoFitColumns(true, 10, 60)
                .WithDataStyle(style => style
                    .WithAllBorders(ExcelBorderStyle.Thin)
                    .WithFontSize(13)
                    .WithRowHeight(25)
                    .WithWrapText()
                )
                .WithLandscapeOrientation()
                //.WithPrintSettings(print => print
                //       // .WithHeader("HỆ THỐNG QUẢN LÝ NGƯỜI DÙNG")
                //    //.WithFooter("Trang {0} / {1}")
                //)
                ;
            return config;
        }
    }
}
