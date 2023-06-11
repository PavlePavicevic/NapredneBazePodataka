using MyPhoneAPI.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace MyPhoneAPI.Services;

public class PhoneService
{
    private readonly IMongoCollection<Phone> _phoneCollection;

    public PhoneService(IOptions<MyPhoneDatabaseSettings> estateDatabaseSettings)
    {
        var mongoClient = new MongoClient(estateDatabaseSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(estateDatabaseSettings.Value.DatabaseName);

        _phoneCollection = mongoDatabase.GetCollection<Phone>(
            estateDatabaseSettings.Value.PhonesCollectionName);
    }

    public IMongoCollection<Phone> Collection { get { return _phoneCollection; } }

    public async Task<List<Phone>> GetAsync() =>
       await _phoneCollection.Find(_ => true).ToListAsync();

    public async Task<Phone> GetAsync(string id) =>
        await _phoneCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Phone newPhone) =>
        await _phoneCollection.InsertOneAsync(newPhone);

    public async Task UpdateAsync(string id, Phone updatedPhone) =>
        await _phoneCollection.ReplaceOneAsync(x => x.Id == id, updatedPhone);

    public async Task RemoveAsync(string id) =>
        await _phoneCollection.DeleteOneAsync(x => x.Id == id);

}
