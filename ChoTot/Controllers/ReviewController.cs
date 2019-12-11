using ChoTot.App_Code;
using ChoTot.Models;
using Microsoft.ApplicationBlocks.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ChoTot.Controllers
{
    public class ReviewController : Controller
    {
        private string connectionString = Constant.connectionStringDB;
        private DataSet ds = new DataSet();
        private string jsonRs = string.Empty;
        private string storeName = string.Empty;

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public JsonResult getAllReview()
        {
            try
            {
                storeName = string.Format("sp_get_all_review");
                //Execute store
                ds = SqlHelper.ExecuteDataset(connectionString, storeName);

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

        [HttpGet]
        public JsonResult getReview(int userId, int itemId)
        {
            try
            {
                storeName = string.Format("sp_get_review");
                SqlParameter[] par = new SqlParameter[2];
                par[0] = new SqlParameter("@userId", userId);
                par[1] = new SqlParameter("@itemId", itemId);
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

        [HttpPost]
        public JsonResult addReview(Review review)
        {
            try
            {
                storeName = string.Format("sp_add_review");
                SqlParameter[] par = new SqlParameter[5];
                par[0] = new SqlParameter("@userId", review.userId);
                par[1] = new SqlParameter("@itemId", review.itemId);
                par[2] = new SqlParameter("@rating", review.rating);
                par[3] = new SqlParameter("@content", review.content);
                par[4] = new SqlParameter("@date", DateTime.Now);

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