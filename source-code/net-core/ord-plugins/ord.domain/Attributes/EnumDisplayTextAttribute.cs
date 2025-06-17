namespace Ord.Plugin.Contract.Attributes
{
    public class EnumDisplayTextAttribute : Attribute
    {
        public string DisplayText;
        public int SubGroup;

        public EnumDisplayTextAttribute(string text)
        {
            DisplayText = text;
        }
        public EnumDisplayTextAttribute(string text,int subGroup)
        {
            DisplayText = text;
            SubGroup = subGroup;
        }
    }
}
