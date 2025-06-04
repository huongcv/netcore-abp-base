namespace Ord.Plugin.Contract.Features.Mailing
{
    public class MailContent
    {
        public string To { get; set; }    
        public string Subject { get; set; }  
        public string Body { get; set; }  
        public List<string>? ListEmailCC { get; set; }
    }
}
