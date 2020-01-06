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
    public class ApproveController : Controller
    {
        private string connectionString = Constant.connectionStringDB;
        private DataSet ds = new DataSet();
        private string jsonRs = string.Empty;
        private string storeName = string.Empty;

        // GET: Approve
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

        [HttpPost]
        public JsonResult setItemStatus(int[] itemId, string status)
        {
            try
            {
                foreach (int id in itemId)
                {
                    ds = Item.setItemStatus(id, status);
                }
                jsonRs = "{\r\n  \"Table\": [\r\n      {\r\n      \"success\": \"Kiểm duyệt thành công\"}\r\n  ]\r\n}";
                return Json(jsonRs, JsonRequestBehavior.AllowGet);
            } catch(Exception ex)
            {
                jsonRs = "{\r\n  \"Table\": [\r\n      {\r\n      \"error\": \"Kiểm duyệt thất bại\"}\r\n  ]\r\n}";
                return Json(jsonRs, JsonRequestBehavior.AllowGet);
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }

        [HttpPost]
        public JsonResult approveItem(int[] itemId, int[] category)
        {
            try
            {
                for (int i = 0; i < itemId.Length; i++)
                {
                    ds = Item.approveItem(itemId[i], category[i]);
                };
                jsonRs = "{\r\n  \"Table\": [\r\n      {\r\n      \"success\": \"Phê duyệt thành công\"}\r\n  ]\r\n}";
                return Json(jsonRs, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                jsonRs = "{\r\n  \"Table\": [\r\n      {\r\n      \"error\": \"Phê duyệt thất bại\"}\r\n  ]\r\n}";
                return Json(jsonRs, JsonRequestBehavior.AllowGet);
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }
    }
}