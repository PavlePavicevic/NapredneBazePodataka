using MyPhoneAPI.Models;
using MyPhoneAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace MyPhoneAPI.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly SellerService _sellerService;
    private readonly ClientService _clientService;

    public ReviewController(SellerService sellerService, ClientService clientService)
    {
        _sellerService = sellerService;
        _clientService = clientService;

    }

    // Put:

    [HttpPut]
    [Route("AddReviewToSeller/{idSeller:length(24)}/{idClient:length(24)}/{text}/{rating}")]
    public async Task<IActionResult> AddReviewToSeller(string idSeller, string idClient, string text, int rating)
    {
        var seller = await _sellerService.GetAsync(idSeller);
        var client = await _clientService.GetAsync(idClient);
        if (seller is null || client is null)
        {
            return NotFound();
        }



        seller.Reviews.Add(new Review { Text = text, Rating = rating, PersonName = client.Name });
        await _sellerService.UpdateAsync(idSeller, seller);

        return Ok(seller);

    }

    [HttpPut]
    [Route("AddReviewToClient/{idClient:length(24)}/{idSeller:length(24)}/{text}/{rating}")]
    public async Task<IActionResult> AddReviewToClient(string idClient, string idSeller, string text, int rating)
    {
        var seller = await _sellerService.GetAsync(idSeller);
        var client = await _clientService.GetAsync(idClient);
        if (client is null || seller is null)
        {
            return NotFound();
        }



        client.Reviews.Add(new Review { Text = text, Rating = rating, PersonName = seller.Name });
        await _clientService.UpdateAsync(idClient, client);

        return Ok(client);

    }


}
