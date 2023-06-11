namespace Models
{
    public class Post
    {
        public string ID { get; set; }
        public string AuthorID { get; set; }
        public string DestinationID { get; set; }
        public string Text { get; set; }
        public DateTime Time { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
    }
}