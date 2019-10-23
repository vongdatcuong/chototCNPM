using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ChoTot.Startup))]
namespace ChoTot
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
