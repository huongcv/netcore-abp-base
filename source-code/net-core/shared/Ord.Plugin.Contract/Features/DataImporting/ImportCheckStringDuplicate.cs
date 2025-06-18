using Ord.Plugin.Contract.Factories;

namespace Ord.Plugin.Contract.Features.DataImporting
{
    public class ImportCheckStringDuplicate
    {
        private HashSet<string> _existingInDb = new();
        private HashSet<string> _currentFile = new();
        private Dictionary<string, int> _codeRowMapping = new();

        public async Task SetListValueDbAsync(Func<Task<List<string>>> funGetValues)
        {
            var valueDbs = await funGetValues() ?? new();
            _existingInDb = valueDbs.Where(c => !string.IsNullOrWhiteSpace(c))
                .Select(c => c.Trim().ToUpper())
                .ToHashSet();
            _currentFile.Clear();
            _codeRowMapping.Clear();
        }
        public List<string> Validate(IAppFactory appFactory,
            string valueImport,
            int? rowIndex,
            string messageExistsDatabase = "message.validation.import_code_exists_database",
            string messageDuplicateFile = "message.validation.import_code_duplicate_file")
        {
            
            var errors = new List<string>();
            if (string.IsNullOrEmpty(valueImport))
            {
                return errors;
            }
            var normalizedCode = valueImport.Trim().ToUpper();
            // 1. Kiểm tra trùng với dữ liệu trong DB
            if (_existingInDb.Contains(normalizedCode))
            {
                errors.Add(appFactory.GetLocalizedMessage(messageExistsDatabase, valueImport));
            }
            // 2. Kiểm tra trùng trong file hiện tại
            if (_currentFile.Contains(normalizedCode))
            {
                var duplicateRowNumber = _codeRowMapping[normalizedCode];
                errors.Add(appFactory.GetLocalizedMessage("message.validation.import_code_duplicate_file",
                    valueImport, duplicateRowNumber));
            }
            else
            {
                // Thêm vào cache nếu chưa trùng
                _currentFile.Add(normalizedCode);
                _codeRowMapping[normalizedCode] = rowIndex ?? 0;
            }
            return (errors);
        }
    }
}
