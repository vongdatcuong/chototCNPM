using ChoTot.App_Code;
using Microsoft.ApplicationBlocks.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ChoTot.Models
{
    public class Item
    {
        public int itemId { get; set; }
        public string name { get; set; }
	    public string description { get; set; }
	    public string thumbnail { get; set; }
	    public long price { get; set; }
	    public string category { get; set; }
        public string status { get; set; }
        public string address { get; set; }
        public int city { get; set; }
        public bool canNegotiate { get; set; }
        public DateTime createdDate { get; set; }
        public int sellerId { get; set; }
        public int buyerId { get; set; }
        public DateTime purchaseDate { get; set; }

        private static string connectionString = Constant.connectionStringDB;
        private static string storeName = string.Empty;

        public static DataSet getAllItem()
        {
            try
            {
                storeName = string.Format("sp_get_all_item");
                //Execute store
                return SqlHelper.ExecuteDataset(connectionString, storeName);

            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }

        public static DataSet getAllPendingItem()
        {
            try
            {
                storeName = string.Format("sp_get_all_pending_item");
                //Execute store
                return SqlHelper.ExecuteDataset(connectionString, storeName);

            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }

        public static DataSet getItem(int? itemId)
        {
            try
            {
                storeName = string.Format("sp_get_item");
                SqlParameter[] par = new SqlParameter[1];
                par[0] = new SqlParameter("@itemId", itemId);
                //Execute store
                return SqlHelper.ExecuteDataset(connectionString, storeName, par);

            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }

        public static DataSet getItemAndSeller(int? itemId)
        {
            try
            {
                storeName = string.Format("sp_get_item_and_seller");
                SqlParameter[] par = new SqlParameter[1];
                par[0] = new SqlParameter("@itemId", itemId);
                //Execute store
                return SqlHelper.ExecuteDataset(connectionString, storeName, par);

            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }

        public static DataSet deleteItem(int itemId)
        {
            try
            {
                storeName = string.Format("sp_delete_item");
                SqlParameter[] par = new SqlParameter[1];
                par[0] = new SqlParameter("@itemId", itemId);
                //Execute store
                return SqlHelper.ExecuteDataset(connectionString, storeName, par);

            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }

        public static DataSet completeItem(int itemId)
        {
            try
            {
                storeName = string.Format("sp_complete_item");
                SqlParameter[] par = new SqlParameter[2];
                par[0] = new SqlParameter("@itemId", itemId);
                par[1] = new SqlParameter("@purchaseDate", DateTime.Now);
                //Execute store
                return SqlHelper.ExecuteDataset(connectionString, storeName, par);

            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }

        public DataSet addItem()
        {
            try
            {
                storeName = string.Format("sp_add_item");
                SqlParameter[] par = new SqlParameter[9];
                par[0] = new SqlParameter("@name", this.name);
                par[1] = new SqlParameter("@description", this.description);
                par[2] = new SqlParameter("@price", this.price);
                par[3] = new SqlParameter("@category", this.category);
                par[4] = new SqlParameter("@address", this.address);
                par[5] = new SqlParameter("@city", this.city);
                par[6] = new SqlParameter("@canNegotiate", this.canNegotiate);
                par[7] = new SqlParameter("@createdDate", DateTime.Now);
                par[8] = new SqlParameter("@sellerId", this.sellerId);

                //Execute store
                return SqlHelper.ExecuteDataset(connectionString, storeName, par);

            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }

        public static DataSet setItemThumbnail(int itemId, string thumbnail)
        {
            try
            {
                storeName = string.Format("sp_set_item_thumbnail");
                SqlParameter[] par = new SqlParameter[2];
                par[0] = new SqlParameter("@itemId", itemId);
                par[1] = new SqlParameter("@thumbnail", thumbnail);
                //Execute store
                return SqlHelper.ExecuteDataset(connectionString, storeName, par);

            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }

        public static DataSet setItemStatus(int itemId, string status)
        {
            try
            {
                storeName = string.Format("sp_change_item_status");
                SqlParameter[] par = new SqlParameter[2];
                par[0] = new SqlParameter("@itemId", itemId);
                par[1] = new SqlParameter("@status", status);
                //Execute store
                return SqlHelper.ExecuteDataset(connectionString, storeName, par);

            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }

        public static DataSet approveItem(int itemId, int category)
        {
            try
            {
                storeName = string.Format("sp_approve_item");
                SqlParameter[] par = new SqlParameter[2];
                par[0] = new SqlParameter("@itemId", itemId);
                par[1] = new SqlParameter("@category", category);
                //Execute store
                return SqlHelper.ExecuteDataset(connectionString, storeName, par);

            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }

        public static DataSet searchItem(string keyword)
        {
            try
            {
                storeName = string.Format("sp_search_item");
                SqlParameter[] par = new SqlParameter[1];
                par[0] = new SqlParameter("@keyword", keyword);
                //Execute store
                return SqlHelper.ExecuteDataset(connectionString, storeName, par);
            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }

        public static DataSet getAllItem_home(string priceOrder, int? category, int? city)

        {
            try
            {
                storeName = string.Format("sp_get_filtered_item");
                SqlParameter[] par = new SqlParameter[3];
                par[0] = new SqlParameter("@priceOrder", priceOrder);
                par[1] = new SqlParameter("@category", category);
                par[2] = new SqlParameter("@city", city);
                //Execute store

                return SqlHelper.ExecuteDataset(connectionString, storeName, par);




            }
            catch (TimeoutException timeoutex)
            {
                throw new TimeoutException("(Error - store: " + storeName + ") TimeoutException: ", timeoutex);
            }
            catch (Exception ex)
            {
                throw new Exception("(Error - store:  " + storeName + ")Exception: ", ex);
            }
        }
    }
}