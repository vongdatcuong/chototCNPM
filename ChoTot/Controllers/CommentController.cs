using Microsoft.ApplicationBlocks.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ChoTot.Controllers
{
    public class CommentController : Controller
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["ChoTotDB"].ConnectionString;
        private DataSet ds = new DataSet();
        private string jsonRs = string.Empty;
        private string storeName = string.Empty;

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public JsonResult getAllComment()
        {
            try
            {
                storeName = string.Format("sp_get_all_comment");
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
    }
}