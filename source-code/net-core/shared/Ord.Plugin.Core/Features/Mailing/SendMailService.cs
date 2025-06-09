using MailKit.Security;
using Microsoft.Extensions.Logging;
using MimeKit;
using Ord.Plugin.Contract.Features.Mailing;
using Ord.Plugin.Contract.Setting;
using Ord.Plugin.Contract.Utils;

namespace Ord.Plugin.Core.Features.Mailing
{
    public class SendMailService : ISendMailService
    {
        private readonly ISettingSharedManger _settingSharedManger;
        private readonly ILogger<SendMailService> _logger;
        private MailSettings _mailSettings;
        public SendMailService(ISettingSharedManger settingSharedManger,
            ILogger<SendMailService> logger)
        {
            _settingSharedManger = settingSharedManger;
            _logger = logger;
        }

        public async Task SendMail(MailContent mailContent)
        {
            var mailSettings = await GetMailSettings();
            var email = new MimeMessage();
            email.Sender = new MailboxAddress(mailSettings.DisplayName, mailSettings.Mail);
            email.From.Add(new MailboxAddress(mailSettings.DisplayName, mailSettings.Mail));
            email.To.Add(MailboxAddress.Parse(mailContent.To));
            if (mailContent.ListEmailCC?.Any() == true)
            {
                foreach (var emailCc in mailContent.ListEmailCC)
                {
                    if (StringUtil.IsValidEmail(emailCc))
                    {
                        email.Cc.Add(MailboxAddress.Parse(emailCc));
                    }
                }
            }

            email.Subject = mailContent.Subject;
            var builder = new BodyBuilder
            {
                HtmlBody = mailContent.Body
            };
            email.Body = builder.ToMessageBody();
            await SendMail(email);
        }
        public async Task SendMail(Action<MimeMessage> mineFunc, string mailContent = "")
        {
            var mailSettings = await GetMailSettings();
            var email = new MimeMessage();
            mineFunc.Invoke(email);
            email.Sender = new MailboxAddress(mailSettings.DisplayName, mailSettings.Mail);
            email.From.Add(new MailboxAddress(mailSettings.DisplayName, mailSettings.Mail));
            if (!string.IsNullOrEmpty(mailContent))
            {
                var builder = new BodyBuilder
                {
                    HtmlBody = mailContent
                };
                email.Body = builder.ToMessageBody();
            }
            await SendMail(email);
        }
        protected async Task SendMail(MimeMessage email)
        {
            var mailSettings = await GetMailSettings();
            // dùng SmtpClient của MailKit
            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            try
            {
                await smtp.ConnectAsync(mailSettings.Host, mailSettings.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(mailSettings.Mail, mailSettings.Password);
                await smtp.SendAsync(email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            await smtp.DisconnectAsync(true);
            _logger.LogInformation("send mail to " + email.To);
        }



        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            await SendMail(new MailContent()
            {
                To = email,
                Subject = subject,
                Body = htmlMessage
            });
        }

        public async Task<MailSettings> GetMailSettings()
        {
            try
            {
                var Host = await _settingSharedManger.GetForApp("App:Setting:Mailing.Smtp.Host", "smtp.gmail.com");
                var Port = await _settingSharedManger.GetForApp("App:Setting:Mailing.Smtp.Port", 587);
                var Mail = await _settingSharedManger.GetForApp<string>("App:Setting:Mailing.Smtp.UserName");
                var Password = await _settingSharedManger.GetForApp<string>("App:Setting:Mailing.Smtp.Password");
                var DisplayName = await _settingSharedManger.GetForApp<string>("App:Setting:Mailing.Smtp.DisplayName");

                Console.WriteLine($"Password: {Password}, Mail: {Mail}");
                _mailSettings = new MailSettings
                {
                    Host = Host,
                    Port = Port,
                    Mail = Mail,
                    Password = Password,
                    DisplayName = DisplayName
                };

                return _mailSettings;

            }
            catch (Exception ex)
            {

                throw;
            }


        }
    }
}
