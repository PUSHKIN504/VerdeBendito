using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIGESPROC.DataAccess
{
    public class RequestStatus
    {
        public int CodeStatus { get; set; }
        public string MessageStatus { get; set; }
        public string Message { get; internal set; }
        public bool Success { get; set; }
    }
}
