using ChoTot.App_Code;
using ChoTot.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace ChoTot.Controllers
{
    public class UserController : Controller
    {
        private DataSet ds = new DataSet();
        private string jsonRs = string.Empty;

        [Authorize]
        // GET: User
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

            //Get all cities
            ds = Utils.getAllParameters();
            List<City> lstCity = ds.Tables[0].AsEnumerable().Select(
                            dataRow => new City
                            {
                                cityId = dataRow.Field<int>("cityId"),
                                shortName = dataRow.Field<string>("shortName"),
                                fullName = dataRow.Field<string>("fullName")
                            }).ToList();
            if (lstCity.Count > 0)
            {
                lstCity.RemoveAt(0);
            }
            ViewBag.selectListCity = new SelectList(lstCity, "cityId", "fullName");
            ViewBag.ratingMin = ds.Tables[2].Rows[0]["ratingMin"];
            ViewBag.ratingMax = ds.Tables[2].Rows[0]["ratingMax"];
            ViewBag.ratingStep = ds.Tables[2].Rows[0]["ratingStep"];
            return View();
        }

        // GET: User
        [HttpGet]
        public ActionResult GetOtherUser(int id)
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
            ds = ChoTot.Models.User.getUser(id);
            ViewBag.userStr = JsonConvert.SerializeObject(ds, Formatting.Indented).ToString().Replace("\r\n", "");
            return View("OtherUser");
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public JsonResult getAllUser()
        {
            ds = ChoTot.Models.User.getAllUser();
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getUser(int userId)
        {
            ds = ChoTot.Models.User.getUser(userId);
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult setUserInfo(User user)
        {
            ds = user.setUserInfo();
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            if (ds.Tables[0].Rows.Count > 0)
            {
                DataRow row = ds.Tables[0].Rows[0];
                Session["__USER__"] = jsonRs;

                //Save cookies
                try
                {
                    FormsAuthentication.SetAuthCookie(user.userName, false);

                    if (Request.Cookies["ChoTotUser"] != null)
                    {
                        HttpCookie userCookie = new HttpCookie("ChoTotUser");
                        userCookie.Values["__USER__"] = jsonRs.ToString().Replace("\r\n", "");
                        userCookie.Expires.AddDays(1);
                        Response.Cookies.Add(userCookie);
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("(Error - Auth Cookie:  )Exception: ", ex);
                }

            }
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<JsonResult> changeUserAvatar(string userName, string userId, HttpPostedFileBase image)
        {
            string imageName = string.Format(Constant.avatarNameFormat, userId, Path.GetExtension(image.FileName).ToLower());
            string avatarUrl = await AzureBlobController.UploadImageAsync(image, imageName);
            if (avatarUrl == null)
            {
                jsonRs = "{\r\n  \"Table\": [\r\n      {\r\n      \"error\": \"Upload hình ảnh thất bại\"}\r\n  ]\r\n}";
            }
            else
            {
                ds = ChoTot.Models.User.setUserAvatar(avatarUrl, userName, userId, image);
                jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    Session["__USER__"] = jsonRs;

                    //Save cookies
                    try
                    {
                        FormsAuthentication.SetAuthCookie(userName, false);

                        if (Request.Cookies["ChoTotUser"] != null)
                        {
                            HttpCookie userCookie = new HttpCookie("ChoTotUser");
                            userCookie.Values["__USER__"] = jsonRs.ToString().Replace("\r\n", "");
                            userCookie.Expires.AddDays(1);
                            Response.Cookies.Add(userCookie);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("(Error - AuthCookie) Exception: ", ex);
                    }

                }
            }
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getUserHistory(int userId)
        {
            ds = ChoTot.Models.User.getUserHistory(userId);
            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }
    }
}