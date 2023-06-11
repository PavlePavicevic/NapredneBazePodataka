using MyPhoneAPI.Models;
using MyPhoneAPI.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MyPhoneAPI.Controllers;


[ApiController]
[Route("api/[controller]")]
public class PhoneController : ControllerBase
{
    private readonly PhoneService _phoneService;

    public PhoneController(PhoneService phoneService) =>
        _phoneService = phoneService;

    // Get:

    [HttpGet]
    [Route("GetAllPhones")]
    public async Task<List<Phone>> Get() =>
        await _phoneService.GetAsync();

    [HttpGet]
    [Route("GetPhone/{id:length(24)}")]
    public async Task<IActionResult> Get(string id)
    {
        var phone = await _phoneService.GetAsync(id);

        if (phone is null)
        {
            return NotFound();
        }

        return Ok(phone);
    }

    [HttpGet]
    [Route("FilterPhones")]
    public async Task<IActionResult> Filter(PhoneType? phoneType, decimal? minPrice, decimal? maxPrice, bool? cashOnly)
    {
        var builder = Builders<Phone>.Filter;
        FilterDefinition<Phone> filter = builder.Empty;
        if (phoneType != null)
            filter = filter & builder.Eq(p => p.PhoneType, phoneType);
        if (minPrice != null)
            filter = filter & builder.Gte(p => p.Price, minPrice);
        if (maxPrice != null)
            filter = filter & builder.Lte(p => p.Price, maxPrice);
        if (cashOnly != null)
            filter = filter & builder.Eq(p => p.CashOnly, cashOnly);

        var phones = _phoneService.Collection.Find(filter);
        return Ok(await phones.ToListAsync());
    }

    [HttpGet]
    [Route("Top")]
    public async Task<IActionResult> GetTopProperties()
    {
        var phones = _phoneService.Collection.Find(_ => true).Limit(6);
        return Ok(await phones.ToListAsync());
    }

    // Post:

    [HttpPost]
    [Route("AddPhone")]
    public async Task<IActionResult> Post(Phone newPhone)
    {
        await _phoneService.CreateAsync(newPhone);

        return CreatedAtAction(nameof(Get), new { id = newPhone.Id }, newPhone);

    }

    // Put:

    [HttpPut]
    [Route("EditPhone/{id:length(24)}")]
    public async Task<IActionResult> Update(string id, Phone updatedPhone)
    {
        var phone = await _phoneService.GetAsync(id);
        if (phone is null)
        {
            return NotFound();
        }

        updatedPhone.Id = phone.Id;

        await _phoneService.UpdateAsync(id, updatedPhone);

        return NoContent();
    }

    // Delete:

    [HttpDelete]
    [Route("DeletePhone/{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var phone = await _phoneService.GetAsync(id);
        if (phone is null)
        {
            return NotFound();
        }

        await _phoneService.RemoveAsync(id);

        return NoContent();
    }


}
