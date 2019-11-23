using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace ChoTot.Controllers
{
    public class HomeController : Controller
    {
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
            }
            else
            {
                ViewBag.isLoggingIn = false;
            }
            return View();
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
    }
}