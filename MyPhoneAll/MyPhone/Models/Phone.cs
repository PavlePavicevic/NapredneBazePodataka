using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MyPhoneAPI.Models;

public enum PhoneType
{
    Mobile,
    Tablet
}

public class Phone
{

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("Name")]
    public string Name { get; set; }

    public string Description { get; set; }

    public List<String> Photos { get; set; }

    public PhoneType PhoneType { get; set; }

    public decimal Price { get; set; }

    public bool CashOnly { get; set; }

}
