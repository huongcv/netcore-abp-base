namespace Ord.Contract.Dtos.CommonDto
{
    using System;

    public class DateRangeDto
    {
        public bool AutoSetTimeStartEnd { get; set; } = true;

        private DateTime? _startDate;
        public DateTime? StartDate
        {
            get => _startDate;
            set
            {
                if (value.HasValue)
                {
                    _startDate = AutoSetTimeStartEnd ? value.Value.Date : value;
                }
                else
                {
                    _startDate = null;
                }
            }
        }

        private DateTime? _endDate;
        public DateTime? EndDate
        {
            get => _endDate;
            set
            {
                if (value.HasValue)
                {
                    _endDate = AutoSetTimeStartEnd ? value.Value.Date.AddDays(1).AddTicks(-1) : value;
                }
                else
                {
                    _endDate = null;
                }
            }
        }
    }

}
