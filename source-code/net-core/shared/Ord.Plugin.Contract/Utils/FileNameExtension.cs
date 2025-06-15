public static class FileNameHelper
{
    /// <summary>
    /// Sinh tên file kèm timestamp, tự động thêm phần mở rộng nếu chưa có.
    /// </summary>
    /// <param name="baseName">Tên file gốc (không chứa timestamp)</param>
    /// <param name="extension">Phần mở rộng (ví dụ: ".xlsx", ".pdf")</param>
    /// <returns>Tên file có định dạng: baseName_yyyyMMdd_HHmmss.extension</returns>
    public static string GenerateFileNameWithTimestamp(string baseName, string extension)
    {
        if (string.IsNullOrWhiteSpace(baseName))
            throw new ArgumentException("Base name cannot be null or empty.", nameof(baseName));

        if (string.IsNullOrWhiteSpace(extension))
            throw new ArgumentException("Extension cannot be null or empty.", nameof(extension));

        if (!extension.StartsWith("."))
            extension = "." + extension;

        var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
        return $"{baseName}_{timestamp}{extension}";
    }
    public static string GenerateFileNameExcelWithTimestamp(string baseName)
    {
        return GenerateFileNameWithTimestamp(baseName, ".xlsx");
    }
    public static string GenerateFileNamePdfWithTimestamp(string baseName)
    {
        return GenerateFileNameWithTimestamp(baseName, ".pdf");
    }
}