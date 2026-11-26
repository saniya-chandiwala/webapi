using ExamAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ExamAPI.ApiControllers
{
    public class BillController : ApiController
    {
        public List<Bill> GetAllBills()
        {
            ExamDBEntities db = new ExamDBEntities();

            List<Bill> billList =db.Bills.OrderByDescending(b => b.BillDate).ToList();
            return billList;
        }

        public List<Bill> GetBills(int id)
        {
            ExamDBEntities db = new ExamDBEntities();

            List<Bill> billList = db.Bills.Where(b => b.UserID == id).OrderByDescending(b => b.BillDate).ToList();
            return billList;
        }

        public bool PostBill(int id)
        {
            ExamDBEntities db = new ExamDBEntities();

            List<Cart> cartList =db.Carts.Where(x => x.UserID == id).ToList();

            if (cartList.Count == 0)
            {
                return false;
            }

            decimal totalBill =cartList.Sum(x =>x.Product.ProductPrice * x.CartQty);

            // Create Bill
            Bill bill = new Bill();

            bill.UserID = id;
            bill.TotalBill = totalBill;
            bill.BillDate = DateTime.Now;
            bill.PaymentMode = "Card";

            db.Bills.Add(bill);
            db.SaveChanges();


            // Create BillDetails and reduce stock
            foreach (Cart item in cartList)
            {
                BillDetail details = new BillDetail();

                details.BillID = bill.BillID;
                details.ProductID = item.ProductID;
                details.Qty = item.CartQty;
                details.TotalAmt =item.Product.ProductPrice * item.CartQty;

                db.BillDetails.Add(details);

                // Reduce stock
                item.Product.ProductQty -= item.CartQty;
            }


            // Clear cart
            db.Carts.RemoveRange(cartList);

            db.SaveChanges();

            return true;
        }
    }
}

