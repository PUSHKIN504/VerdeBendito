using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIGESPROC.Entities.Entities
{
    public class ProductEntity
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public int Existencias { get; set; }
        public decimal Precio { get; set; }
        public decimal Total => Existencias * Precio;
    }
}
