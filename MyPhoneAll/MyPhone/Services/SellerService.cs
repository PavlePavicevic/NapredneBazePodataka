using MyPhoneAPI.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace MyPhoneAPI.Services;

public class SellerService
{
    private readonly IMongoCollection<Seller> _sellerCollection;

    public SellerService(IOptions<MyPhoneDatabaseSettings> estateDatabaseSettings)
    {
        var mongoClient = new MongoClient(estateDatabaseSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(estateDatabaseSettings.Value.DatabaseName);

        _sellerCollection = mongoDatabase.GetCollection<Seller>(
            estateDatabaseSettings.Value.SellersCollectionName);
    }

    public async Task<List<Seller>> GetAsync() =>
       await _sellerCollection.Find(_ => true).ToListAsync();

    public async Task<Seller> GetAsync(string id) =>
        await _sellerCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Seller newSeller) =>
        await _sellerCollection.InsertOneAsync(newSeller);

    public async Task UpdateAsync(string id, Seller updatedSeller) =>
        await _sellerCollection.ReplaceOneAsync(x => x.Id == id, updatedSeller);

    public async Task RemoveAsync(string id) =>
        await _sellerCollection.DeleteOneAsync(x => x.Id == id);

}
