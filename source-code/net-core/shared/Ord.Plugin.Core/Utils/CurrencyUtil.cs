using System.Globalization;
using System.Text;
using YamlDotNet.Core.Tokens;

namespace Ord.Plugin.Core.Utils
{
    public class CurrencyUtil
    {
        public static string FormatCurrency(decimal? value, bool isNullAsZero = false)
        {
            if (!value.HasValue)
            {
                return isNullAsZero ? "0" : "";
            }
            CultureInfo cultureNumber = CultureInfo.CreateSpecificCulture("en-US");
            if (value == 0)
            {
                return "0";
            }
            if ((value % 1) == 0)
            {
                return String.Format(cultureNumber, "{0:0,0}", value);
            }
            else
            {
                return String.Format(cultureNumber, "{0:N2}", value);
            }
        }

        public static string ConvertDecimalToVietnameseString(decimal? value, bool isNullAsZero)
        {
            try
            {
                if (!value.HasValue)
                {
                    return isNullAsZero ? "Không đồng" : "";
                }
                if (value == 0)
                {
                    return "Không đồng";
                }

                string tienTe = "đồng";
                string[] dv = { "", "mươi", "trăm", "nghìn", "triệu", "tỉ" };
                string[] cs = { "không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín" };
                var doc = new StringBuilder();

                value = (long)value;  // Loại bỏ các số 0 thừa phía sau phần thập phân
                string number = value.ToString();
                int len = number.Length;

                if (value < 0)
                {
                    doc.Append("Âm ");
                    value = Math.Abs(value.Value);
                    number = value.ToString();
                    len = number.Length;
                }

                int i = 0, rd = 0;
                while (i < len)
                {
                    int n = (len - i + 2) % 3 + 1;
                    bool found = false;

                    for (int j = 0; j < n; j++)
                    {
                        if (number[i + j] != '0')
                        {
                            found = true;
                            break;
                        }
                    }

                    if (found)
                    {
                        rd = 1;
                        for (int j = 0; j < n; j++)
                        {
                            bool ddv = true;
                            char digit = number[i + j];
                            int currentPosition = n - j - 1;

                            switch (digit)
                            {
                                case '0':
                                    if (currentPosition == 2)
                                        doc.Append(cs[0] + " ");
                                    else if (currentPosition == 1 && number[i + j + 1] != '0')
                                    {
                                        doc.Append("lẻ ");
                                        ddv = false;
                                    }

                                    break;
                                case '1':
                                    if (currentPosition == 2)
                                        doc.Append(cs[1] + " ");
                                    else if (currentPosition == 1)
                                    {
                                        doc.Append("mười "); ddv = false;
                                    }
                                    else if (i + j == 0 || number[i + j - 1] == '1' || number[i + j - 1] == '0')
                                        doc.Append(cs[1] + " ");
                                    else
                                        doc.Append("mốt ");
                                    break;
                                case '5':
                                    if (currentPosition == 0 && i + j > 0 && number[i + j - 1] != '0')
                                        doc.Append("lăm ");
                                    else
                                        doc.Append(cs[5] + " ");
                                    break;
                                default:
                                    doc.Append(cs[digit - '0'] + " ");
                                    break;
                            }

                            if (ddv)
                            {
                                doc.Append(dv[currentPosition] + " ");
                            }
                        }
                    }

                    if (len - i - n > 0)
                    {
                        int remainingDigits = len - i - n;
                        if (remainingDigits % 9 == 0)
                        {
                            if (rd == 1)
                            {
                                int t = remainingDigits / 9;
                                for (int k = 0; k < t; k++)
                                    doc.Append("tỉ ");
                            }
                            rd = 0;
                        }
                        else if (found)
                        {
                            doc.Append(dv[(remainingDigits % 9) / 3 + 2] + " ");
                        }
                    }

                    i += n;
                }

                if (doc.Length > 0)
                {
                    doc[0] = char.ToUpper(doc[0]);
                }

                return $"{doc.ToString().Trim()} {tienTe}".Replace("  ", " ");
            }
            catch (Exception ex)
            {
                return "";
            }

        }
    }
}
