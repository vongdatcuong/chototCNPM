using System.Web;
using System.Web.Optimization;

namespace ChoTot
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/constants").Include(
                      "~/Scripts/constant.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/home.css",
                      "~/Content/user.css",
                      "~/Content/item.css",
                      "~/Content/post-item.css",
                      "~/Content/approve.css",
                      "~/Content/responsive.css"));

            bundles.Add(new ScriptBundle("~/bundles/homeScripts").Include(
                      "~/Scripts/Home/home.js"));

            bundles.Add(new ScriptBundle("~/bundles/userScripts").Include(
                      "~/Scripts/User/user.js"));

            bundles.Add(new ScriptBundle("~/bundles/itemScripts").Include(
                      "~/Scripts/Item/item.js"));

            bundles.Add(new ScriptBundle("~/bundles/postItemScripts").Include(
                      "~/Scripts/PostItem/post-item.js"));

            bundles.Add(new ScriptBundle("~/bundles/approveScripts").Include(
                      "~/Scripts/Approve/approve.js"));
        }
    }
}
