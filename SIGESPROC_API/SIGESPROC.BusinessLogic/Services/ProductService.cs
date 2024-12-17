using SIGESPROC.DataAccess.Repositories;
using SIGESPROC.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIGESPROC.BusinessLogic.Services
{
    public class ProductService
    {
        private readonly ProductRepository _productRepository;
        public ProductService(
              ProductRepository productRepository
            )
        {
            _productRepository = productRepository;
        }

        public ServiceResult GetAllProducts()
        {
            var result = new ServiceResult();
            try
            {
                var products = _productRepository.GetAllProducts();
                return result.Ok(products);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult AddProduct(ProductEntity product)
        {
            var result = new ServiceResult();
            try
            {
                _productRepository.AddProduct(product);
                return result.Ok("Product added successfully.");
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult UpdateProduct(ProductEntity product)
        {
            var result = new ServiceResult();
            try
            {
                _productRepository.UpdateProduct(product);
                return result.Ok("Product updated successfully.");
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        public ServiceResult DeleteProduct(int productId)
        {
            var result = new ServiceResult();
            try
            {
                _productRepository.DeleteProduct(productId);
                return result.Ok("Product deleted successfully.");
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

    }
}
