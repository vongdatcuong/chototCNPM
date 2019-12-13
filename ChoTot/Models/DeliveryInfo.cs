using ChoTot.App_Code;
using Microsoft.ApplicationBlocks.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace ChoTot.Models
{
    public class DeliveryInfo
    {
        public int deliveryId { get; set; }
        public int itemId { get; set; }
        public string receiverName { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string address { get; set; }
        public int city { get; set; }
        public DateTime createdDate { get; set; }

        private static string connectionString = Constant.connectionStringDB;
        private static string storeName = string.Empty;

        public static DataSet getAllDeliveryInfo()
        {
            try
            {
                storeName = string.Format("sp_get_all_deliveryInfo");
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