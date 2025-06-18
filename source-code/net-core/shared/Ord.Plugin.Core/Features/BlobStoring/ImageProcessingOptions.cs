using SixLabors.ImageSharp.Processing;

namespace Ord.Plugin.Contract.Features.BlobStoring
{
    public class ImageProcessingOptions
    {
        public int? MaxWidth { get; set; }
        public int? MaxHeight { get; set; }
        public int Quality { get; set; } = 85;
        public string OutputFormat { get; set; } = "jpeg"; // jpeg, png, webp
        public bool KeepAspectRatio { get; set; } = true;
        public bool AllowEnlarge { get; set; } = false;
    }

    public class ThumbnailOptions
    {
        public int Width { get; set; } = 300;
        public int Height { get; set; } = 300;
        public ResizeMode Mode { get; set; } = ResizeMode.Crop;
        public AnchorPositionMode Position { get; set; } = AnchorPositionMode.Center;
        public int Quality { get; set; } = 90;
    }
}
