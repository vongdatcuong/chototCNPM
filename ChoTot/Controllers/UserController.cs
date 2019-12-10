using ChoTot.App_Code;
using ChoTot.Models;
using Microsoft.ApplicationBlocks.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
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
        private string connectionString = Constant.connectionStringDB;
        private DataSet ds = new DataSet();
        private string jsonRs = string.Empty;
        private string storeName = string.Empty;

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
            try
            {
                storeName = string.Format("sp_get_all_city");
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
            return View();
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public JsonResult getAllUser()
        {
            try
            {
                storeName = string.Format("sp_get_all_user");
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
        public JsonResult getUser(int userId)
        {
            try
            {
                storeName = string.Format("sp_get_user");
                SqlParameter[] par = new SqlParameter[1];
                par[0] = new SqlParameter("@userId", userId);
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
        public JsonResult setUserInfo(User user)
        {
            try
            {
                storeName = string.Format("sp_set_user_info");
                SqlParameter[] par = new SqlParameter[9];
                par[0] = new SqlParameter("@userId", user.userId);
                par[1] = new SqlParameter("@firstName", user.firstName);
                par[2] = new SqlParameter("@lastName", user.lastName);
                par[3] = new SqlParameter("@gender", user.gender);
                par[4] = new SqlParameter("@birthDate", DateTime.ParseExact(user.birthDate, "yyyy/MM/dd", CultureInfo.InvariantCulture));
                par[5] = new SqlParameter("@phone", user.phone);
                par[6] = new SqlParameter("@email", user.email);
                par[7] = new SqlParameter("@address", user.address);
                par[8] = new SqlParameter("@city", user.city);
                
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
                    throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
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
                try
                {
                    storeName = string.Format("sp_set_user_avatar");
                    SqlParameter[] par = new SqlParameter[2];
                    par[0] = new SqlParameter("@userId", userId);
                    par[1] = new SqlParameter("@avatar", avatarUrl);

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
                        throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
                    }

                }
            }
            return Json(jsonRs, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getUserHistory(int userId)
        {
            try
            {
                storeName = string.Format("sp_get_user_history");
                SqlParameter[] par = new SqlParameter[1];
                par[0] = new SqlParameter("@userId", userId);
                //Execute store
                ds = SqlHelper.ExecuteDataset(connectionString, storeName, par);

                if (ds.Tables.Count > 1)
                {
                    ds.Tables[0].TableName = "Selling";
                    ds.Tables[1].TableName = "Sold";
                    ds.Tables[2].TableName = "Bought";
                }

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