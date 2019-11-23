using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChoTot.Models
{
    public class User
    {
        int userId { get; set; }
        string userName { get; set; }
        string firstName { get; set; }
        string lastName { get; set; }
        DateTime birthDate { get; set; }
        string email { get; set; }
        int type { get; set; }
        string address { get; set; }
	    int city { get; set; }
        string phone { get; set; }
        string avatar { get; set; }
        int rating { get; set; }
        DateTime createdDate { get; set; }
    }
}