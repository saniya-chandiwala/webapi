using ExamAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ExamAPI.ApiControllers
{
    public class LoginController : ApiController
    {
        public UserDetail PostForLogin(UserDetail user)
        {
            ExamDBEntities db = new ExamDBEntities();

            UserDetail userFound = db.UserDetails.Where(x => x.UserEmail == user.UserEmail && x.UserPassword == user.UserPassword).FirstOrDefault();
            return userFound;
        }
     }
}
