using Ord.Plugin.Contract.Utils;

namespace Ord.Plugin.Contract.Features.Notifications
{
    [Serializable]
    public class NotificationData
    {
        private readonly Dictionary<string, object> _properties;

        /// <summary>
        /// Gets notification data type name.
        /// It returns the full class name by default.
        /// </summary>
        public virtual string Type => this.GetType().FullName;

        /// <summary>
        /// Shortcut to set/get <see cref="P:Abp.Notifications.NotificationData.Properties" />.
        /// </summary>
        public object this[string key]
        {
            get => this.Properties.GetOrDefault<string, object>(key);
            set => this.Properties[key] = value;
        }

        /// <summary>
        /// Can be used to add custom properties to this notification.
        /// </summary>
        public Dictionary<string, object> Properties
        {
            get => this._properties;
            set
            {
                if (value == null)
                    throw new ArgumentNullException(nameof(value));
                foreach (KeyValuePair<string, object> keyValuePair in value)
                {
                    if (!this._properties.ContainsKey(keyValuePair.Key))
                        this._properties[keyValuePair.Key] = keyValuePair.Value;
                }
            }
        }

        /// <summary>Createa a new NotificationData object.</summary>
        public NotificationData() => this._properties = new Dictionary<string, object>();

        public override string ToString() => this.ToJsonString();
    }
}
