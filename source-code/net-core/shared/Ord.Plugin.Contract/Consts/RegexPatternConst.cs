namespace Ord.Plugin.Contract.Consts
{
    public static class RegexPatternConst
    {
        public const string UserNameRegex = @"^[A-Za-z0-9_]{4,29}$";
        public const string PasswordRegex = @"^(?=.*[A-Z])^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$";
        public const string CodeRegex = @"^[a-zA-Z0-9_]*$";
        public const string PhoneNumberVietNam = @"^(0)(2[0-9][0-9]|3[2-9]|5[2|6|8|9]|7[0|6-9]|8[0-9]|9[0-9])[0-9]{7}$";
        public const string Email = @"^(?!.*[!#$%^&*()+=\[\]{}|;:'\"",<>?/\\`~])(?!.*\.\.)(?!^\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?<!\.)$";
    }
}
