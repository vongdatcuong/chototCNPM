using System;
using System.Collections.Generic;
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
    }
}