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
    public class ProductRepository
    {
        private readonly string filePath;


        public ProductRepository(IConfiguration configuration)
        {
            filePath = configuration["FilePaths:ProductFile"];

            if (!File.Exists(filePath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                File.Create(filePath).Close();
            }
        }

        public List<ProductEntity> GetAllProducts()
        {
            var products = new List<ProductEntity>();

            if (!File.Exists(filePath))
                return products;

            var lines = File.ReadAllLines(filePath);
            foreach (var line in lines)
            {
                var product = ParseLineToProduct(line);
                if (product != null)
                    products.Add(product);
            }

            return products;
        }

        public void AddProduct(ProductEntity product)
        {
            var products = GetAllProducts();
            product.Id = products.Any() ? products.Max(p => p.Id) + 1 : 1;

            var line = $"Id={product.Id};Nombre={product.Nombre};Existencias={product.Existencias};Precio={product.Precio};Total={product.Total}";
            File.AppendAllLines(filePath, new[] { line });
        }

        public void UpdateProduct(ProductEntity updatedProduct)
        {
            var products = GetAllProducts();
            var product = products.FirstOrDefault(p => p.Id == updatedProduct.Id);

            if (product != null)
            {
                product.Nombre = updatedProduct.Nombre;
                product.Existencias = updatedProduct.Existencias;
                product.Precio = updatedProduct.Precio;

                // Guardar los cambios
                var lines = products.Select(p =>
                    $"Id={p.Id};Nombre={p.Nombre};Existencias={p.Existencias};Precio={p.Precio};Total={p.Total}");
                File.WriteAllLines(filePath, lines);
            }
        }

        public void DeleteProduct(int productId)
        {
            var products = GetAllProducts();
            var updatedProducts = products.Where(p => p.Id != productId).ToList();

            var lines = updatedProducts.Select(p =>
                $"Id={p.Id};Nombre={p.Nombre};Existencias={p.Existencias};Precio={p.Precio};Total={p.Total}");
            File.WriteAllLines(filePath, lines);
        }

        private ProductEntity ParseLineToProduct(string line)
        {
            var parts = line.Split(';');
            var product = new ProductEntity();

            foreach (var part in parts)
            {
                var keyValue = part.Split('=');
                if (keyValue.Length != 2) continue;

                var key = keyValue[0].Trim();
                var value = keyValue[1].Trim();

                if (key == "Id") product.Id = int.Parse(value);
                else if (key == "Nombre") product.Nombre = value;
                else if (key == "Existencias") product.Existencias = int.Parse(value);
                else if (key == "Precio") product.Precio = decimal.Parse(value);
            }

            return product;
        }

    }
}
