using Microsoft.Extensions.Configuration;
using SIGESPROC.Entities.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIGESPROC.DataAccess.Repositories
{
    public class FacturaRepository
    {
        private readonly string filePath;


        public FacturaRepository(IConfiguration configuration)
        {
            filePath = configuration["FilePaths:FacturaFile"];

            if (!File.Exists(filePath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                File.Create(filePath).Close();
            }
        }

        public List<Factura> GetAllFacturas()
        {
            var facturas = new List<Factura>();

            if (!File.Exists(filePath))
                return facturas;

            var lines = File.ReadAllLines(filePath);
            foreach (var line in lines)
            {
                var factura = ParseLineToFactura(line);
                if (factura != null)
                    facturas.Add(factura);
            }

            return facturas;
        }

        public void AddFactura(Factura factura)
        {
            if (!File.Exists(filePath))
                File.Create(filePath).Close();

            var facturas = GetAllFacturas();
            factura.Id = facturas.Any() ? facturas.Max(f => f.Id) + 1 : 1;

            var detalles = string.Join("|", factura.Detalles.Select(d =>
                $"ProductoId={d.ProductoId},NombreProducto={d.NombreProducto},Cantidad={d.Cantidad},Precio={d.Precio},Subtotal={d.Subtotal}"));

            var line = $"Id={factura.Id};ClienteId={factura.ClienteId};ClienteNombre={factura.ClienteNombre};TipoFactura={factura.TipoFactura};Subtotal={factura.Subtotal};Detalles={detalles}";
            File.AppendAllLines(filePath, new[] { line });
        }

        private Factura ParseLineToFactura(string line)
        {
            var parts = line.Split(';');
            var factura = new Factura
            {
                Detalles = new List<DetalleFactura>() 
            };

            foreach (var part in parts)
            {
                var keyValue = part.Split(new[] { '=' }, 2); 
                if (keyValue.Length != 2) continue;

                var key = keyValue[0].Trim();
                var value = keyValue[1].Trim();

                if (key == "Id") factura.Id = int.Parse(value);
                else if (key == "ClienteId") factura.ClienteId = int.Parse(value);
                else if (key == "ClienteNombre") factura.ClienteNombre = value;
                else if (key == "TipoFactura") factura.TipoFactura = value;
                else if (key == "Subtotal") factura.Subtotal = decimal.Parse(value);
                else if (key == "Detalles")
                {
                    var detallesPart = value.Split('|');
                    foreach (var detalleBlock in detallesPart)
                    {
                        var detalle = new DetalleFactura();
                        var detalleFields = detalleBlock.Split(',');

                        foreach (var field in detalleFields)
                        {
                            var fieldKeyValue = field.Split('=');
                            if (fieldKeyValue.Length != 2) continue;

                            var fieldKey = fieldKeyValue[0].Trim();
                            var fieldValue = fieldKeyValue[1].Trim();

                            if (fieldKey == "ProductoId") detalle.ProductoId = int.Parse(fieldValue);
                            else if (fieldKey == "NombreProducto") detalle.NombreProducto = fieldValue;
                            else if (fieldKey == "Cantidad") detalle.Cantidad = int.Parse(fieldValue);
                            else if (fieldKey == "Precio") detalle.Precio = decimal.Parse(fieldValue);
                        }

                        factura.Detalles.Add(detalle); 
                    }
                }
            }

            return factura;
        }

    }
}
