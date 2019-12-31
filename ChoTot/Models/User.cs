using ChoTot.App_Code;
using Microsoft.ApplicationBlocks.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web;

namespace ChoTot.Models
{
    public class User
    {
        public int userId { get; set; }
        public string userName { get; set; }
        public  string password { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string gender { get; set; }
        public string birthDate { get; set; }
        public string email { get; set; }
        public int type { get; set; }
        public string address { get; set; }
        public int city { get; set; }
        public string phone { get; set; }
        public string avatar { get; set; }
        public float rating { get; set; }
        public int reviewCount { get; set; }
        public DateTime createdDate { get; set; }

        private static string connectionString = Constant.connectionStringDB;
        private static string storeName = string.Empty;

        public static DataSet login(string username, string password)
        {
            try
            {
                storeName = string.Format("sp_login");
                SqlParameter[] par = new SqlParameter[2];
                par[0] = new SqlParameter("@userName", username);
                par[1] = new SqlParameter("@pass", password);

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

        public DataSet register()
        {
            try
            {
                storeName = string.Format("sp_register");
                SqlParameter[] par = new SqlParameter[5];
                par[0] = new SqlParameter("@userName", this.userName);
                par[1] = new SqlParameter("@password", this.password);
                par[2] = new SqlParameter("@email", this.email);
                par[3] = new SqlParameter("@phone", this.phone);
                par[4] = new SqlParameter("@createdDate", DateTime.Now);
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

        public static DataSet changeUserPassword(int userId, string oldPassword, string newPassword)
        {
            try
            {
                storeName = string.Format("sp_change_user_password");
                SqlParameter[] par = new SqlParameter[3];
                par[0] = new SqlParameter("@userId", userId);
                par[1] = new SqlParameter("@oldPassword", oldPassword);
                par[2] = new SqlParameter("@newPassword", newPassword);

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

        public static DataSet getAllUser()
        {
            try
            {
                storeName = string.Format("sp_get_all_user");
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

        public static DataSet getUser(int userId)
        {
            try
            {
                storeName = string.Format("sp_get_user");
                SqlParameter[] par = new SqlParameter[1];
                par[0] = new SqlParameter("@userId", userId);
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

        public DataSet setUserInfo()
        {
            try
            {
                storeName = string.Format("sp_set_user_info");
                SqlParameter[] par = new SqlParameter[9];
                par[0] = new SqlParameter("@userId", this.userId);
                par[1] = new SqlParameter("@firstName", this.firstName);
                par[2] = new SqlParameter("@lastName", this.lastName);
                par[3] = new SqlParameter("@gender", this.gender);
                par[4] = new SqlParameter("@birthDate", DateTime.ParseExact(this.birthDate, "yyyy/MM/dd", CultureInfo.InvariantCulture));
                par[5] = new SqlParameter("@phone", this.phone);
                par[6] = new SqlParameter("@email", this.email);
                par[7] = new SqlParameter("@address", this.address);
                par[8] = new SqlParameter("@city", this.city);

                //Execute store
                return  SqlHelper.ExecuteDataset(connectionString, storeName, par);

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
        public static DataSet setUserAvatar(string avatarUrl, string userName, string userId, HttpPostedFileBase image)
        {
            try
            {
                storeName = string.Format("sp_set_user_avatar");
                SqlParameter[] par = new SqlParameter[2];
                par[0] = new SqlParameter("@userId", userId);
                par[1] = new SqlParameter("@avatar", avatarUrl);

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

        public static DataSet getUserHistory(int userId)
        {
            try
            {
                storeName = string.Format("sp_get_user_history");
                SqlParameter[] par = new SqlParameter[1];
                par[0] = new SqlParameter("@userId", userId);
                //Execute store
                DataSet ds = SqlHelper.ExecuteDataset(connectionString, storeName, par);

                if (ds.Tables.Count > 1)
                {
                    ds.Tables[0].TableName = "Selling";
                    ds.Tables[1].TableName = "Sold";
                    ds.Tables[2].TableName = "Bought";
                }
                return ds;
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