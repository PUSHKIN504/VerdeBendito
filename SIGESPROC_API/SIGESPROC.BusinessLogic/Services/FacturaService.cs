using SIGESPROC.DataAccess.Repositories;
using SIGESPROC.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIGESPROC.BusinessLogic.Services
{
    public class FacturaService
    {
        private readonly FacturaRepository _facturaRepository;
        private readonly ProductRepository _productRepository;
        private readonly ClienteRepository _clienteRepository;

        public FacturaService(FacturaRepository facturaRepo, ProductRepository productRepo, ClienteRepository clienteRepo)
        {
            _facturaRepository = facturaRepo;
            _productRepository = productRepo;
            _clienteRepository = clienteRepo;
        }

        public ServiceResult AddFactura(Factura factura)
        {
            var result = new ServiceResult();
            try
            {
                var cliente = _clienteRepository.GetAllClientes().Find(c => c.Id == factura.ClienteId);
                if (cliente == null)
                    return result.Error("Invalid Cliente ID. The client does not exist.");

                factura.ClienteNombre = cliente.Nombre;

                var productos = _productRepository.GetAllProducts();

                foreach (var detalle in factura.Detalles)
                {
                    var producto = productos.Find(p => p.Id == detalle.ProductoId);
                    if (producto == null || producto.Existencias < detalle.Cantidad)
                        return result.Error($"Not enough stock for product {detalle.NombreProducto}.");

                    producto.Existencias -= detalle.Cantidad;
                    _productRepository.UpdateProduct(producto);
                }

                factura.Subtotal = factura.Detalles.Sum(d => d.Subtotal);

                _facturaRepository.AddFactura(factura);

                return result.Ok("Factura generated successfully.");
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
        public ServiceResult GetAllFacturas()
        {
            var result = new ServiceResult();
            try
            {
                var facturas = _facturaRepository.GetAllFacturas();
                return result.Ok(facturas);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
    }
}
