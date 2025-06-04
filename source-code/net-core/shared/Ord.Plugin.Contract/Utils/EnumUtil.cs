using Ord.Plugin.Contract.Attributes;
using Ord.Plugin.Contract.Dtos;
using System.Reflection;

namespace Ord.Plugin.Contract.Utils
{
    public static class EnumUtil
    {
        public static List<ComboOptionDto> EnumToListComboOption(Type typeEnum)
        {
            var options = new List<ComboOptionDto>();
            try
            {
                foreach (object iEnumItem in Enum.GetValues(typeEnum))
                {
                    var objTem = new ComboOptionDto
                    {
                        Value = ((int)iEnumItem),
                        DisplayName = GetEnumDescription((Enum)iEnumItem)
                    };
                    options.Add(objTem);
                }
               
            }
            catch (Exception ex)
            {
                //
            }
            return options;
        }
        public static string GetEnumDescription(Enum value)
        {
            if (value == null)
            {
                return string.Empty;
            }
            FieldInfo field = value.GetType().GetField(value.ToString());
            if (field == null)
            {
                return string.Empty;
            }
            var attribute = Attribute.GetCustomAttribute(field, typeof(EnumDisplayTextAttribute))
                    as EnumDisplayTextAttribute;
            return attribute == null ? value.ToString() : attribute.DisplayText;
        }
        
        /// <summary>
        /// se bo sau 
        /// </summary>
        /// <param name="typeEnum"></param>
        /// <returns></returns>
        public static List<ComboOptionDto> EnumToListComboOptionVn(Type typeEnum)
        {
            var options = new List<ComboOptionDto>();
            try
            {
                foreach (object iEnumItem in Enum.GetValues(typeEnum))
                {
                    var objTem = new ComboOptionDto
                    {
                        Value = ((int)iEnumItem),
                        DisplayName = GetEnumDescriptionVn((Enum)iEnumItem)
                    };
                    options.Add(objTem);
                }
               
            }
            catch (Exception ex)
            {
                //
            }
            return options;
        }
        
        /// <summary>
        /// Bỏ sau ; hạn che dung
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string GetEnumDescriptionVn(Enum value)
        {
            if (value == null)
            {
                return string.Empty;
            }
            FieldInfo field = value.GetType().GetField(value.ToString());
            if (field == null)
            {
                return string.Empty;
            }
            var attribute = Attribute.GetCustomAttribute(field, typeof(EnumDisplayTextViAttribute))
                as EnumDisplayTextViAttribute;
            return attribute == null ? value.ToString() : attribute.DisplayText;
        }
    }
}
