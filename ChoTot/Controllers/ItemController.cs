﻿using ChoTot.App_Code;
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
    public class ItemController : Controller
    {
        private string connectionString = Constant.connectionStringDB;
        private DataSet ds = new DataSet();
        private string jsonRs = string.Empty;
        private string storeName = string.Empty;

        // GET: Item
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

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public JsonResult getAllItem()
        {
            ds = Item.getAllItem();
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getItem(int itemId)
        {
            ds = Item.getItem(itemId);
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }
    }
}