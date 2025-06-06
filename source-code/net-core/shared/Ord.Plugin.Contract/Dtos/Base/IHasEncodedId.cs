using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ord.Plugin.Contract.Dtos
{
    public interface IHasEncodedId
    {
        public string EncodedId { get; set; }
    }
}
