using SIGESPROC.DataAccess.Repositories;
using SIGESPROC.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIGESPROC.BusinessLogic.Services
{
    public class UserService
    {
        private readonly userRepository _userRepository;
        private readonly TokenRepository _tokenRepository;
        public UserService(
              userRepository UserRepository,
              TokenRepository tokenRepository
            )
        {
            _userRepository = UserRepository;
            _tokenRepository = tokenRepository;
        }

        public ServiceResult UpdateUser(int userId, string newUsername, string newPassword)
        {
            var result = new ServiceResult();
            try
            {
                var success = _userRepository.UpdateUser(userId, newUsername, newPassword);
                if (success)
                    return result.Ok("Usuario actualizado con exito.");
                else
                    return result.Error("Usuario no encontrado.");
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
        public ServiceResult Login(string username, string password)
        {
            var result = new ServiceResult();
            try
            {
                var user = _userRepository.GetUserByUsername(username);
                if (user == null || user.Password != password)
                    return result.Error("Invalid credentials.");

                var token = new TokenEntity
                {
                    Username = username,
                    TokenValue = Guid.NewGuid().ToString(),
                    Expiration = DateTime.Now.AddHours(1) 
                };
                _tokenRepository.SaveToken(token);

                return result.Ok(new
                {
                    Token = token.TokenValue,
                    Expiration = token.Expiration
                });
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
        public ServiceResult Logout(string token)
        {
            var result = new ServiceResult();
            try
            {
                _tokenRepository.DeleteToken(token);
                return result.Ok("Logged out successfully.");
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
        public ServiceResult RegisterUser(string username, string password)
        {
            var result = new ServiceResult();
            try
            {
                var user = new UserEntity
                {
                    Username = username,
                    Password = password
                };
                var map = _userRepository.AddUser(user);
                if (map.CodeStatus == 1)
                {
                    return result.Ok(map.Message); 
                }
                else
                {
                    return result.Error(map.Message); 
                }
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message); 
            }
        }

        public ServiceResult ListUsers()
        {
            var result = new ServiceResult();
            try
            {
                var users = _userRepository.GetAllUsers();
                return result.Ok(users);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
    }
}
