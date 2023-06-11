using Newtonsoft.Json;

namespace UpFit.Models
{
    public class TrainingSession
    {
        [JsonProperty("id")]
        public int ID { get; set; }
        
        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("day")]
        public int Day { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }
    }
}
