﻿using ChoTot.App_Code;
using Microsoft.ApplicationBlocks.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace ChoTot.Models
{
    public class Comment
    {
        public int userId { get; set; }
        public int itemId { get; set; }
        public string content { get; set; }
        public DateTime date { get; set; }

        private static string connectionString = Constant.connectionStringDB;
        private static string storeName = string.Empty;

        public static DataSet getAllComment()
        {
            try
            {
                storeName = string.Format("sp_get_all_comment");
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
    }
}