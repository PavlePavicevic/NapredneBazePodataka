using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MyPhoneAPI.Models;

public class Seller : Person
{
   public List<string> PhoneIds { get; set; }

}
