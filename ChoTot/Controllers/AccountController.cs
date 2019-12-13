using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Diagnostics;
using System.Data;
using System.Configuration;
using Newtonsoft.Json;
using System.Web.Security;
using ChoTot.Models;
using ChoTot.App_Code;

namespace ChoTot.Controllers
{
    public class AccountController : Controller
    {
        private string connectionString = Constant.connectionStringDB;
        private DataSet ds = new DataSet();
        private string jsonRs = string.Empty;
        private string storeName = string.Empty;

        // GET: Account
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public JsonResult Login(string username, string password, bool rememberMe)
        {
            Session.Clear();
            ds = ChoTot.Models.User.login(username, password);
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    Session["__USER__"] = jsonRs;

                    //Save cookies
                    try
                    {
                        FormsAuthentication.SetAuthCookie(username, false);

                        if (rememberMe)
                        {
                            HttpCookie userCookie = new HttpCookie("ChoTotUser");
                            userCookie.Values["__USER__"] = jsonRs.ToString().Replace("\r\n", "");
                            userCookie.Expires.AddDays(1);
                            Response.Cookies.Add(userCookie);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
                    }
                    
                }
            }
            return Json(jsonRs, JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public bool Logout()
        {
            FormsAuthentication.SignOut();
            Session.Clear();
            if (Request.Cookies["ChoTotUser"] != null)
            {
                var cookie = new HttpCookie("ChoTotUser");
                cookie.Expires = DateTime.Now.AddDays(-1);
                Response.Cookies.Add(cookie);
            }
            /*string[] myCookies = Request.Cookies.AllKeys;
            foreach (string cookie in myCookies)
            {
                Response.Cookies[cookie].Expires = DateTime.Now.AddDays(-1);
            }*/
            return true;
        }

        #region end code PassWord with SHA1

        public static string encode(string str)
        {
            return FormsAuthentication.HashPasswordForStoringInConfigFile(str, "SHA1");
        }

        #endregion

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public JsonResult Register(User user)
        {
            Session.Clear();
            user.password = encode(user.password);
            ds = user.register();
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult changeUserPassword(int userId, string oldPassword, string newPassword)
        {
            ds = ChoTot.Models.User.changeUserPassword(userId, encode(oldPassword), encode(newPassword));
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }
    }
}