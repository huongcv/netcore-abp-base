using Ord.Plugin.Contract.Factories;

namespace Ord.Plugin.Core.Factories.Extensions
{
    public static class AppFactoryFileUtil
    {
        public static string BuildLocalizedExcelFilePath(this IAppFactory factory, string fileNameWithoutExtension, params string[] subPaths)
        {
            var cultureName = factory.GetCurrentCulture();

            // Gộp các thư mục con (nếu có), thư mục gốc "Excel"
            var allPaths = new List<string> { "Excel" };
            if (subPaths != null && subPaths.Length > 0)
            {
                allPaths.AddRange(subPaths);
            }

            // Thêm file name với culture
            var fileName = $"{fileNameWithoutExtension}_{cultureName}.xlsx";
            allPaths.Add(fileName);
            return Path.Combine(allPaths.ToArray());
        }
    }
}
