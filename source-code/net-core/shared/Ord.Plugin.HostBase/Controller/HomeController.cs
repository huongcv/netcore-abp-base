using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Volo.Abp.AspNetCore.Mvc;

namespace OrdWebApp.Controllers;

public class HomeController : AbpController
{
    private readonly IWebHostEnvironment _hostingEnvironment;

    public HomeController(IWebHostEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
    }
#if DEBUG
    [Authorize]
    public IActionResult Index()
    {
        if (_hostingEnvironment.IsDevelopment())
        {
            return Redirect("/api-doc");
        }
        return Ok("api");
    }
#else
 public string Index()
    {
       return "ok";
    }
#endif


}
