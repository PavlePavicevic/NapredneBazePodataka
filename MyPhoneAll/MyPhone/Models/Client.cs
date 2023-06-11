using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MyPhoneAPI.Models;

public class Client : Person
{
    public bool HasCash { get; set; }
}
