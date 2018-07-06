using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ASPNETMVC.Models;
using ServiceStack.Redis;

namespace ASPNETMVC.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            //var redisClient = new RedisClient("127.0.0.1", 6379);
            //redisClient.Set("Contact_visited_at", DateTime.Now.ToString());

            //var manager = new RedisManagerPool("localhost:6379");
            //using (var client = manager.GetClient())
            //{
            //    client.Set("foo", "bar");
            //    Console.WriteLine("foo={0}", client.Get<string>("foo"));
            //}

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
