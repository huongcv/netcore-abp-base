namespace Ord.Plugin.Contract.Consts
{
    public static class RegexPatternConst
    {
        public const string UserNameRegex = @"^[A-Za-z0-9][A-Za-z0-9_]{4,29}$";
        public const string PasswordRegex = @"^(?=.*[A-Z])^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$";
        public const string CodeRegex = @"^[a-zA-Z0-9_]*$";
    }
}
