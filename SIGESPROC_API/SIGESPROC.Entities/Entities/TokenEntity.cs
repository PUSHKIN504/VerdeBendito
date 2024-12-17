using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIGESPROC.Entities.Entities
{
    public class TokenEntity
    {
        public string Username { get; set; }
        public string TokenValue { get; set; }
        public DateTime Expiration { get; set; }
    }
}
