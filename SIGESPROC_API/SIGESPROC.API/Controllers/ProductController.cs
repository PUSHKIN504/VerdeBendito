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
    public class ProductController : Controller
    {
        private readonly ProductService _productService;
        private readonly IMapper _mapper;

        public ProductController(ProductService productService, IMapper mapper)
        {

            _productService = productService;
            _mapper = mapper;
        }
        [HttpGet("list")]
        public IActionResult GetAllProducts()
        {
            var result = _productService.GetAllProducts();
            return result.Success ? Ok(result.Data) : BadRequest(result.Message);
        }

        [HttpPost("add")]
        public IActionResult AddProduct([FromBody] ProductEntity product)
        {
            var result = _productService.AddProduct(product);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPut("update")]
        public IActionResult UpdateProduct([FromBody] ProductEntity product)
        {
            var result = _productService.UpdateProduct(product);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var result = _productService.DeleteProduct(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }
    }
}
