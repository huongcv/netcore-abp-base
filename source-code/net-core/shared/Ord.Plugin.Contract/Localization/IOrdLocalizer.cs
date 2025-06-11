using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Localization
{
    public interface IOrdLocalizer : ISingletonDependency
    {
        /// <summary>
        /// Lấy localized string theo key
        /// </summary>
        /// <param name="key">Key có thể là "module.section.key" hoặc chỉ "key"</param>
        /// <returns>Localized string</returns>
        string this[string key] { get; }

        /// <summary>
        /// Lấy localized string với parameters
        /// </summary>
        /// <param name="key">Key có thể là "module.section.key" hoặc chỉ "key"</param>
        /// <param name="arguments">Parameters để format string</param>
        /// <returns>Formatted localized string</returns>
        string this[string key, params object[] arguments] { get; }

        /// <summary>
        /// Lấy localized string từ module cụ thể
        /// </summary>
        /// <param name="module">Tên module (common, auth, product...)</param>
        /// <param name="key">Key trong module</param>
        /// <returns>Localized string</returns>
        string GetString(string module, string key);

        /// <summary>
        /// Lấy localized string từ module cụ thể với parameters
        /// </summary>
        /// <param name="module">Tên module</param>
        /// <param name="key">Key trong module</param>
        /// <param name="arguments">Parameters để format</param>
        /// <returns>Formatted localized string</returns>
        string GetString(string module, string key, params object[] arguments);

        /// <summary>
        /// Lấy tất cả strings từ một module
        /// </summary>
        /// <param name="module">Tên module</param>
        /// <returns>Dictionary chứa tất cả key-value pairs</returns>
        Dictionary<string, string> GetAllStrings(string module);

        /// <summary>
        /// Kiểm tra key có tồn tại không
        /// </summary>
        /// <param name="key">Key cần kiểm tra</param>
        /// <returns>True nếu key tồn tại</returns>
        bool Exists(string key);

        /// <summary>
        /// Kiểm tra key có tồn tại trong module không
        /// </summary>
        /// <param name="module">Tên module</param>
        /// <param name="key">Key cần kiểm tra</param>
        /// <returns>True nếu key tồn tại</returns>
        bool Exists(string module, string key);
    }

}
