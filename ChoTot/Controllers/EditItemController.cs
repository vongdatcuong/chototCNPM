//using ChoTot.App_Code;
//using ChoTot.Models;
//using Newtonsoft.Json;
//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.IO;
//using System.Linq;
//using System.Threading.Tasks;
//using System.Web;
//using System.Web.Mvc;


//namespace ChoTot.Controllers
//{
//    public class EditItemController : Controller
//    {

//        private string connectionString = Constant.connectionStringDB;
//        private DataSet ds = new DataSet();
//        private string jsonRs = string.Empty;
//        private string storeName = string.Empty;

//        // GET: PostItem
//        public ActionResult Index()
//        {
//            HttpCookie cookie = Request.Cookies.Get("ChoTotUser");
//            if (Session["__USER__"] != null && !Session["__USER__"].Equals(""))
//            {
//                ViewBag.gUserStr = Session["__USER__"].ToString().Replace("\r\n", "");
//                ViewBag.isLoggingIn = false;
//            }
//            else if (cookie != null)
//            {
//                ViewBag.gUserStr = cookie["__USER__"].ToString().Replace("\r\n", "");
//                Session["__USER__"] = cookie["__USER__"];
//                ViewBag.isLoggingIn = false;
//            }
//            //Get all categories
//            ds = Utils.getAllParameters();
//            List<City> lstCity = ds.Tables[0].AsEnumerable().Select(
//                            dataRow => new City
//                            {
//                                cityId = dataRow.Field<int>("cityId"),
//                                shortName = dataRow.Field<string>("shortName"),
//                                fullName = dataRow.Field<string>("fullName")
//                            }).ToList();
//            if (lstCity.Count > 0)
//            {
//                lstCity.RemoveAt(0);
//            }
//            ViewBag.selectListCity = new SelectList(lstCity, "cityId", "fullName");

//            List<Category> lstCategory = ds.Tables[1].AsEnumerable().Select(
//                            dataRow => new Category
//                            {
//                                categoryId = dataRow.Field<int>("categoryId"),
//                                shortName = dataRow.Field<string>("shortName"),
//                                fullName = dataRow.Field<string>("fullName")
//                            }).ToList();
//            if (lstCategory.Count > 0)
//            {
//                lstCategory.RemoveAt(0);
//            }
//            ViewBag.selectListCategory = new SelectList(lstCategory, "categoryId", "fullName");
//            return View();
//        }

//        //GET Delete Item
//        [HttpGet]
//        public JsonResult deleteItem(int itemId)
//        {
//            ds = Item.deleteItem(itemId);
//            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
//            return Json(jsonRs, JsonRequestBehavior.AllowGet);
//        }

//        //POST Complete Item
//        [HttpPost]
//        public JsonResult completeItem(int itemId)
//        {
//            ds = Item.completeItem(itemId);
//            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
//            return Json(jsonRs, JsonRequestBehavior.AllowGet);
//        }
//        //Post Upload
//        [HttpPost]
//        public async Task<JsonResult> addItem(Item item, HttpPostedFileBase[] images)
//        {
//            ds = item.addItem();
//            jsonRs = JsonConvert.SerializeObject(ds, Formatting.Indented);
//            int itemId = (int)ds.Tables[0].Rows[0]["itemId"];
//            if (itemId > 0)
//            {
//                string errorImg = "";
//                string thumbnail = "";
//                for (int i = 0; i < images.Length; i++)
//                {
//                    try
//                    {
//                        string extension = Path.GetExtension(images[i].FileName);
//                        string imageName = string.Format(Constant.itemImageNameFormat, itemId, i + 1, extension);
//                        string avatarUrl = await AzureBlobController.UploadImageAsync(images[i], imageName);
//                        if (avatarUrl != null)
//                        {
//                            thumbnail += avatarUrl;
//                            if (i != images.Length)
//                                thumbnail += ", ";
//                        }
//                        else
//                        {
//                            errorImg += i.ToString() + ", ";
//                        }
//                    }
//                    catch (Exception ex)
//                    {
//                        throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
//                    }
//                }
//                if (errorImg.Length >= 2)
//                {
//                    errorImg = errorImg.Substring(0, errorImg.Length - 2);
//                }
//                if (thumbnail.Length > 0)
//                {
//                    thumbnail = thumbnail.Substring(0, thumbnail.Length - 2);
//                    ds = Item.setItemThumbnail(itemId, thumbnail);
//                    jsonRs = "{\r\n  \"Table\": [\r\n      {\r\n      \"itemId\": " + itemId + "}\r\n  ]\r\n}";
//                }
//                else
//                {
//                    jsonRs = "{\r\n  \"Table\": [\r\n      {\r\n      \"error\": \"Upload hình ảnh thất bại ở vị trí" + errorImg + "\"}\r\n  ]\r\n}";

//                }
//            }
//            else
//            {
//                jsonRs = "{\r\n  \"Table\": [\r\n      {\r\n      \"error\": \"Thêm sản phẩm thất bại }\r\n  ]\r\n}";
//            }
//            return Json(jsonRs, JsonRequestBehavior.AllowGet);
//        }
//    }
//}