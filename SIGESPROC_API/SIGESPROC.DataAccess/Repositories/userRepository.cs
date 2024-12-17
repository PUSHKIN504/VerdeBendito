using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SIGESPROC.Entities.Entities;

namespace SIGESPROC.DataAccess.Repositories
{
    public class userRepository
    {
        private readonly string filePath;


        public userRepository(IConfiguration configuration)
        {
            filePath = configuration["FilePaths:UsersFile"];

            if (!File.Exists(filePath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                File.Create(filePath).Close();
            }
        }
        public bool UpdateUser(int userId, string newUsername, string newPassword)
        {
            if (!File.Exists(filePath))
                return false;

            var users = GetAllUsers();
            var user = users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
                return false;

            if (!string.IsNullOrEmpty(newUsername))
            {
                var usernameExists = users.Any(u => u.Username == newUsername && u.Id != userId);
                if (usernameExists)
                    throw new Exception("El usuario ya existe, cambie el nombre del usuario.");

                user.Username = newUsername;
            }

            if (!string.IsNullOrEmpty(newPassword))
            {
                user.Password = newPassword;
            }

            var lines = users.Select(u =>
                $"Id={u.Id};Username={u.Username};Password={u.Password}");
            File.WriteAllLines(filePath, lines);

            return true;
        }
        public List<UserEntity> GetAllUsers()
        {
            var users = new List<UserEntity>();

            if (!File.Exists(filePath))
                return users;

            var lines = File.ReadAllLines(filePath);
            foreach (var line in lines)
            {
                var user = ParseLineToUser(line);
                if (user != null)
                    users.Add(user);
            }

            return users;
        }


        private UserEntity ParseLineToUser(string line)
        {
            if (string.IsNullOrWhiteSpace(line))
                return null;

            var parts = line.Split(';');
            var user = new UserEntity();

            foreach (var part in parts)
            {
                var keyValue = part.Split('=');
                if (keyValue.Length != 2)
                    continue;

                var key = keyValue[0].Trim();
                var value = keyValue[1].Trim();

                if (key == "Id")
                    user.Id = int.Parse(value);
                else if (key == "Username")
                    user.Username = value;
                else if (key == "Password")
                    user.Password = value;
            }

            return user;
        }

        public RequestStatus AddUser(UserEntity user)
        {
            RequestStatus result = new RequestStatus();
            try
            {
                var existingUsers = GetAllUsers();
                user.Id = existingUsers.Any() ? existingUsers.Max(u => u.Id) + 1 : 1;
                if (existingUsers.Any(u => u.Username == user.Username))
                {
                    result.CodeStatus = 0; 
                    result.Message = "User already exists.";
                    return result;
                }

                var line = $"Id={user.Id};Username={user.Username};Password={user.Password}";
                File.AppendAllLines(filePath, new[] { line });

                result.CodeStatus = 1; 
                result.Message = "User registered successfully.";
                return result;
            }
            catch (Exception ex)
            {
                result.CodeStatus = -1; 
                result.Message = ex.Message;
                return result;
            }
        }

        public UserEntity GetUserByUsername(string username)
        {
            return GetAllUsers().FirstOrDefault(u => u.Username == username);
        }

    }
}
