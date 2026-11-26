using ExamAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ExamAPI.ApiControllers
{
    public class UserController : ApiController
    {
        public List<UserDetail> GetUsers()
        {
            ExamDBEntities db = new ExamDBEntities();

            List<UserDetail> userList = db.UserDetails.ToList();    
            return userList;
        }

        public UserDetail GetUserByID(int id)
        {
            ExamDBEntities db = new ExamDBEntities();

            UserDetail user = db.UserDetails.FirstOrDefault(u => u.UserID == id);
            return user;
        }

        public void PostUser(UserDetail user)
        {
            ExamDBEntities db = new ExamDBEntities();
            db.UserDetails.Add(user);
            db.SaveChanges();
        }
    }
}
