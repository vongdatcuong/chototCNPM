using ChoTot.App_Code;
using Microsoft.ApplicationBlocks.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace ChoTot.Models
{
    public class Utils
    {
        private static string connectionString = Constant.connectionStringDB;
        private static string storeName = string.Empty;

        public static DataSet getAllParameters()
        {
            try
            {
                storeName = string.Format("sp_get_all_parameters");
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