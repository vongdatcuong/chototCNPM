using System;
using System.Collections.Generic;
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
        public int rating { get; set; }
        public DateTime createdDate { get; set; }
    }
}