namespace Ord.Plugin.Contract.Attributes
{
    /// <summary>
    /// Tạm dùng cái này ể làm chueyern ngũ cho Moble ; sau bo sau 
    /// </summary>
    public class EnumDisplayTextViAttribute : Attribute
    {
        public string DisplayText;
        public int SubGroup;

        public EnumDisplayTextViAttribute(string text)
        {
            DisplayText = text;
        }
        public EnumDisplayTextViAttribute(string text,int subGroup)
        {
            DisplayText = text;
            SubGroup = subGroup;
        }
    }
}
