using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SIGESPROC.BusinessLogic.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIGESPROC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly UserService _userService;
        private readonly IMapper _mapper;

        public UserController(UserService userService, IMapper mapper)
        {

            _userService = userService;
            _mapper = mapper;
        }

        [HttpPut("update")]
        public IActionResult UpdateUser(int id, string newUsername, string newPassword)
        {
            var result = _userService.UpdateUser(id, newUsername, newPassword);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost("register")]
        public IActionResult Register(string username, string password)
        {
            var result = _userService.RegisterUser(username, password);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("list")]
        public IActionResult ListUsers()
        {
            var result = _userService.ListUsers();
            if (result.Success)
                return Ok(result.Data); 
            else
                return BadRequest(result.Message); 
        }

        [HttpPost("login")]
        public IActionResult Login(string username, string password)
        {
            var result = _userService.Login(username, password);
            if (result.Success)
                return Ok(result.Data); 
            else
                return Unauthorized(result.Message); 
        }
        [HttpPost("logout")]
        public IActionResult Logout(string token)
        {
            var result = _userService.Logout(token);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }
    }
}
