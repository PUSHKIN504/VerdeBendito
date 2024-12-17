using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SIGESPROC.BusinessLogic.Services;
using SIGESPROC.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIGESPROC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FacturaController : Controller
    {
        private readonly FacturaService _facturaService;
        private readonly IMapper _mapper;

        public FacturaController(FacturaService facturaService, IMapper mapper)
        {

            _facturaService = facturaService;
            _mapper = mapper;
        }
        [HttpPost("generate")]
        public IActionResult GenerateFactura([FromBody] Factura factura)
        {
            var result = _facturaService.AddFactura(factura);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("list")]
        public IActionResult GetFacturas()
        {
            var result = _facturaService.GetAllFacturas();
            return result.Success ? Ok(result.Data) : BadRequest(result.Message);
        }
    }
}
