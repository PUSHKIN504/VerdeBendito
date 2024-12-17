using AutoMapper;
using SIGESPROC.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIGESPROC.API.Extensions
{
    public class MappingProfileExtensions : Profile
    {
        public MappingProfileExtensions()
        {
            #region Mapped
            CreateMap <UserEntity, UserEntity>().ReverseMap();
            CreateMap <TokenEntity, TokenEntity>().ReverseMap();
            CreateMap <ProductEntity, ProductEntity>().ReverseMap();
            CreateMap <ClienteEntity, ClienteEntity>().ReverseMap();
            CreateMap <Factura, Factura>().ReverseMap();
            CreateMap <DetalleFactura, DetalleFactura>().ReverseMap();

            #endregion




        }
    }
}
