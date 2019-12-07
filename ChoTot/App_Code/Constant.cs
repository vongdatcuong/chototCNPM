using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace ChoTot.App_Code
{
    public class Constant
    {
        public static string connectionStringDB = ConfigurationManager.ConnectionStrings["ChoTotDB"].ConnectionString;
        public static string connectionStringStorage = ConfigurationManager.ConnectionStrings["ChoTotStorage"].ConnectionString;
        public static string blobContainerName = string.Format("chotot");
        public static string avatarNameFormat = "user_{0}_avatar{1}";
        public static string itemImageNameFormat = "item_{0}_image_{1}{2}";
    }
}