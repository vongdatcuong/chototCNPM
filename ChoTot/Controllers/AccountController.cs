﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Diagnostics;
using System.Data;
using System.Data.SqlClient;
using Microsoft.ApplicationBlocks.Data;
using System.Configuration;
using Newtonsoft.Json;
using System.Web.Security;
using ChoTot.Models;

namespace ChoTot.Controllers
{
    public class AccountController : Controller
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["ChoTotDB"].ConnectionString;
        private DataSet ds = new DataSet();
        private string jsonRs = string.Empty;
        private string storeName = string.Empty;

        // GET: Account
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public JsonResult Login(string username, string password, bool rememberMe)
        {
            Session.Clear();
            try
            {
                storeName = string.Format("sp_login");
                SqlParameter[] par = new SqlParameter[2];
                par[0] = new SqlParameter("@username", username);
                par[1] = new SqlParameter("@pass", endcode(password));

                //Execute store
                ds = SqlHelper.ExecuteDataset(connectionString, storeName, par);

            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
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

        public ActionResult Logout(string currentUrl)
        {
            FormsAuthentication.SignOut();
            Session.Clear();
            string[] myCookies = Request.Cookies.AllKeys;
            foreach (string cookie in myCookies)
            {
                Response.Cookies[cookie].Expires = DateTime.Now.AddDays(-1);
            }
            return View("currentUrl");
        }
        #region end code PassWord with SHA1

        public static string endcode(string str)
        {
            return FormsAuthentication.HashPasswordForStoringInConfigFile(str, "SHA1");
        }

        #endregion
    }
}