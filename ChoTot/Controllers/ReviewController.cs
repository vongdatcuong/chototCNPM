using ChoTot.App_Code;
using ChoTot.Models;
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
            ds = Review.getAllReview();
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getReview(int userId, int itemId)
        {
            ds = Review.getReview(userId, itemId);
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult addReview(Review review)
        {
            ds = review.addReview();
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }
    }
}