using ExamAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ExamAPI.ApiControllers
{
    public class ProductController : ApiController
    {
        public List<Product> GetProducts()
        {
            ExamDBEntities db = new ExamDBEntities();

            List<Product> productList = db.Products.ToList();
            return productList;
        }

        public void PostProduct(Product product)
        {
            ExamDBEntities db = new ExamDBEntities();

            Product existingProduct = db.Products.Where(x => x.ProductName == product.ProductName).FirstOrDefault();

            if (existingProduct != null)
            {
                return false;
            }

            db.Products.Add(product);
            db.SaveChanges(); return true;
        }
    }
}
