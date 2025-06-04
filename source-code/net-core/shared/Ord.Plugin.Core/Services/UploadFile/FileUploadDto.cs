namespace Ord.Plugin.Core.Services.UploadFile
{
    public class FileUploadDto
    {
        public string FileName { get; set; }
        public Guid FileId { get; set; }
        public string MimeType { get; set; }
        public byte[]? Bytes { get; set; }
        public string BlobContainerPath { get; set; }
        public string AbsPath
        {
            get
            {

                if (BlobContainerPath?.StartsWith("tenant_") != true)
                {
                    return $"host/{BlobContainerPath}";
                }
                var arrpart = BlobContainerPath.Split('/');
                string tenantId = "";
                if (arrpart.Length > 0)
                {
                    foreach (var part in arrpart.ToList())
                    {
                        if (part?.StartsWith("tenant_") == true)
                        {
                            try
                            {
                                tenantId = part.Replace("tenant_", "");
                                break;
                            }
                            catch
                            {

                            }

                        }
                    }
                }
                return $"tenants/{tenantId}/{BlobContainerPath}";
            }
        }
    }
}
