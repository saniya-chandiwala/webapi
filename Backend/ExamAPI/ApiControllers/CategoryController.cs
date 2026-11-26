using ExamAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ExamAPI.ApiControllers
{
    public class CategoryController : ApiController
    {
        public object GetCategories()
        {
            ExamDBEntities db = new ExamDBEntities();
            var categoryList = db.Categories.Select(x => new { x.CategoryID, x.CategoryName }).ToList();

            return categoryList;
        }
    }
}
