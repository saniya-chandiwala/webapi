using ExamAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ExamAPI.ApiControllers
{
    public class CartController : ApiController
    {
        public List<Cart> GetCart(int id)
        {
            ExamDBEntities db = new ExamDBEntities();

            List<Cart> cartList = db.Carts.Where(c => c.UserID == id).ToList();
            return cartList;
        }

        public bool PostCart(Cart cart)
        {
            ExamDBEntities db = new ExamDBEntities();

            Product product = db.Products.FirstOrDefault(p => p.ProductID == cart.ProductID);

            if (product == null)
            {
                return false;
            }

            if (product.ProductQty <= 0)
            {
                return false;
            }

            Cart existingCart = db.Carts.FirstOrDefault(c => c.UserID == cart.UserID && c.ProductID == cart.ProductID);

            if (existingCart != null)
            {
                if (existingCart.CartQty + cart.CartQty > product.ProductQty)
                {
                    return false;
                }

                existingCart.CartQty += cart.CartQty;
            }
            else
            {
                if (cart.CartQty > product.ProductQty)
                {
                    return false;
                }

                db.Carts.Add(cart);
            }

            db.SaveChanges();

            return true;
        }

        public bool PutCart(Cart cart)
        {
            ExamDBEntities db = new ExamDBEntities();

            Cart existingCart = db.Carts.FirstOrDefault(c => c.CartID == cart.CartID);

            if (existingCart == null)
            {
                return false;
            }

            Product product =db.Products.FirstOrDefault(p =>p.ProductID == existingCart.ProductID);

            if (product == null)
            {
                return false;
            }

            if (cart.CartQty <= 0)
            {
                return false;
            }

            if (cart.CartQty > product.ProductQty)
            {
                return false;
            }

            existingCart.CartQty = cart.CartQty;

            db.SaveChanges();

            return true;
        }

        public void DeleteCart(int id)
        {
            ExamDBEntities db = new ExamDBEntities();

            Cart cart = db.Carts.FirstOrDefault(c => c.CartID == id);

            if (cart != null)
            {
                db.Carts.Remove(cart);
                db.SaveChanges();
            }
        }
    }
}
