using SIGESPROC.DataAccess.Repositories;
using SIGESPROC.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIGESPROC.BusinessLogic.Services
{
    public class ClienteService
    {
        private readonly ClienteRepository _clienteRepository ;
        public ClienteService(
              ClienteRepository clienteRepository
            )
        {
            _clienteRepository = clienteRepository;
        }

        public ServiceResult GetAllClientes()
        {
            var result = new ServiceResult();
            try
            {
                var clientes = _clienteRepository.GetAllClientes();
                return result.Ok(clientes);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult AddCliente(ClienteEntity cliente)
        {
            var result = new ServiceResult();
            try
            {
                _clienteRepository.AddCliente(cliente);
                return result.Ok("Cliente added successfully.");
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult UpdateCliente(ClienteEntity cliente)
        {
            var result = new ServiceResult();
            try
            {
                _clienteRepository.UpdateCliente(cliente);
                return result.Ok("Cliente updated successfully.");
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult DeleteCliente(int clienteId)
        {
            var result = new ServiceResult();
            try
            {
                _clienteRepository.DeleteCliente(clienteId);
                return result.Ok("Cliente deleted successfully.");
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

    }
}
