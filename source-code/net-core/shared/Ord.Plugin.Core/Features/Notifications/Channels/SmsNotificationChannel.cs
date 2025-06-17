using Ord.Plugin.Contract.Features.Notifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ord.Domain.Enums;

namespace Ord.Plugin.Core.Features.Notifications.Channels
{
    public class SmsNotificationChannel : NotificationChannelBase
    {
        public override NotificationChannel ChannelType => NotificationChannel.Sms;
    }
}
