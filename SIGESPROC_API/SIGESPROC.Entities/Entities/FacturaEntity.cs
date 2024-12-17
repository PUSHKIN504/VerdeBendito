using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIGESPROC.Entities.Entities
{
    public class Factura
    {
        public int Id { get; set; }
        public int ClienteId { get; set; } 
        public string ClienteNombre { get; set; } 
        public string TipoFactura { get; set; } 
        public decimal Subtotal { get; set; }
        public decimal ISV => Subtotal * 0.15m;
        public decimal Total => Subtotal + ISV;
        public List<DetalleFactura> Detalles { get; set; }
    }

    public class DetalleFactura
    {
        public int ProductoId { get; set; }
        public string NombreProducto { get; set; }
        public int Cantidad { get; set; }
        public decimal Precio { get; set; }
        public decimal Subtotal => Cantidad * Precio;
    }
}
