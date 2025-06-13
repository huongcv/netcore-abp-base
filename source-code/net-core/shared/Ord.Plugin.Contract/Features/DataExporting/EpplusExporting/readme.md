

### Ví Dụ Xuất Cơ Bản

```csharp
public class UserExportService
{
    private readonly IEpplusExportingExcelService _exportService;
    
    public UserExportService(IEpplusExportingExcelService exportService)
    {
        _exportService = exportService;
    }
    
    public async Task<byte[]> ExportUsers(List<UserDto> users)
    {
        return await _exportService.ExportDataCollection(
            users,
            columns => columns
                .AddRowIndex("STT", 5)
                .AddColumn(x => x.UserName, "Tên đăng nhập", 15)
                .AddColumn(x => x.FullName, "Họ tên", 20)
                .AddColumn(x => x.Email, "Email", 25)
                .AddDateTimeColumn(x => x.CreationTime, "Ngày tạo", width: 18),
            config => config
                .WithWorksheetName("Danh sách người dùng")
                .WithTitle("BÁO CÁO NGƯỜI DÙNG HỆ THỐNG")
                .WithDefaultHeaderStyle()
                .WithLandscapeOrientation()
        );
    }
}
```

## 📚 Tham Chiếu API

### Phương Thức Chính

#### 1. ExportFromPagedQuery
Xuất dữ liệu từ database queries có hỗ trợ phân trang.

```csharp
Task<byte[]> ExportFromPagedQuery<TData>(
    OrdPagedRequestDto pagedInput,
    Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
    Action<OrdExportConfigurationBuilder> configurationBuilder,
    Action<OrdExportColumnBuilder<TData>> columnBuilder
) where TData : class
```

#### 2. ExportDataCollection  
Xuất dữ liệu từ collections có sẵn.

```csharp
Task<byte[]> ExportDataCollection<TData>(
    IEnumerable<TData> dataItems,
    Action<OrdExportColumnBuilder<TData>> columnBuilder,
    Action<OrdExportConfigurationBuilder>? configurationBuilder = null
) where TData : class
```

#### 3. ExportMultipleSheets
Xuất nhiều tập dữ liệu vào các worksheet khác nhau.

```csharp
Task<byte[]> ExportMultipleSheets(params OrdExportSheetConfiguration[] exportSheets)
```

#### 4. CreateSheetConfiguration
Phương thức hỗ trợ tạo cấu hình sheet cho việc xuất nhiều sheet.

```csharp
OrdExportSheetConfiguration CreateSheetConfiguration<TData>(
    string sheetName,
    IEnumerable<TData> dataItems,
    Action<OrdExportColumnBuilder<TData>> columnBuilder,
    Action<OrdExportConfigurationBuilder>? configurationBuilder = null
) where TData : class
```

## 💼 Ví Dụ Sử Dụng

### 1. Xuất Từ Paged Query (Database)

```csharp
public async Task<byte[]> ExportUsersFromDatabase(GetUsersInput input)
{
    return await _exportService.ExportFromPagedQuery(
        input,
        GetUsersPagedAsync, // Phương thức paged query có sẵn của bạn
        config => config
            .WithWorksheetName("Người dùng")
            .WithTitle("BÁO CÁO QUẢN LÝ NGƯỜI DÙNG")
            .WithHeaderStyle(style => style
                .WithBoldFont()
                .WithBackgroundColor(Color.LightBlue)
                .WithCenterAlignment()),
        columns => columns
            .AddRowIndex("STT", 5)
            .AddColumn(x => x.UserName, "Tên đăng nhập", 15)
            .AddColumn(x => x.Email, "Địa chỉ Email", 25)
            .AddDateColumn(x => x.CreationTime, "Ngày tạo", width: 12)
            .AddConditionalColumn(
                x => x.IsActive ? "Hoạt động" : "Không hoạt động",
                "Trạng thái",
                u => u.IsActive,
                Color.Green,
                Color.Red,
                10)
    );
}
```

### 2. Xuất Collection Với Định Dạng Nâng Cao

```csharp
public async Task<byte[]> ExportProducts(List<ProductDto> products)
{
    return await _exportService.ExportDataCollection(
        products,
        columns => columns
            .AddRowIndex()
            .AddColumn(x => x.Code, "Mã SP", style => style
                .WithBoldFont()
                .WithCenterAlignment(), 12)
            .AddColumn(x => x.Name, "Tên sản phẩm", 25)
            .AddCurrencyColumn(x => x.Price, "Giá bán", width: 15)
            .AddColumn(x => x.Quantity, "Số lượng", style => style
                .WithCenterAlignment()
                .WithNumberFormat("#,##0"), 10)
            .AddConditionalBackgroundColumn(
                x => x.Status,
                "Trạng thái",
                p => p.Status == "Active",
                Color.LightGreen,
                Color.LightCoral,
                15),
        config => config
            .WithWorksheetName("Sản phẩm")
            .WithTitle(title => title
                .WithText("BÁO CÁO SẢN PHẨM")
                .WithStyle(style => style
                    .WithFont("Arial", 16)
                    .WithBoldFont()
                    .WithFontColor(Color.DarkBlue)))
            .WithPrintSettings(print => print
                .WithLandscapeOrientation()
                .WithFitToPage()
                .WithHeader("Công ty ABC")
                .WithFooter("Trang {0} / {1}"))
    );
}
```

### 3. Báo Cáo Tài Chính Với Format Tùy Chỉnh

```csharp
public async Task<byte[]> ExportFinancialReport(List<TransactionDto> transactions)
{
    return await _exportService.ExportDataCollection(
        transactions,
        columns => columns
            .AddRowIndex("STT", 4)
            .AddDateColumn(x => x.TransactionDate, "Ngày GD", "dd/MM/yyyy", 12)
            .AddColumn(x => x.Reference, "Số chứng từ", 15)
            .AddColumn(x => x.Description, "Diễn giải", 30)
            .AddCurrencyColumn(x => x.DebitAmount, "Số nợ", "₫", 15)
            .AddCurrencyColumn(x => x.CreditAmount, "Số có", "₫", 15)
            .AddColumn(x => x.Balance, "Số dư", (data, style) =>
            {
                if (data.Balance < 0)
                {
                    style.Font.Color.SetColor(Color.Red);
                    style.Font.Bold = true;
                }
            }, 15),
        config => config
            .WithWorksheetName("Báo cáo tài chính")
            .WithTitle("BÁO CÁO TÀI CHÍNH")
            .WithHeaderRowIndex(6)
            .WithCustomWorksheet(worksheet =>
            {
                // Thêm thông tin công ty
                worksheet.Cells["A1"].Value = "CÔNG TY TNHH ABC";
                worksheet.Cells["A1"].Style.Font.Bold = true;
                worksheet.Cells["A2"].Value = "Báo cáo tài chính tháng " + DateTime.Now.Month;
                
                // Thêm dòng tổng kết ở cuối
                var lastRow = worksheet.Dimension?.End.Row ?? 1;
                var summaryRow = lastRow + 2;
                
                worksheet.Cells[summaryRow, 1, summaryRow, 4].Merge = true;
                worksheet.Cells[summaryRow, 1].Value = "TỔNG CỘNG:";
                worksheet.Cells[summaryRow, 1].Style.Font.Bold = true;
                worksheet.Cells[summaryRow, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                
                worksheet.Cells[summaryRow, 5].Formula = $"SUM(E7:E{lastRow})";
                worksheet.Cells[summaryRow, 6].Formula = $"SUM(F7:F{lastRow})";
            })
    );
}
```

## ⚙️ Hướng Dẫn Cấu Hình

### Cấu Hình Worksheet

```csharp
config => config
    .WithWorksheetName("Báo cáo của tôi")        // Tên worksheet
    .WithDefaultRowHeight(18)                    // Chiều cao hàng mặc định
    .WithDefaultColumnWidth(12)                  // Chiều rộng cột mặc định
    .WithAutoFitColumns(true, 8, 50)            // Tự động fit với min/max width
    .WithRowNumber(true, "STT", 5)              // Hiển thị số thứ tự
```

### Cấu Hình Tiêu Đề

```csharp
config => config
    .WithTitle("TIÊU ĐỀ BÁO CÁO")               // Tiêu đề đơn giản
    .WithTitle(title => title                    // Tiêu đề nâng cao
        .WithText("TIÊU ĐỀ BÁO CÁO CHI TIẾT")
        .WithRowIndex(2)
        .WithRowHeight(40)
        .WithStyle(style => style
            .WithFont("Times New Roman", 18)
            .WithBoldFont()
            .WithCenterAlignment()
            .WithFontColor(Color.DarkRed)))
```

### Cấu Hình Header

```csharp
config => config
    .WithHeaderRowIndex(5)                       // Header bắt đầu ở hàng 5
    .WithCustomColumnNames("Cột1", "Cột2")      // Ghi đè tên cột
    .WithDefaultHeaderStyle()                    // Sử dụng style header mặc định
    .WithHeaderStyle(style => style              // Style header tùy chỉnh
        .WithBoldFont()
        .WithBackgroundColor(Color.LightGray)
        .WithCenterAlignment()
        .WithAllBorders(ExcelBorderStyle.Medium))
```

### Cấu Hình In Ấn

```csharp
config => config
    .WithLandscapeOrientation()                  // Chế độ ngang
    .WithPortraitOrientation()                   // Chế độ dọc  
    .WithPrintSettings(print => print            // Cài đặt in nâng cao
        .WithOrientation(eOrientation.Landscape)
        .WithFitToPage(true, 1, 0)
        .WithMargins(0.7M, 0.7M, 0.75M, 0.75M)
        .WithHeader("Tên công ty")
        .WithFooter("Bảo mật"))
```

### Cấu Hình Nâng Cao

```csharp
config => config
    .WithCustomWorksheet(worksheet =>            // Tác vụ tùy chỉnh đồng bộ
    {
        worksheet.Cells["A1"].Value = "Header tùy chỉnh";
        worksheet.Protection.IsProtected = true;
    })
    .WithCustomWorksheetAsync(async worksheet => // Tác vụ tùy chỉnh bất đồng bộ
    {
        // Thêm biểu đồ, hình ảnh, v.v.
        await SomeAsyncOperation(worksheet);
    })
    .WithProtection("password123")               // Bảo vệ bằng mật khẩu
```

## 📊 Các Loại Cột

### Cột Cơ Bản

```csharp
columns => columns
    .AddRowIndex("STT", 5)                       // Cột số thứ tự
    .AddColumn(x => x.Name, "Tên", 20)           // Cột text đơn giản
    .AddColumn(x => x.Description, "Mô tả")      // Cột tự động width
```

### Cột Có Format

```csharp
columns => columns
    .AddCurrencyColumn(x => x.Price, "Giá", "₫", 15)         // Tiền tệ
    .AddDateColumn(x => x.Date, "Ngày", "dd/MM/yyyy", 12)    // Chỉ ngày
    .AddDateTimeColumn(x => x.Created, "Ngày tạo", width: 18) // Ngày & giờ
    .AddPercentageColumn(x => x.Rate, "Tỷ lệ", 2, 10)        // Phần trăm với 2 số thập phân
```

### Cột Có Điều Kiện

```csharp
columns => columns
    .AddConditionalColumn(                       // Màu text có điều kiện
        x => x.Status,
        "Trạng thái", 
        item => item.IsActive,
        Color.Green,    // Màu khi true
        Color.Red,      // Màu khi false
        12)
    .AddConditionalBackgroundColumn(             // Màu nền có điều kiện
        x => x.Priority,
        "Độ ưu tiên",
        item => item.Priority == "Cao",
        Color.Yellow,   // Nền khi true
        Color.White,    // Nền khi false  
        10)
```

### Cột Style Tùy Chỉnh

```csharp
columns => columns
    .AddColumn(x => x.Amount, "Số tiền", style => style
        .WithCurrencyFormat("₫")
        .WithBoldFont()
        .WithRightAlignment(), 15)
    .AddColumn(x => x.Status, "Trạng thái", (data, style) =>
    {
        // Style động dựa trên dữ liệu
        if (data.Status == "Nghiêm trọng")
        {
            style.Font.Color.SetColor(Color.Red);
            style.Font.Bold = true;
            style.Fill.PatternType = ExcelFillPatternType.Solid;
            style.Fill.BackgroundColor.SetColor(Color.Yellow);
        }
    }, 12)
```

## 🎨 Hướng Dẫn Định Dạng

### Định Dạng Font

```csharp
style => style
    .WithFont("Arial", 12)                       // Font family và size
    .WithFontSize(14)                            // Chỉ font size
    .WithBoldFont()                              // Text đậm
    .WithItalicFont()                            // Text nghiêng
    .WithUnderlineFont()                         // Text gạch chân
    .WithFontColor(Color.Blue)                   // Màu font
```

### Định Dạng Căn Chỉnh

```csharp
style => style
    .WithHorizontalAlignment(ExcelHorizontalAlignment.Center)  // Căn ngang
    .WithVerticalAlignment(ExcelVerticalAlignment.Middle)      // Căn dọc
    .WithCenterAlignment()                       // Căn giữa cả hai
    .WithWrapText()                              // Xuống dòng text
```

### Định Dạng Nền

```csharp
style => style
    .WithBackgroundColor(Color.LightBlue)        // Màu nền
    .WithBackgroundColor(Color.Yellow, ExcelFillPatternType.Solid) // Với pattern
```

### Định Dạng Viền

```csharp
style => style
    .WithAllBorders(ExcelBorderStyle.Thin)       // Tất cả viền
    .WithAroundBorder(ExcelBorderStyle.Medium)   // Viền xung quanh
    .WithBorder(border => border                 // Viền tùy chỉnh
        .WithTop(ExcelBorderStyle.Thick)
        .WithBottom(ExcelBorderStyle.Double)
        .WithColor(Color.Black))
```

### Định Dạng Số

```csharp
style => style
    .WithNumberFormat("#,##0.00")                // Format số tùy chỉnh
    .WithCurrencyFormat("₫")                     // Format tiền tệ
    .WithDateFormat("dd/MM/yyyy")                // Format ngày
    .WithDateTimeFormat("dd/MM/yyyy HH:mm")      // Format ngày giờ
    .WithPercentageFormat(2)                     // Phần trăm với 2 số thập phân
```

## 📑 Xuất Nhiều Sheet

### Cách 1: Sử Dụng Helper CreateSheetConfiguration

```csharp
public async Task<byte[]> ExportCompanyReport(
    List<UserDto> users,
    List<ProductDto> products, 
    List<OrderDto> orders)
{
    // Tạo cấu hình sheet
    var userSheet = _exportService.CreateSheetConfiguration(
        "Người dùng",
        users,
        col => col
            .AddRowIndex()
            .AddColumn(x => x.UserName, "Tên đăng nhập", 15)
            .AddColumn(x => x.Email, "Email", 25),
        config => config
            .WithTitle("BÁO CÁO NGƯỜI DÙNG")
            .WithDefaultHeaderStyle()
    );
    
    var productSheet = _exportService.CreateSheetConfiguration(
        "Sản phẩm", 
        products,
        col => col
            .AddRowIndex()
            .AddColumn(x => x.Name, "Tên sản phẩm", 20)
            .AddCurrencyColumn(x => x.Price, "Giá", width: 12),
        config => config
            .WithTitle("BÁO CÁO SẢN PHẨM")
            .WithDefaultHeaderStyle()
    );
    
    var orderSheet = _exportService.CreateSheetConfiguration(
        "Đơn hàng",
        orders,
        col => col
            .AddRowIndex()
            .AddColumn(x => x.OrderNumber, "Số đơn", 15)
            .AddDateColumn(x => x.OrderDate, "Ngày", width: 12)
            .AddCurrencyColumn(x => x.TotalAmount, "Tổng tiền", width: 15)
    );
    
    // Xuất tất cả sheet
    return await _exportService.ExportMultipleSheets(userSheet, productSheet, orderSheet);
}
```

### Cách 2: Cấu Hình Sheet Trực Tiếp

```csharp
public async Task<byte[]> ExportMultipleSheetsAdvanced()
{
    var sheets = new[]
    {
        OrdExportSheetConfiguration.Create(
            "Tổng quan",
            summaryData,
            summaryColumns,
            OrdExportConfiguration.Builder()
                .WithTitle("TỔNG QUAN BÁO CÁO")
                .WithLandscapeOrientation()
                .Build()
        ),
        OrdExportSheetConfiguration.Create(
            "Chi tiết", 
            detailData,
            detailColumns,
            OrdExportConfiguration.Builder()
                .WithTitle("BÁO CÁO CHI TIẾT")
                .WithPortraitOrientation()  
                .Build()
        )
    };
    
    return await _exportService.ExportMultipleSheets(sheets);
}
```

## 🏆 Best Practices

### 1. Tối Ưu Hiệu Suất

```csharp
// ✅ Tốt: Sử dụng query cụ thể cho export
public async Task<byte[]> ExportUsers(GetUsersInput input)
{
    return await _exportService.ExportFromPagedQuery(
        input,
        async (pagedInput) => {
            // Chỉ select những field cần thiết cho export
            var query = _userRepository
                .WhereIf(!string.IsNullOrEmpty(pagedInput.Filter), x => x.UserName.Contains(pagedInput.Filter))
                .Select(x => new UserExportDto 
                {
                    UserName = x.UserName,
                    Email = x.Email,
                    CreationTime = x.CreationTime
                });
            
            return await query.ToPagedListAsync(pagedInput);
        },
        config => config.WithTitle("Báo cáo người dùng"),
        columns => columns.AddRowIndex().AddColumn(x => x.UserName, "Tên đăng nhập")
    );
}

// ❌ Không tốt: Load toàn bộ entities
// return await _exportService.ExportFromPagedQuery(input, GetFullUsersAsync, ...);
```

### 2. Quản Lý Bộ Nhớ

```csharp
// ✅ Tốt: Xử lý dữ liệu theo chunks cho dataset lớn
public async Task<byte[]> ExportLargeDataset(List<LargeDataDto> data)
{
    // Xử lý theo batch nếu dữ liệu rất lớn
    const int batchSize = 10000;
    if (data.Count > batchSize)
    {
        _logger.LogWarning("Phát hiện dataset lớn: {Count} bản ghi", data.Count);
    }
    
    return await _exportService.ExportDataCollection(
        data,
        columns => columns.AddRowIndex().AddColumn(x => x.Name, "Tên"),
        config => config.WithTitle($"Báo cáo lớn ({data.Count:N0} bản ghi)")
    );
}
```

### 3. Xử Lý Lỗi

```csharp
public async Task<byte[]> ExportWithErrorHandling(List<DataDto> data)
{
    try
    {
        return await _exportService.ExportDataCollection(
            data,
            columns => columns
                .AddRowIndex()
                .AddColumn(x => x.Name ?? "N/A", "Tên") // Xử lý giá trị null
                .AddColumn(x => FormatSafeValue(x.Value), "Giá trị"), // Format an toàn
            config => config.WithTitle("Export An toàn")
        );
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Export thất bại với {RecordCount} bản ghi", data?.Count ?? 0);
        throw new UserFriendlyException("Export thất bại. Vui lòng thử lại.");
    }
}

private string FormatSafeValue(object value)
{
    return value switch
    {
        null => "N/A",
        DateTime dt => dt.ToString("dd/MM/yyyy"),
        decimal d => d.ToString("N2"),
        _ => value.ToString() ?? "N/A"
    };
}
```

### 4. Tái Sử Dụng Cấu Hình

```csharp
// Tạo cấu hình có thể tái sử dụng
public static class ExportConfigurations
{
    public static Action<OrdExportConfigurationBuilder> StandardReport(string title) => 
        config => config
            .WithTitle(title)
            .WithDefaultHeaderStyle()
            .WithLandscapeOrientation()
            .WithPrintSettings(print => print
                .WithHeader("Công ty ABC")
                .WithFooter("Tạo lúc: " + DateTime.Now.ToString("dd/MM/yyyy HH:mm")));
    
    public static Action<OrdExportConfigurationBuilder> FinancialReport(string title) =>
        config => config
            .WithTitle(title)
            .WithHeaderStyle(style => style
                .WithBoldFont()
                .WithBackgroundColor(Color.LightBlue)
                .WithCenterAlignment())
            .WithCustomWorksheet(ws => ws.Protection.IsProtected = true);
}

// Sử dụng
return await _exportService.ExportDataCollection(
    data,
    columns => columns.AddRowIndex().AddColumn(x => x.Name, "Tên"),
    ExportConfigurations.StandardReport("Báo cáo của tôi")
);
```

## 🔧 Khắc Phục Sự Cố

### Các Vấn Đề Thường Gặp

#### 1. Lỗi License EPPlus
```csharp
// Thêm dòng này trong constructor service
ExcelPackage.LicenseContext = LicenseContext.NonCommercial; // hoặc Commercial
```

#### 2. Vấn Đề Bộ Nhớ Với Dataset Lớn
```csharp
// Sử dụng paged queries thay vì load tất cả dữ liệu
return await _exportService.ExportFromPagedQuery(input, GetPagedDataAsync, ...);
```

#### 3. Vấn Đề Format DateTime
```csharp
// Sử dụng các formatter ngày tháng cụ thể
columns => columns
    .AddDateColumn(x => x.CreatedDate, "Ngày tạo", "dd/MM/yyyy", 12)
    .AddDateTimeColumn(x => x.UpdatedTime, "Cập nhật", "dd/MM/yyyy HH:mm", 15)
```

#### 4. Null Reference Exceptions
```csharp
// Luôn xử lý giá trị null trong column selectors
columns => columns
    .AddColumn(x => x.Name ?? "N/A", "Tên")
    .AddColumn(x => x.Category?.Name ?? "Chưa phân loại", "Danh mục")
```

### Mẹo Hiệu Suất

1. **Sử dụng projection**: Chỉ select những field cần thiết cho export
2. **Xử lý batch**: Xử lý dataset lớn theo chunks
3. **Thao tác async**: Sử dụng async/await một cách nhất quán
4. **Giải phóng bộ nhớ**: Service tự động xử lý việc dispose Excel package
5. **Độ rộng cột**: Đặt width cụ thể thay vì auto-fit cho dataset lớn

### Debugging

Bật logging chi tiết:
```csharp
// Trong appsettings.json
{
  "Logging": {
    "LogLevel": {
      "Ord.Plugin.Core.Features.DataExporting": "Debug"
    }
  }
}
```

## 📞 Hỗ Trợ

Khi gặp vấn đề:
1. Kiểm tra phần khắc phục sự cố ở trên
2. Bật debug logging để xem các bước export chi tiết
3. Xác minh cấ# IEpplusExportingExcelService - Complete Usage Guide

Modern Excel Export Service with Fluent API for ABP.IO applications using EPPlus library.

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Configuration Guide](#configuration-guide)
- [Column Types](#column-types)
- [Styling Guide](#styling-guide)
- [Multi-Sheet Export](#multi-sheet-export)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The `IEpplusExportingExcelService` provides a modern, fluent API for exporting data to Excel files with the following features:

- ✅ **Fluent API Design** - Easy to use builder patterns
- ✅ **Type-Safe Configuration** - Strongly typed column and style configurations  
- ✅ **Multiple Data Sources** - Support for paged queries and direct collections
- ✅ **Rich Styling** - Comprehensive styling options for headers, data, and titles
- ✅ **Multi-Sheet Support** - Export multiple datasets to different worksheets
- ✅ **Auto-Formatting** - Built-in formatters for currency, dates, percentages
- ✅ **Conditional Styling** - Style cells based on data conditions
- ✅ **Print Configuration** - Professional print settings

## 🚀 Installation

1. Install EPPlus package:
```bash
dotnet add package EPPlus
```

2. Register the service in your module:
```csharp
// In your module's ConfigureServices method
context.Services.AddTransient<IEpplusExportingExcelService, EpplusExportingExcelService>();
```

## ⚡ Quick Start

### Basic Export Example

```csharp
public class UserExportService
{
    private readonly IEpplusExportingExcelService _exportService;
    
    public UserExportService(IEpplusExportingExcelService exportService)
    {
        _exportService = exportService;
    }
    
    public async Task<byte[]> ExportUsers(List<UserDto> users)
    {
        return await _exportService.ExportDataCollection(
            users,
            columns => columns
                .AddRowIndex("STT", 5)
                .AddColumn(x => x.UserName, "Tên đăng nhập", 15)
                .AddColumn(x => x.FullName, "Họ tên", 20)
                .AddColumn(x => x.Email, "Email", 25)
                .AddDateTimeColumn(x => x.CreationTime, "Ngày tạo", width: 18),
            config => config
                .WithWorksheetName("Danh sách người dùng")
                .WithTitle("BÁO CÁO NGƯỜI DÙNG HỆ THỐNG")
                .WithDefaultHeaderStyle()
                .WithLandscapeOrientation()
        );
    }
}
```

## 📚 API Reference

### Core Methods

#### 1. ExportFromPagedQuery
Export data from database queries with pagination support.

```csharp
Task<byte[]> ExportFromPagedQuery<TData>(
    OrdPagedRequestDto pagedInput,
    Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
    Action<OrdExportConfigurationBuilder> configurationBuilder,
    Action<OrdExportColumnBuilder<TData>> columnBuilder
) where TData : class
```

#### 2. ExportDataCollection  
Export data from existing collections.

```csharp
Task<byte[]> ExportDataCollection<TData>(
    IEnumerable<TData> dataItems,
    Action<OrdExportColumnBuilder<TData>> columnBuilder,
    Action<OrdExportConfigurationBuilder>? configurationBuilder = null
) where TData : class
```

#### 3. ExportMultipleSheets
Export multiple datasets to different worksheets.

```csharp
Task<byte[]> ExportMultipleSheets(params OrdExportSheetConfiguration[] exportSheets)
```

#### 4. CreateSheetConfiguration
Helper method to create sheet configurations for multi-sheet exports.

```csharp
OrdExportSheetConfiguration CreateSheetConfiguration<TData>(
    string sheetName,
    IEnumerable<TData> dataItems,
    Action<OrdExportColumnBuilder<TData>> columnBuilder,
    Action<OrdExportConfigurationBuilder>? configurationBuilder = null
) where TData : class
```

## 💼 Usage Examples

### 1. Export from Paged Query (Database)

```csharp
public async Task<byte[]> ExportUsersFromDatabase(GetUsersInput input)
{
    return await _exportService.ExportFromPagedQuery(
        input,
        GetUsersPagedAsync, // Your existing paged query method
        config => config
            .WithWorksheetName("Users")
            .WithTitle("User Management Report")
            .WithHeaderStyle(style => style
                .WithBoldFont()
                .WithBackgroundColor(Color.LightBlue)
                .WithCenterAlignment()),
        columns => columns
            .AddRowIndex("No.", 5)
            .AddColumn(x => x.UserName, "Username", 15)
            .AddColumn(x => x.Email, "Email Address", 25)
            .AddDateColumn(x => x.CreationTime, "Created", width: 12)
            .AddConditionalColumn(
                x => x.IsActive ? "Active" : "Inactive",
                "Status",
                u => u.IsActive,
                Color.Green,
                Color.Red,
                10)
    );
}
```

### 2. Export Collection with Advanced Styling

```csharp
public async Task<byte[]> ExportProducts(List<ProductDto> products)
{
    return await _exportService.ExportDataCollection(
        products,
        columns => columns
            .AddRowIndex()
            .AddColumn(x => x.Code, "Mã SP", style => style
                .WithBoldFont()
                .WithCenterAlignment(), 12)
            .AddColumn(x => x.Name, "Tên sản phẩm", 25)
            .AddCurrencyColumn(x => x.Price, "Giá bán", width: 15)
            .AddColumn(x => x.Quantity, "Số lượng", style => style
                .WithCenterAlignment()
                .WithNumberFormat("#,##0"), 10)
            .AddConditionalBackgroundColumn(
                x => x.Status,
                "Trạng thái",
                p => p.Status == "Active",
                Color.LightGreen,
                Color.LightCoral,
                15),
        config => config
            .WithWorksheetName("Products")
            .WithTitle(title => title
                .WithText("BÁO CÁO SẢN PHẨM")
                .WithStyle(style => style
                    .WithFont("Arial", 16)
                    .WithBoldFont()
                    .WithFontColor(Color.DarkBlue)))
            .WithPrintSettings(print => print
                .WithLandscapeOrientation()
                .WithFitToPage()
                .WithHeader("Company ABC")
                .WithFooter("Page {0} of {1}"))
    );
}
```

### 3. Financial Report with Custom Formatting

```csharp
public async Task<byte[]> ExportFinancialReport(List<TransactionDto> transactions)
{
    return await _exportService.ExportDataCollection(
        transactions,
        columns => columns
            .AddRowIndex("STT", 4)
            .AddDateColumn(x => x.TransactionDate, "Ngày GD", "dd/MM/yyyy", 12)
            .AddColumn(x => x.Reference, "Số chứng từ", 15)
            .AddColumn(x => x.Description, "Diễn giải", 30)
            .AddCurrencyColumn(x => x.DebitAmount, "Số nợ", "₫", 15)
            .AddCurrencyColumn(x => x.CreditAmount, "Số có", "₫", 15)
            .AddColumn(x => x.Balance, "Số dư", (data, style) =>
            {
                if (data.Balance < 0)
                {
                    style.Font.Color.SetColor(Color.Red);
                    style.Font.Bold = true;
                }
            }, 15),
        config => config
            .WithWorksheetName("Financial Report")
            .WithTitle("BÁO CÁO TÀI CHÍNH")
            .WithHeaderRowIndex(6)
            .WithCustomWorksheet(worksheet =>
            {
                // Add company info
                worksheet.Cells["A1"].Value = "CÔNG TY TNHH ABC";
                worksheet.Cells["A1"].Style.Font.Bold = true;
                worksheet.Cells["A2"].Value = "Báo cáo tài chính tháng " + DateTime.Now.Month;
                
                // Add summary row at the end
                var lastRow = worksheet.Dimension?.End.Row ?? 1;
                var summaryRow = lastRow + 2;
                
                worksheet.Cells[summaryRow, 1, summaryRow, 4].Merge = true;
                worksheet.Cells[summaryRow, 1].Value = "TỔNG CỘNG:";
                worksheet.Cells[summaryRow, 1].Style.Font.Bold = true;
                worksheet.Cells[summaryRow, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                
                worksheet.Cells[summaryRow, 5].Formula = $"SUM(E7:E{lastRow})";
                worksheet.Cells[summaryRow, 6].Formula = $"SUM(F7:F{lastRow})";
            })
    );
}
```

## ⚙️ Configuration Guide

### Worksheet Configuration

```csharp
config => config
    .WithWorksheetName("My Report")           // Worksheet name
    .WithDefaultRowHeight(18)                 // Default row height
    .WithDefaultColumnWidth(12)               // Default column width
    .WithAutoFitColumns(true, 8, 50)         // Auto-fit with min/max width
    .WithRowNumber(true, "STT", 5)           // Show row numbers
```

### Title Configuration

```csharp
config => config
    .WithTitle("REPORT TITLE")                // Simple title
    .WithTitle(title => title                 // Advanced title
        .WithText("DETAILED REPORT TITLE")
        .WithRowIndex(2)
        .WithRowHeight(40)
        .WithStyle(style => style
            .WithFont("Times New Roman", 18)
            .WithBoldFont()
            .WithCenterAlignment()
            .WithFontColor(Color.DarkRed)))
```

### Header Configuration

```csharp
config => config
    .WithHeaderRowIndex(5)                    // Header starts at row 5
    .WithCustomColumnNames("Col1", "Col2")    // Override column names
    .WithDefaultHeaderStyle()                 // Use default header style
    .WithHeaderStyle(style => style           // Custom header style
        .WithBoldFont()
        .WithBackgroundColor(Color.LightGray)
        .WithCenterAlignment()
        .WithAllBorders(ExcelBorderStyle.Medium))
```

### Print Configuration

```csharp
config => config
    .WithLandscapeOrientation()               // Landscape mode
    .WithPortraitOrientation()                // Portrait mode  
    .WithPrintSettings(print => print         // Advanced print settings
        .WithOrientation(eOrientation.Landscape)
        .WithFitToPage(true, 1, 0)
        .WithMargins(0.7M, 0.7M, 0.75M, 0.75M)
        .WithHeader("Company Name")
        .WithFooter("Confidential"))
```

### Advanced Configuration

```csharp
config => config
    .WithCustomWorksheet(worksheet =>         // Sync custom actions
    {
        worksheet.Cells["A1"].Value = "Custom Header";
        worksheet.Protection.IsProtected = true;
    })
    .WithCustomWorksheetAsync(async worksheet => // Async custom actions
    {
        // Add charts, images, etc.
        await SomeAsyncOperation(worksheet);
    })
    .WithProtection("password123")            // Protect with password
```

## 📊 Column Types

### Basic Columns

```csharp
columns => columns
    .AddRowIndex("STT", 5)                    // Row number column
    .AddColumn(x => x.Name, "Name", 20)       // Simple text column
    .AddColumn(x => x.Description, "Desc")    // Auto-width column
```

### Formatted Columns

```csharp
columns => columns
    .AddCurrencyColumn(x => x.Price, "Price", "₫", 15)     // Currency
    .AddDateColumn(x => x.Date, "Date", "dd/MM/yyyy", 12)  // Date only
    .AddDateTimeColumn(x => x.Created, "Created", width: 18) // Date & time
    .AddPercentageColumn(x => x.Rate, "Rate", 2, 10)       // Percentage with 2 decimals
```

### Conditional Columns

```csharp
columns => columns
    .AddConditionalColumn(                    // Conditional text color
        x => x.Status,
        "Status", 
        item => item.IsActive,
        Color.Green,    // True color
        Color.Red,      // False color
        12)
    .AddConditionalBackgroundColumn(          // Conditional background
        x => x.Priority,
        "Priority",
        item => item.Priority == "High",
        Color.Yellow,   // True background
        Color.White,    // False background  
        10)
```

### Custom Styled Columns

```csharp
columns => columns
    .AddColumn(x => x.Amount, "Amount", style => style
        .WithCurrencyFormat("₫")
        .WithBoldFont()
        .WithRightAlignment(), 15)
    .AddColumn(x => x.Status, "Status", (data, style) =>
    {
        // Dynamic styling based on data
        if (data.Status == "Critical")
        {
            style.Font.Color.SetColor(Color.Red);
            style.Font.Bold = true;
            style.Fill.PatternType = ExcelFillPatternType.Solid;
            style.Fill.BackgroundColor.SetColor(Color.Yellow);
        }
    }, 12)
```

## 🎨 Styling Guide

### Font Styling

```csharp
style => style
    .WithFont("Arial", 12)                    // Font family and size
    .WithFontSize(14)                         // Font size only
    .WithBoldFont()                           // Bold text
    .WithItalicFont()                         // Italic text
    .WithUnderlineFont()                      // Underlined text
    .WithFontColor(Color.Blue)                // Font color
```

### Alignment Styling

```csharp
style => style
    .WithHorizontalAlignment(ExcelHorizontalAlignment.Center)  // Horizontal
    .WithVerticalAlignment(ExcelVerticalAlignment.Middle)      // Vertical
    .WithCenterAlignment()                    // Both center
    .WithWrapText()                           // Wrap text
```

### Background Styling

```csharp
style => style
    .WithBackgroundColor(Color.LightBlue)     // Background color
    .WithBackgroundColor(Color.Yellow, ExcelFillPatternType.Solid) // With pattern
```

### Border Styling

```csharp
style => style
    .WithAllBorders(ExcelBorderStyle.Thin)    // All borders
    .WithAroundBorder(ExcelBorderStyle.Medium) // Around border
    .WithBorder(border => border              // Custom borders
        .WithTop(ExcelBorderStyle.Thick)
        .WithBottom(ExcelBorderStyle.Double)
        .WithColor(Color.Black))
```

### Number Format Styling

```csharp
style => style
    .WithNumberFormat("#,##0.00")             // Custom number format
    .WithCurrencyFormat("₫")                  // Currency format
    .WithDateFormat("dd/MM/yyyy")             // Date format
    .WithDateTimeFormat("dd/MM/yyyy HH:mm")   // DateTime format
    .WithPercentageFormat(2)                  // Percentage with 2 decimals
```

## 📑 Multi-Sheet Export

### Method 1: Using CreateSheetConfiguration Helper

```csharp
public async Task<byte[]> ExportCompanyReport(
    List<UserDto> users,
    List<ProductDto> products, 
    List<OrderDto> orders)
{
    // Create sheet configurations
    var userSheet = _exportService.CreateSheetConfiguration(
        "Users",
        users,
        col => col
            .AddRowIndex()
            .AddColumn(x => x.UserName, "Username", 15)
            .AddColumn(x => x.Email, "Email", 25),
        config => config
            .WithTitle("USER REPORT")
            .WithDefaultHeaderStyle()
    );
    
    var productSheet = _exportService.CreateSheetConfiguration(
        "Products", 
        products,
        col => col
            .AddRowIndex()
            .AddColumn(x => x.Name, "Product Name", 20)
            .AddCurrencyColumn(x => x.Price, "Price", width: 12),
        config => config
            .WithTitle("PRODUCT REPORT")
            .WithDefaultHeaderStyle()
    );
    
    var orderSheet = _exportService.CreateSheetConfiguration(
        "Orders",
        orders,
        col => col
            .AddRowIndex()
            .AddColumn(x => x.OrderNumber, "Order #", 15)
            .AddDateColumn(x => x.OrderDate, "Date", width: 12)
            .AddCurrencyColumn(x => x.TotalAmount, "Total", width: 15)
    );
    
    // Export all sheets
    return await _exportService.ExportMultipleSheets(userSheet, productSheet, orderSheet);
}
```

### Method 2: Direct Sheet Configuration

```csharp
public async Task<byte[]> ExportMultipleSheetsAdvanced()
{
    var sheets = new[]
    {
        OrdExportSheetConfiguration.Create(
            "Summary",
            summaryData,
            summaryColumns,
            OrdExportConfiguration.Builder()
                .WithTitle("EXECUTIVE SUMMARY")
                .WithLandscapeOrientation()
                .Build()
        ),
        OrdExportSheetConfiguration.Create(
            "Details", 
            detailData,
            detailColumns,
            OrdExportConfiguration.Builder()
                .WithTitle("DETAILED REPORT")
                .WithPortraitOrientation()  
                .Build()
        )
    };
    
    return await _exportService.ExportMultipleSheets(sheets);
}
```

## 🏆 Best Practices

### 1. Performance Optimization

```csharp
// ✅ Good: Use specific queries for export
public async Task<byte[]> ExportUsers(GetUsersInput input)
{
    return await _exportService.ExportFromPagedQuery(
        input,
        async (pagedInput) => {
            // Only select needed fields for export
            var query = _userRepository
                .WhereIf(!string.IsNullOrEmpty(pagedInput.Filter), x => x.UserName.Contains(pagedInput.Filter))
                .Select(x => new UserExportDto 
                {
                    UserName = x.UserName,
                    Email = x.Email,
                    CreationTime = x.CreationTime
                });
            
            return await query.ToPagedListAsync(pagedInput);
        },
        config => config.WithTitle("Users Report"),
        columns => columns.AddRowIndex().AddColumn(x => x.UserName, "Username")
    );
}

// ❌ Bad: Loading full entities
// return await _exportService.ExportFromPagedQuery(input, GetFullUsersAsync, ...);
```

### 2. Memory Management

```csharp
// ✅ Good: Process data in chunks for large datasets
public async Task<byte[]> ExportLargeDataset(List<LargeDataDto> data)
{
    // Process in batches if data is very large
    const int batchSize = 10000;
    if (data.Count > batchSize)
    {
        _logger.LogWarning("Large dataset detected: {Count} records", data.Count);
    }
    
    return await _exportService.ExportDataCollection(
        data,
        columns => columns.AddRowIndex().AddColumn(x => x.Name, "Name"),
        config => config.WithTitle($"Large Report ({data.Count:N0} records)")
    );
}
```

### 3. Error Handling

```csharp
public async Task<byte[]> ExportWithErrorHandling(List<DataDto> data)
{
    try
    {
        return await _exportService.ExportDataCollection(
            data,
            columns => columns
                .AddRowIndex()
                .AddColumn(x => x.Name ?? "N/A", "Name") // Handle null values
                .AddColumn(x => FormatSafeValue(x.Value), "Value"), // Safe formatting
            config => config.WithTitle("Safe Export")
        );
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Export failed for {RecordCount} records", data?.Count ?? 0);
        throw new UserFriendlyException("Export failed. Please try again.");
    }
}

private string FormatSafeValue(object value)
{
    return value switch
    {
        null => "N/A",
        DateTime dt => dt.ToString("dd/MM/yyyy"),
        decimal d => d.ToString("N2"),
        _ => value.ToString() ?? "N/A"
    };
}
```

### 4. Configuration Reusability

```csharp
// Create reusable configuration
public static class ExportConfigurations
{
    public static Action<OrdExportConfigurationBuilder> StandardReport(string title) => 
        config => config
            .WithTitle(title)
            .WithDefaultHeaderStyle()
            .WithLandscapeOrientation()
            .WithPrintSettings(print => print
                .WithHeader("Company ABC")
                .WithFooter("Generated: " + DateTime.Now.ToString("dd/MM/yyyy HH:mm")));
    
    public static Action<OrdExportConfigurationBuilder> FinancialReport(string title) =>
        config => config
            .WithTitle(title)
            .WithHeaderStyle(style => style
                .WithBoldFont()
                .WithBackgroundColor(Color.LightBlue)
                .WithCenterAlignment())
            .WithCustomWorksheet(ws => ws.Protection.IsProtected = true);
}

// Usage
return await _exportService.ExportDataCollection(
    data,
    columns => columns.AddRowIndex().AddColumn(x => x.Name, "Name"),
    ExportConfigurations.StandardReport("My Report")
);
```

## 🔧 Troubleshooting

### Common Issues

#### 1. EPPlus License Error
```csharp
// Add this in your service constructor
ExcelPackage.LicenseContext = LicenseContext.NonCommercial; // or Commercial
```

#### 2. Memory Issues with Large Datasets
```csharp
// Use paged queries instead of loading all data
return await _exportService.ExportFromPagedQuery(input, GetPagedDataAsync, ...);
```

#### 3. DateTime Formatting Issues
```csharp
// Use specific date formatters
columns => columns
    .AddDateColumn(x => x.CreatedDate, "Created", "dd/MM/yyyy", 12)
    .AddDateTimeColumn(x => x.UpdatedTime, "Updated", "dd/MM/yyyy HH:mm", 15)
```

#### 4. Null Reference Exceptions
```csharp
// Always handle null values in column selectors
columns => columns
    .AddColumn(x => x.Name ?? "N/A", "Name")
    .AddColumn(x => x.Category?.Name ?? "Uncategorized", "Category")
```