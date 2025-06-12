namespace Ord.Plugin.Contract.Features.Notifications
{
    public class LocalizableString
    {
        public virtual string Name { get; private set; }
        public virtual List<string?> Parameters { get; private set; }
        private LocalizableString()
        {
        }
        public LocalizableString(string name,params string[] parameters)
        {
            this.Name = name;
            if (parameters != null)
            {
                this.Parameters = parameters.ToList();
            }
           
        }
    }
}
