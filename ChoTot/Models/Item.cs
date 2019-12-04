using System;
using System.Collections.Generic;
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
	    public int price { get; set; }
	    public string category { get; set; }
        public string status { get; set; }
        public int city { get; set; }
        public bool canNegotiate { get; set; }
        public DateTime createdDate { get; set; }
        public int sellerId { get; set; }
        public int buyerId { get; set; }
    }
}