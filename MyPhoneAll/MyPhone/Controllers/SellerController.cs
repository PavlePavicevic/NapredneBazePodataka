using MyPhoneAPI.Models;
using MyPhoneAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace MyPhoneAPI.Controllers;


[ApiController]
[Route("api/[controller]")]
public class SellerController : ControllerBase
{
    private readonly SellerService _sellerService;
    private readonly PhoneService _phoneService;

    public SellerController(SellerService sellerService, PhoneService phoneService)
    {
        _sellerService = sellerService;
        _phoneService = phoneService;

    }

    // Get:

    [HttpGet]
    [Route("GetAllSellers")]
    public async Task<List<Seller>> Get() =>
        await _sellerService.GetAsync();

    [HttpGet]
    [Route("GetSeller/{id:length(24)}")]
    public async Task<IActionResult> Get(string id)
    {
        var Seller = await _sellerService.GetAsync(id);

        if (Seller is null)
        {
            return NotFound();
        }

        return Ok(Seller);
    }

    // Post:

    [HttpPost]
    [Route("AddSeller")]
    public async Task<IActionResult> Post(Seller newSeller)
    {
        await _sellerService.CreateAsync(newSeller);

        return CreatedAtAction(nameof(Get), new { id = newSeller.Id }, newSeller);

    }

    // Put:

    [HttpPut]
    [Route("EditSeller/{id:length(24)}")]
    public async Task<IActionResult> Update(string id, Seller updatedSeller)
    {
        var seller = await _sellerService.GetAsync(id);
        if (seller is null)
        {
            return NotFound();
        }

        updatedSeller.Id = seller.Id;

        await _sellerService.UpdateAsync(id, updatedSeller);

        return NoContent();
    }

    [HttpPut]
    [Route("AddPhoneToSeller/{idPhone:length(24)}/{idSeller:length(24)}")]
    public async Task<IActionResult> AddPhoneToSeller(string idPhone, string idSeller)
    {
        var seller = await _sellerService.GetAsync(idSeller);
        var phone = await _phoneService.GetAsync(idPhone);
        if (seller is null || phone is null)
        {
            return NotFound();
        }

        seller.PhoneIds.Add(idPhone);
        await _sellerService.UpdateAsync(idSeller, seller);

        return Ok(seller);

    }

    // Delete:

    [HttpDelete]
    [Route("DeleteSeller/{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var seller = await _sellerService.GetAsync(id);
        if (seller is null)
        {
            return NotFound();
        }

        await _sellerService.RemoveAsync(id);

        return NoContent();
    }


}
