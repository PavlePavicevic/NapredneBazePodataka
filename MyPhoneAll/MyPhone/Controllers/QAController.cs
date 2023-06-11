using MyPhoneAPI.Models;
using MyPhoneAPI.Services;
using global::MyPhoneAPI.Models;
using global::MyPhoneAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace MyPhoneAPI.Controllers;


[ApiController]
[Route("api/[controller]")]
public class QAController : ControllerBase
{
    private readonly PhoneService _phoneService;

    public QAController(PhoneService phoneService)
    {
        _phoneService = phoneService;
    }

    // Post:

   /* [HttpPost]
    [Route("Ask/{idPhone:length(24)}/{question}")]
    public async Task<IActionResult> AddReviewToSeller(string idPhone, string question)
    {
        var property = await _phoneService.GetAsync(idPhone);
        if (property is null)
        {
            return NotFound();
        }

        property.QAs.Add(new QA { Question = question, Answer = null});

        await _phoneService.UpdateAsync(idPhone, property);

        return Ok(property);

    }*/

    // Put:

    /*[HttpPut]
    [Route("Answer/{idProperty:length(24)}/{answer}/{questionIndex}")]
    public async Task<IActionResult> AddReviewToClient(string idPhone, string answer, int questionIndex)
    {
        var phone = await _phoneService.GetAsync(idPhone);
        if (phone is null)
        {
            return NotFound();
        }

        phone.QAs[questionIndex].Answer = answer;
        await _phoneService.UpdateAsync(idPhone, phone);

        return Ok(phone);
    }*/


}
