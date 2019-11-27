using System;
using System.Collections.Generic;
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
    }
}