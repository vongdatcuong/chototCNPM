using ChoTot.App_Code;
using Microsoft.ApplicationBlocks.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ChoTot.Controllers
{
    public class PostItemController : Controller
    {
        private string connectionString = Constant.connectionStringDB;
        private DataSet ds = new DataSet();
        private string jsonRs = string.Empty;
        private string storeName = string.Empty;

        // GET: PostItem
        public ActionResult Index()
        {
            HttpCookie cookie = Request.Cookies.Get("ChoTotUser");
            if (Session["__USER__"] != null && !Session["__USER__"].Equals(""))
            {
                ViewBag.gUserStr = Session["__USER__"].ToString().Replace("\r\n", "");
                ViewBag.isLoggingIn = false;
            }
            else if (cookie != null)
            {
                ViewBag.gUserStr = cookie["__USER__"].ToString().Replace("\r\n", "");
                Session["__USER__"] = cookie["__USER__"];
                ViewBag.isLoggingIn = false;
            }
            return View();
        }

        //GET Delete Item
        [HttpGet]
        public JsonResult deleteItem(int itemId)
        {
            try
            {
                storeName = string.Format("sp_delete_item");
                SqlParameter[] par = new SqlParameter[1];
                par[0] = new SqlParameter("@itemId", itemId);
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
        }

        //POST Complete Item
        [HttpPost]
        public JsonResult completeItem(int itemId)
        {
            try
            {
                storeName = string.Format("sp_complete_item");
                SqlParameter[] par = new SqlParameter[2];
                par[0] = new SqlParameter("@itemId", itemId);
                par[1] = new SqlParameter("@purchaseDate", DateTime.Now);
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
        }
    }
}