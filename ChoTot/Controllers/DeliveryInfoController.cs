using ChoTot.App_Code;
using ChoTot.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ChoTot.Controllers
{
    public class DeliveryInfoController : Controller
    {
        private string connectionString = Constant.connectionStringDB;
        private DataSet ds = new DataSet();
        private string jsonRs = string.Empty;
        private string storeName = string.Empty;

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public JsonResult getAllDeliveryInfo()
        {
            ds = DeliveryInfo.getAllDeliveryInfo();
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }
    }
}