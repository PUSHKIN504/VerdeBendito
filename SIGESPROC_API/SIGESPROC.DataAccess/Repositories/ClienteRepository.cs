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
    public class ClienteRepository
    {
        private readonly string filePath;


        public ClienteRepository(IConfiguration configuration)
        {
            filePath = configuration["FilePaths:ClienteFile"];

            if (!File.Exists(filePath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                File.Create(filePath).Close();
            }
        }

        public List<ClienteEntity> GetAllClientes()
        {
            var clientes = new List<ClienteEntity>();

            if (!File.Exists(filePath))
                return clientes;

            var lines = File.ReadAllLines(filePath);
            foreach (var line in lines)
            {
                var cliente = ParseLineToCliente(line);
                if (cliente != null)
                    clientes.Add(cliente);
            }

            return clientes;
        }

        public void AddCliente(ClienteEntity cliente)
        {
            var clientes = GetAllClientes();
            cliente.Id = clientes.Any() ? clientes.Max(c => c.Id) + 1 : 1;

            var line = $"Id={cliente.Id};Nombre={cliente.Nombre};RTN={cliente.RTN};Direccion={cliente.Direccion}";
            File.AppendAllLines(filePath, new[] { line });
        }

        public void UpdateCliente(ClienteEntity updatedCliente)
        {
            var clientes = GetAllClientes();
            var cliente = clientes.FirstOrDefault(c => c.Id == updatedCliente.Id);

            if (cliente != null)
            {
                cliente.Nombre = updatedCliente.Nombre;
                cliente.RTN = updatedCliente.RTN;
                cliente.Direccion = updatedCliente.Direccion;

                var lines = clientes.Select(c =>
                    $"Id={c.Id};Nombre={c.Nombre};RTN={c.RTN};Direccion={c.Direccion}");
                File.WriteAllLines(filePath, lines);
            }
        }

        public void DeleteCliente(int clienteId)
        {
            var clientes = GetAllClientes();
            var updatedClientes = clientes.Where(c => c.Id != clienteId).ToList();

            var lines = updatedClientes.Select(c =>
                $"Id={c.Id};Nombre={c.Nombre};RTN={c.RTN};Direccion={c.Direccion}");
            File.WriteAllLines(filePath, lines);
        }

        private ClienteEntity ParseLineToCliente(string line)
        {
            var parts = line.Split(';');
            var cliente = new ClienteEntity();

            foreach (var part in parts)
            {
                var keyValue = part.Split('=');
                if (keyValue.Length != 2) continue;

                var key = keyValue[0].Trim();
                var value = keyValue[1].Trim();

                if (key == "Id") cliente.Id = int.Parse(value);
                else if (key == "Nombre") cliente.Nombre = value;
                else if (key == "RTN") cliente.RTN = value;
                else if (key == "Direccion") cliente.Direccion = value;
            }

            return cliente;
        }
    }
}
