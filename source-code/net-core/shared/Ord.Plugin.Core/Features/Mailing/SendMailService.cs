using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using MimeKit;
using Ord.Plugin.Contract.Features.Mailing;
using Ord.Plugin.Contract.Features.SystemSetting.Dto;
using Ord.Plugin.Contract.Setting;
using Ord.Plugin.Contract.Utils;

namespace Ord.Plugin.Core.Features.Mailing
{
    public class SendMailService : ISendMailService
    {
        private readonly ISettingSharedManger _settingSharedManger;
        private readonly ILogger<SendMailService> _logger;

        public SendMailService(
            ISettingSharedManger settingSharedManger,
            ILogger<SendMailService> logger)
        {
            _settingSharedManger = settingSharedManger;
            _logger = logger;
        }

        public async Task SendMail(MailContent mailContent)
        {
            var mailSettings = await GetMailSettings();

            var email = CreateMimeMessage(mailSettings, mailContent.Subject, mailContent.Body);
            email.To.Add(MailboxAddress.Parse(mailContent.To));

            if (mailContent.ListEmailCC?.Any() == true)
            {
                foreach (var emailCc in mailContent.ListEmailCC.Where(StringUtil.IsValidEmail))
                {
                    email.Cc.Add(MailboxAddress.Parse(emailCc));
                }
            }

            await SendAsync(email, mailSettings);
        }

        public async Task SendMail(Action<MimeMessage> configureMessage, string htmlBody = "")
        {
            var mailSettings = await GetMailSettings();

            var email = CreateMimeMessage(mailSettings, null, htmlBody);
            configureMessage.Invoke(email);

            await SendAsync(email, mailSettings);
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            await SendMail(new MailContent
            {
                To = email,
                Subject = subject,
                Body = htmlMessage
            });
        }

        private MimeMessage CreateMimeMessage(MailSettings settings, string? subject, string? htmlBody)
        {
            var email = new MimeMessage();
            var mailbox = new MailboxAddress(settings.DisplayName, settings.Mail);

            email.Sender = mailbox;
            email.From.Add(mailbox);
            email.Subject = subject ?? string.Empty;

            if (!string.IsNullOrEmpty(htmlBody))
            {
                email.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();
            }

            return email;
        }

        private async Task SendAsync(MimeMessage email, MailSettings settings)
        {
            using var smtp = new SmtpClient();

            try
            {
                await smtp.ConnectAsync(settings.Host, settings.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(settings.Mail, settings.Password);
                await smtp.SendAsync(email);

                _logger.LogInformation("Email sent to: {To}", string.Join(", ", email.To.Select(x => x.ToString())));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to: {To}", string.Join(", ", email.To.Select(x => x.ToString())));
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }

        public async Task<MailSettings> GetMailSettings()
        {
            var prefix = SmtpMailingDto.PrefixName;

            return new MailSettings
            {
                Host = await _settingSharedManger.GetForApp(prefix + "Host", "smtp.gmail.com"),
                Port = await _settingSharedManger.GetForApp(prefix + "Port", 587),
                Mail = await _settingSharedManger.GetForApp<string>(prefix + "UserName"),
                Password = await _settingSharedManger.GetForApp<string>(prefix + "Password"),
                DisplayName = await _settingSharedManger.GetForApp<string>(prefix + "DisplayName")
            };
        }
    }
}
