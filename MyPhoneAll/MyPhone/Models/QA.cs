using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MyPhoneAPI.Models;

public class QA
{

    [BsonElement("Question")]
    public string Question { get; set; }

    [BsonElement("Answer")]
    public string Answer { get; set; }

}
