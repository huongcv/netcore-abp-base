using MimeKit;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Features.Mailing
{
    public interface ISendMailService : ITransientDependency
    {
        Task SendMail(MailContent mailContent);
        Task SendEmailAsync(string email, string subject, string htmlMessage);
        Task SendMail(Action<MimeMessage> mineFunc, string mailContent= "");
        Task<MailSettings> GetMailSettings();
    }
}
