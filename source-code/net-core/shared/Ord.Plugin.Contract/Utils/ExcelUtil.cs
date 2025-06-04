﻿using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ord.Plugin.Contract.Utils
{
    public static class ExcelUtil
    {
        public static string GetMergedRangeAddress(this ExcelRange @this)
        {
            if (@this.Merge)
            {
                var idx = @this.Worksheet.GetMergeCellId(@this.Start.Row, @this.Start.Column);
                return @this.Worksheet.MergedCells[idx - 1]; //the array is 0-indexed but the mergeId is 1-indexed...
            }
            else
            {
                return @this.Address;
            }
        }
    }
}
