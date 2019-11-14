using System;
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
        public JsonResult Login(string username, string password, bool keepIn)
        {
            try
            {
                storeName = string.Format("sp_login");
                SqlParameter[] par = new SqlParameter[2];
                par[0] = new SqlParameter("@username", username);
                par[1] = new SqlParameter("@password", password);
                //int test = SqlHelper.CommandTimeOut;

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
            return Json(jsonRs, JsonRequestBehavior.AllowGet);

            if (username.Equals("admin") && password.Equals("123"))
            {
                Session["username"] = username;
                return Json(new { username = username});
            }
            else
            {
                return Json(new {});
            }

        }
    }
}