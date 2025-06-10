namespace Ord.Plugin.Contract.Localization
{
    public interface ILocalizationPreloader
    {
        Task PreloadAllLocalizationDataAsync();
        void PreloadAllLocalizationData();
        bool IsPreloaded { get; }
    }
}
