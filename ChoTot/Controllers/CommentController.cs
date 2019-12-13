using ChoTot.App_Code;
using ChoTot.Models;
using Newtonsoft.Json;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Data;

namespace ChoTot.Controllers
{
    public class CommentController : Controller
    {
        private string connectionString = Constant.connectionStringDB;
        private DataSet ds = new DataSet();
        private string jsonRs = string.Empty;
        private string storeName = string.Empty;

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public JsonResult getAllComment()
        {
            ds = Comment.getAllComment();
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }
    }
}