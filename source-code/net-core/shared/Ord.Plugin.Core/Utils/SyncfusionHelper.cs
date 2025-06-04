using Syncfusion.DocIO.DLS;

namespace Ord.Plugin.Core.Utils
{
    public class SyncfusionViewModel
    {
        public List<WPicture> ListWPicture { get; set; }
        public List<WTable> ListWTable { get; set; }
        public List<WValue> ListWValue { get; set; }
        public SyncfusionViewModel()
        {
            ListWPicture = new List<WPicture>();
            ListWTable = new List<WTable>();
            ListWValue = new List<WValue>();
        }
    }

    public class WValue
    {
        public string Key { get; set; }
        public int Index { get; set; }
    }
    public class SyncfusionHelper
    {
        public static SyncfusionViewModel Get(WordDocument document)
        {
            SyncfusionViewModel syncfusionViewModel = new SyncfusionViewModel();

            if (document.Sections.Count == 1)
            {
                syncfusionViewModel = IterateTextBody(syncfusionViewModel, document.Sections[0].Body);
            }
            else
            {
                for (int i = 0; i < document.Sections.Count; i++)
                {
                    syncfusionViewModel = IterateTextBody(syncfusionViewModel, document.Sections[i].Body);
                }
            }


            return syncfusionViewModel;
        }

        private static SyncfusionViewModel IterateTextBody(SyncfusionViewModel syncfusionViewModel, WTextBody textBody)
        {
            for (int i = 0; i < textBody.ChildEntities.Count; i++)
            {
                IEntity bodyItemEntity = textBody.ChildEntities[i];
                switch (bodyItemEntity.EntityType)
                {
                    case EntityType.Paragraph:
                        WParagraph paragraph = bodyItemEntity as WParagraph;
                        if (paragraph.Text.Contains("[Value"))
                        {
                            syncfusionViewModel.ListWValue.Add(new WValue { Key = paragraph.Text, Index = i });
                        }
                        syncfusionViewModel = IterateParagraph(syncfusionViewModel, paragraph.Items);
                        break;
                    case EntityType.Table:
                        WTable table = bodyItemEntity as WTable;
                        syncfusionViewModel = IterateTable(syncfusionViewModel, table);
                        break;
                }
            }
            return syncfusionViewModel;
        }

        private static SyncfusionViewModel IterateTable(SyncfusionViewModel syncfusionViewModel, WTable table)
        {
            if (table.Rows.Count > 0)
                syncfusionViewModel.ListWTable.Add(table);

            foreach (WTableRow row in table.Rows)
            {
                foreach (WTableCell cell in row.Cells)
                {
                    syncfusionViewModel = IterateTextBody(syncfusionViewModel, cell);
                }
            }
            return syncfusionViewModel;
        }

        private static SyncfusionViewModel IterateParagraph(SyncfusionViewModel syncfusionViewModel, ParagraphItemCollection paraItems)
        {
            for (int i = 0; i < paraItems.Count; i++)
            {
                Entity entity = paraItems[i];
                switch (entity.EntityType)
                {
                    case EntityType.Picture:
                        syncfusionViewModel.ListWPicture.Add(entity as WPicture);
                        break;
                }
            }
            return syncfusionViewModel;
        }
    }
}
