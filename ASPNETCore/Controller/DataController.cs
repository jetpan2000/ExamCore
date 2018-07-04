using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ASPNETCore.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
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
        [Route("/api/auth/{username}/{password}")]
        public ActionResult<string> Login(string username, string password)
        {
            if (username == "jet" && password == "pan")
                return "logged in";
            else
                return "wrong username/password";
        }
    }
}