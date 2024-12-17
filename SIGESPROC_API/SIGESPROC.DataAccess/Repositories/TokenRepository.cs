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
    public class TokenRepository
    {
        private readonly string filePath;


        public TokenRepository(IConfiguration configuration)
        {
            filePath = configuration["FilePaths:TokenFile"];

            if (!File.Exists(filePath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                File.Create(filePath).Close();
            }
        }
        public void SaveToken(TokenEntity token)
        {
            if (!File.Exists(filePath))
                File.Create(filePath).Close();

            var line = $"Username={token.Username};Token={token.TokenValue};Expiration={token.Expiration}";
            File.AppendAllLines(filePath, new[] { line });
        }

        public TokenEntity GetToken(string tokenValue)
        {
            if (!File.Exists(filePath))
                return null;

            var lines = File.ReadAllLines(filePath);
            foreach (var line in lines)
            {
                var token = ParseLineToToken(line);
                if (token != null && token.TokenValue == tokenValue)
                    return token;
            }

            return null;
        }

        public List<TokenEntity> GetAllTokens()
        {
            var tokens = new List<TokenEntity>();

            if (!File.Exists(filePath))
                return tokens;

            var lines = File.ReadAllLines(filePath);
            foreach (var line in lines)
            {
                var token = ParseLineToToken(line);
                if (token != null)
                    tokens.Add(token);
            }

            return tokens;
        }

        public void DeleteToken(string tokenValue)
        {
            if (!File.Exists(filePath))
                return;

            var tokens = GetAllTokens().Where(t => t.TokenValue != tokenValue).ToList();

            var lines = tokens.Select(t =>
                $"Username={t.Username};Token={t.TokenValue};Expiration={t.Expiration}");
            File.WriteAllLines(filePath, lines);
        }

        private TokenEntity ParseLineToToken(string line)
        {
            var parts = line.Split(';');
            var token = new TokenEntity();

            foreach (var part in parts)
            {
                var keyValue = part.Split('=');
                if (keyValue.Length != 2)
                    continue;

                var key = keyValue[0].Trim();
                var value = keyValue[1].Trim();

                if (key == "Username")
                    token.Username = value;
                else if (key == "Token")
                    token.TokenValue = value;
                else if (key == "Expiration")
                    token.Expiration = DateTime.Parse(value);
            }

            return token;
        }
    }
}

