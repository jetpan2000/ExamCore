using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ASPNETCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        [Authorize(AuthenticationSchemes= CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpGet("{id}", Name = "GetTodo")]
        public ActionResult<string> GetById(long id)
        {
            var item = "you want to get ID:" + id;
            if (item == null)
            {
                return NotFound();
            }
            return item;
        }

        [HttpGet]
        [Route("/api/auth/logout")]
        public async Task<ActionResult<string>> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return "logged out";
        }

        //[HttpGet]
        //[Route("/api/manage")]
        //public IActionResult Manage()
        //{
        //    return View();
        //}

        [HttpGet]
        [Route("/api/auth/{username}/{password}")]
        public async Task<ActionResult<string>> Login(string username, string password)
        {
            if (username == "jet" && password == "pan")
            {
                var identity = new ClaimsIdentity(new[] {
                new Claim(ClaimTypes.Name, username) ,
                new Claim(ClaimTypes.Role, "master")}, CookieAuthenticationDefaults.AuthenticationScheme);

                var principal = new ClaimsPrincipal(identity);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

                Redirect("/api/data/3");

                return "logged in";
            }
            else
                return "wrong username/password";
        }
    }
}