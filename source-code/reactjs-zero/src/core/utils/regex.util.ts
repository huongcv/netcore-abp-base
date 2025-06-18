class RegexUtil {
  CodeRegex = /^[a-zA-Z0-9_-]*$/;
  ProductLotNumberRegex = /^[a-zA-Z0-9_\- ]*$/;
  CodeTenantRegex = /^[a-z0-9]*$/;
  Password = /^(?=.*[A-Z])^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$/;
  UserName = /^[a-z0-9_]{5,30}$/; // cho phép số, sau phục vụ số điện thoại
  // Email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  Email =
    /^(?!.*[!#$%^&*()+=\[\]{}|;:'\",<>?/\\`~])(?!.*\.\.)(?!^\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?<!\.)$/;
  PhoneVn =
    /^(0)(2[0-9][0-9]|3[2-9]|5[2|6|8|9]|7[0|6-9]|8[0-9]|9[0-9])[0-9]{7}$/;
  CCCD = /^(\d{12}|\d{9})$/;
  NumberOnly = /^\d*$/;
  AlphaNumeric = /^[a-zA-Z0-9]*$/;
  UserName2 = /^[a-z0-9]+(_[a-z0-9]+)*$/;
  TaxCode = /^\d{10}(-\d{3})?$/;
  NoWhitespace = /^\S*$/;
  NoSpecialAscii = /^[a-zA-Z0-9\u00C0-\u024F]*$/;
  OnlyNumber = /^[0-9]*$/;
  QrCCCD =/^([^|]*\|){6,11}[^|]*$/;
}

export default new RegexUtil();
