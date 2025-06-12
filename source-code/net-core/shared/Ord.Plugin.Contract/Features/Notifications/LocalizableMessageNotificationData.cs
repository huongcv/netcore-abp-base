namespace Ord.Plugin.Contract.Features.Notifications
{
    [Serializable]
    public class LocalizableMessageNotificationData : NotificationData
    {
        private LocalizableString _message;
        public LocalizableString Message
        {
            get => this._message ?? this[nameof(Message)] as LocalizableString;
            set
            {
                this[nameof(Message)] = (object)value;
                this._message = value;
            }
        }

        /// <summary>Needed for serialization.</summary>
        private LocalizableMessageNotificationData()
        {
        }
        public LocalizableMessageNotificationData(LocalizableString message) => this.Message = message;
    }
}
