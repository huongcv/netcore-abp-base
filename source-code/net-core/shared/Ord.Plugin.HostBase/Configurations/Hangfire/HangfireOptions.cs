using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ord.Plugin.HostBase.Configurations
{
    public class HangfireOptions
    {
        public const string SectionName = "Hangfire";

        public bool IsEnabled { get; set; } = false;
        public string ConnectionString { get; set; } = string.Empty;
        public string DashboardUrl { get; set; } = "/hangfire";
        public bool DashboardEnabled { get; set; } = false;
    }
}
