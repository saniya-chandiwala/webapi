using ExamAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ExamAPI.ApiControllers
{
    public class RegisterController : ApiController
    {
        public bool PostForSignUp(UserDetail user) {
            ExamDBEntities db = new ExamDBEntities();

            UserDetail existingUser = db.UserDetails.Where(x => x.UserEmail == user.UserEmail).FirstOrDefault();
            if (existingUser != null)
            {
                return false;
            }
            user.TypeID = 2;
            db.UserDetails.Add(user);
            db.SaveChanges();

            return true;
        }
    }
}
