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
    public class Review
    {
        public int userId { get; set; }
        public int itemId { get; set; }
        public float rating { get; set; }
        public string content { get; set; }
        public DateTime date { get; set; }

        private static string connectionString = Constant.connectionStringDB;
        private static string storeName = string.Empty;

        public static DataSet getAllReview()
        {
            try
            {
                storeName = string.Format("sp_get_all_review");
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

        public static DataSet getReview(int userId, int itemId)
        {
            try
            {
                storeName = string.Format("sp_get_review");
                SqlParameter[] par = new SqlParameter[2];
                par[0] = new SqlParameter("@userId", userId);
                par[1] = new SqlParameter("@itemId", itemId);
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

        public DataSet addReview()
        {
            try
            {
                storeName = string.Format("sp_add_review");
                SqlParameter[] par = new SqlParameter[5];
                par[0] = new SqlParameter("@userId", this.userId);
                par[1] = new SqlParameter("@itemId", this.itemId);
                par[2] = new SqlParameter("@rating", this.rating);
                par[3] = new SqlParameter("@content", this.content);
                par[4] = new SqlParameter("@date", DateTime.Now);

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