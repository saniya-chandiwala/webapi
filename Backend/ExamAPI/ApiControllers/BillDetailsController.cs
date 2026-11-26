using ExamAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ExamAPI.ApiControllers
{
    public class BillDetailsController : ApiController
    {
        public List<BillDetail> GetBillDetails(int id)
        {
            ExamDBEntities db = new ExamDBEntities();

            List<BillDetail> detailsList =db.BillDetails.Where(x => x.BillID == id).ToList();
            return detailsList;
        }
    }
}
