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
    public class HomeController : Controller
    {
        private DataSet ds = new DataSet();
        private string jsonRs = string.Empty;

        public ActionResult Index(string returnUrl)
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
            else if (returnUrl != null)
            {
                ViewBag.isLoggingIn = true;
                ViewBag.returnUrl = returnUrl;
            }
            else
            {
                ViewBag.isLoggingIn = false;
            }
            return View();
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public JsonResult GetParams()
        {
            Session.Clear();
            ds = Utils.getAllParameters();
            ds.Tables[0].TableName = "City";
            ds.Tables[1].TableName = "Category";
            ds.Tables[2].TableName = "Parameter";
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);

        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public JsonResult getAllItem()
        {
            ds = Item.getAllItem();
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getAllItem_home()
        {
            ds = Item.getAllItem_home();
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }
    }
}