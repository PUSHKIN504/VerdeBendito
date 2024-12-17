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
    public class ClienteController : Controller
    {
        private readonly ClienteService _clienteService;
        private readonly IMapper _mapper;

        public ClienteController(ClienteService clienteService, IMapper mapper)
        {

            _clienteService = clienteService;
            _mapper = mapper;
        }
        [HttpGet("list")]
        public IActionResult GetAllClientes()
        {
            var result = _clienteService.GetAllClientes();
            return result.Success ? Ok(result.Data) : BadRequest(result.Message);
        }

        [HttpPost("add")]
        public IActionResult AddCliente([FromBody] ClienteEntity cliente)
        {
            var result = _clienteService.AddCliente(cliente);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPut("update")]
        public IActionResult UpdateCliente([FromBody] ClienteEntity cliente)
        {
            var result = _clienteService.UpdateCliente(cliente);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteCliente(int id)
        {
            var result = _clienteService.DeleteCliente(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }
    }
}
