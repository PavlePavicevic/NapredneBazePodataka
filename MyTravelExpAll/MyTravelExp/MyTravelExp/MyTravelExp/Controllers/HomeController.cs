using Microsoft.AspNetCore.Mvc;
using ServiceStack.Redis;
using Models;
using System.Text.Json;
using System.ComponentModel.Design;

namespace MyTravelExp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : Controller
    {
        readonly RedisClient redis = new("redis://default:redispw@localhost:49153");
        public HomeController()
        {
            if (redis.Get<object>("next:post:id") == null)
                redis.Set("next:post:id", 1);
            if (redis.Get<object>("next:person:id") == null)
                redis.Set("next:person:id", 1);
            if (redis.Get<object>("next:chat:id") == null)
                redis.Set("next:chat:id", 1);
            if (redis.Get<object>("next:destination:id") == null)
                redis.Set("next:destination:id", 1);
            if (redis.Get<object>("next:comment:id") == null)
                redis.Set("next:comment:id", 1);
        }

        private string GetNextPostID()
        {
            long nextCounterKey = redis.Incr("next:post:id");
            return nextCounterKey.ToString("x");
        }

        private string GetNextPersonID()
        {
            long nextCounterKey = redis.Incr("next:person:id");
            return nextCounterKey.ToString("x");
        }

        private string GetNextChatID()
        {
            long nextCounterKey = redis.Incr("next:chat:id");
            return nextCounterKey.ToString("x");
        }

        private string GetNextDestinationID()
        {
            long nextCounterKey = redis.Incr("next:destination:id");
            return nextCounterKey.ToString("x");
        }

        private string GetNextCommentID()
        {
            long nextCounterKey = redis.Incr("next:comment:id");
            return nextCounterKey.ToString("x");
        }

        [HttpPost]
        [Route("CreateDestination/{name}")]
        public IActionResult CreateDestination(string name)
        {
            string id = GetNextDestinationID();
            redis.Set("destination:" + id + ":name", name);
            redis.AddItemToSet("destinations:all", id);
            return Ok(new { id });
        }

        [HttpPost]
        [Route("CreatePost/{text}/{authorID}/{destinationID}")]
        public IActionResult CreatePost(string text, string authorID, string destinationID)
        {
            string id = GetNextPostID();
            var post = new Post
            {
                ID = id,
                Text = text,
                Time = DateTime.Now,
                AuthorID = authorID,
                Likes = 0,
                Dislikes = 0,
                DestinationID = destinationID
            };
            redis.PushItemToList("destination:" + destinationID + ":posts", id);
            redis.AddItemToSortedSet("destination:" + destinationID + ":postssorted", id, 0);
            redis.PushItemToList("person:" + authorID + ":posts", id);
            redis.Set("post:" + id + ":post", post);
            return Ok(new { post });
        }

        [HttpPost]
        [Route("AddComment/{text}/{authorID}/{postID}")]
        public IActionResult AddComment(string text, string authorID, string postID)
        {
            string id = GetNextCommentID();
            var comment = new Comment
            {
                ID = id,
                PostID = postID,
                AuthorID = authorID,
                Text = text,
                Time = DateTime.Now,
                Likes = 0,
                Dislikes = 0
            };
            redis.PushItemToList("post:" + postID + ":comments", id);
            redis.Set("comment:" + id + ":comment", comment);
            return Ok(new { comment });
        }

        [HttpPost]
        [Route("CreateUser/{username}")]
        public IActionResult CreateUser(string username)
        {
            string id = GetNextPersonID();
            redis.Set("person:" + id + ":username", username);
            return Ok(new { id });
        }

        [HttpPut]
        [Route("Like/{postID}/{userID}")]
        public IActionResult Like(string postID, string userID)
        {
            if (redis.SetContainsItem("post:" + postID + ":likes", userID))
                return BadRequest();
            var result = redis.Get<Post>("post:" + postID + ":post");
            result.Likes++;
            redis.Set("post:" + postID + ":post", result);
            redis.AddItemToSet("post:" + postID + ":likes", userID);
            redis.RemoveItemFromSortedSet("destination:" + result.DestinationID + ":postssorted", postID);
            redis.AddItemToSortedSet("destination:" + result.DestinationID + ":postssorted", postID, result.Likes - result.Dislikes);
            return Ok();
        }

        [HttpPut]
        [Route("Dislike/{postID}/{userID}")]
        public IActionResult Dislike(string postID, string userID)
        {
            if (redis.SetContainsItem("post:" + postID + ":dislikes", userID))
                return BadRequest();
            var result = redis.Get<Post>("post:" + postID + ":post");
            result.Dislikes++;
            redis.Set("post:" + postID + ":post", result);
            redis.AddItemToSet("post:" + postID + ":dislikes", userID);
            redis.RemoveItemFromSortedSet("destination:" + result.DestinationID + ":postssorted", postID);
            redis.AddItemToSortedSet("destination:" + result.DestinationID + ":postssorted", postID, result.Likes - result.Dislikes);
            return Ok();
        }

        [HttpGet]
        [Route("GetPost/{postID}")]
        public IActionResult GetPost(string postID)
        {
            var post = redis.Get<Post>("post:" + postID + ":post");
            var likes = redis.GetAllItemsFromSet("post:" + postID + ":likes");
            var dislikes = redis.GetAllItemsFromSet("post:" + postID + ":dislikes");
            return Ok(new { post, likes, dislikes });
        }

        [HttpGet]
        [Route("GetPersonInfo/{personID}")]
        public IActionResult GetPersonUsername(string personID)
        {
            var username = redis.Get<string>("person:" + personID + ":username");

            return Ok(new { username });
        }

        [HttpGet]
        [Route("HasUserVoted/{userID}/{postID}")]
        public IActionResult HasUserVoted(string userID, string postID)
        {
            return Ok(new
            {
                liked = redis.SetContainsItem("post:" + postID + ":likes", userID),
                disliked = redis.SetContainsItem("post:" + postID + ":dislikes", userID)
            });
        }

        [HttpGet]
        [Route("HasUserVotedComment/{userID}/{commentID}")]
        public IActionResult HasUserVotedComment(string userID, string commentID)
        {
            return Ok(new
            {
                liked = redis.SetContainsItem("comment:" + commentID + ":likes", userID),
                disliked = redis.SetContainsItem("comment:" + commentID + ":dislikes", userID)
            });
        }

        [HttpGet]
        [Route("GetUsername/{userID}")]
        public IActionResult GetUsername(string userID)
        {

            return Ok(new { username = redis.Get<string>("person:" + userID + ":username") });
        }

        [HttpGet]
        [Route("GetComments/{postID}")]
        public IActionResult GetComments(string postID)
        {
            var result = redis.GetAllItemsFromList("post:" + postID + ":comments");
            var comments = new List<Comment>();
            foreach (var id in result)
            {
                var comment = redis.Get<Comment>("comment:" + id + ":comment");
                comments.Add(comment);
            }
            return Ok(new { comments });
        }

        [HttpGet]
        [Route("GetLikes/{postID}")]
        public IActionResult GetLikes(string postID)
        {
            var likes = redis.GetAllItemsFromSet("post:" + postID + ":likes");
            var users = new List<Person>();
            foreach (var id in likes)
            {
                var user = redis.Get<string>("person:" + id + ":username");
                users.Add(new Person { ID = id, Username = user });
            }
            return Ok(new { users });
        }

        [HttpGet]
        [Route("GetDislikes/{postID}")]
        public IActionResult GetDislikes(string postID)
        {
            var dislikes = redis.GetAllItemsFromSet("post:" + postID + ":dislikes");
            var users = new List<Person>();
            foreach (var id in dislikes)
            {
                var user = redis.Get<string>("person:" + id + ":username");
                users.Add(new Person { ID = id, Username = user });
            }
            return Ok(new { users });
        }

        [HttpGet]
        [Route("GetDestinationPosts/{destinationID}")]
        public IActionResult GetDestinationPosts(string destinationID)
        {
            var postIDs = redis.GetAllItemsFromList("destination:" + destinationID + ":posts");
            var posts = new List<Post>();
            foreach (var id in postIDs)
            {
                var post = redis.Get<Post>("post:" + id + ":post");
                posts.Add(post);
            }
            return Ok(new { posts });
        }

        [HttpGet]
        [Route("GetDestinationPostsSorted/{destinationID}")]
        public IActionResult GetDestinationPostsSorted(string destinationID)
        {
            var postIDs = redis.GetAllItemsFromSortedSetDesc("destination:" + destinationID + ":postssorted");
            var posts = new List<Post>();
            foreach (var id in postIDs)
            {
                var post = redis.Get<Post>("post:" + id + ":post");
                posts.Add(post);
            }
            return Ok(new { posts });
        }

        [HttpDelete]
        [Route("DeletePost/{postID}")]
        public IActionResult DeletePost(string postID)
        {
            var post = redis.Get<Post>("post:" + postID + ":post");
            redis.RemoveItemFromList("destination:" + post.DestinationID + ":posts", postID);
            redis.Remove("post:" + postID + ":post");
            redis.Remove("post:" + postID + ":likes");
            redis.Remove("post:" + postID + ":dislikes");
            redis.RemoveItemFromList("person:" + post.AuthorID + ":posts", postID);


            foreach (var id in redis.GetAllItemsFromList("post:" + postID + ":comments"))
            {
                redis.Remove("comment:" + id + ":comment");
                redis.Remove("comment:" + id + ":likes");
                redis.Remove("comment:" + id + ":dislikes");
            }

            redis.Remove("post:" + postID + ":comments");

            return Ok();
        }

        [HttpDelete]
        [Route("DeleteComment/{commentID}")]
        public IActionResult DeleteComment(string commentID)
        {
            var comment = redis.Get<Comment>("comment:" + commentID + ":comment");
            redis.RemoveItemFromList("post:" + comment.PostID + ":comments", commentID);
            redis.Remove("comment:" + commentID + ":comment");
            redis.Remove("comment:" + commentID + ":likes");
            redis.Remove("comment:" + commentID + ":dislikes");
            return Ok();
        }

        [HttpGet]
        [Route("GetDestinations")]
        public IActionResult GetDestinations()
        {
            var resultList = redis.GetAllItemsFromSet("destinations:all");
            List<Destination> destinations = new List<Destination>();
            foreach (var id in resultList)
            {
                var result = redis.Get<string>("destination:" + id + ":name");
                destinations.Add(new Destination { ID = id, Name = result });
            }
            return Ok(new { destinations });
        }

        [HttpPut]
        [Route("LikeComment/{commentID}/{userID}")]
        public IActionResult LikeComment(string commentID, string userID)
        {
            if (redis.SetContainsItem("comment:" + commentID + ":likes", userID))
                return BadRequest();
            var result = redis.Get<Comment>("comment:" + commentID + ":comment");
            result.Likes++;
            redis.Set("comment:" + commentID + ":comment", result);
            redis.AddItemToSet("comment:" + commentID + ":likes", userID);
            return Ok();
        }

        [HttpPut]
        [Route("DislikeComment/{commentID}/{userID}")]
        public IActionResult DislikeComment(string commentID, string userID)
        {
            if (redis.SetContainsItem("comment:" + commentID + ":dislikes", userID))
                return BadRequest();
            var result = redis.Get<Comment>("comment:" + commentID + ":comment");
            result.Dislikes++;
            redis.Set("comment:" + commentID + ":comment", result);
            redis.AddItemToSet("comment:" + commentID + ":dislikes", userID);
            return Ok();
        }

        [HttpGet]
        [Route("GetCommentLikes/{commentID}")]
        public IActionResult GetCommentLikes(string commentID)
        {
            var likes = redis.GetAllItemsFromSet("comment:" + commentID + ":likes");
            var users = new List<Person>();
            foreach (var id in likes)
            {
                var user = redis.Get<string>("person:" + id + ":username");
                users.Add(new Person { ID = id, Username = user });
            }
            return Ok(new { users });
        }

        [HttpGet]
        [Route("GetCommentDislikes/{commentID}")]
        public IActionResult GetCommentDislikes(string commentID)
        {
            var dislikes = redis.GetAllItemsFromSet("comment:" + commentID + ":dislikes");
            var users = new List<Person>();
            foreach (var id in dislikes)
            {
                var user = redis.Get<string>("person:" + id + ":username");
                users.Add(new Person { ID = id, Username = user });
            }
            return Ok(new { users });
        }

        [HttpPut]
        [Route("EditPost/{postID}/{text}")]
        public IActionResult EditPost(string postID, string text)
        {
            var post = redis.Get<Post>("post:" + postID + ":post");
            post.Text = text;
            post.Time = DateTime.Now;
            redis.Set("post:" + postID + ":post", post);

            return Ok(new { post });
        }

        [HttpPut]
        [Route("EditComment/{commentID}/{text}")]
        public IActionResult EditComment(string commentID, string text)
        {
            var comment = redis.Get<Comment>("comment:" + commentID + ":comment");
            comment.Text = text;
            comment.Time = DateTime.Now;
            redis.Set("comment:" + commentID + ":comment", comment);

            return Ok(new { comment });
        }

        [HttpGet]
        [Route("GetPersonPosts/{personID}")]
        public IActionResult GetPersonPosts(string personID)
        {
            var postIDs = redis.GetAllItemsFromList("person:" + personID + ":posts");
            var posts = new List<Post>();
            foreach (var id in postIDs)
            {
                var post = redis.Get<Post>("post:" + id + ":post");
                posts.Add(post);
            }
            return Ok(new { posts });
        }

        

        [HttpDelete]
        [Route("ClearAll")]
        public async Task<IActionResult> ClearAll()
        {
            redis.FlushAll();
            redis.FlushDb();
            return Ok();
        }
    }
}
