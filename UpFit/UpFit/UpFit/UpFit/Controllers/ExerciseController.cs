using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using Neo4jClient.Cypher;
using System.Xml.Linq;
using System.Collections;
using UpFit.Models;
using System.Collections.Generic;

namespace UpFit.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExerciseController : Controller 
    {

        private BoltGraphClient client;
        public ExerciseController()
        {

            client = new BoltGraphClient("bolt://localhost:7687", "neo4j", "UpFit");
            try
            {
                client.ConnectAsync().Wait();
            }
            catch (Exception exc)
            {

            }
        }

        private async void NormalizeIDs()
        {
            await client.Cypher.Match("(n)").Set("n.id=id(n)").ExecuteWithoutResultsAsync();
        }


        [HttpGet]
        [Route("GetExerciseTrainsers/{exerciseID}")]
        public async Task<IActionResult> GetExerciseAuthors(int exerciseID) // 13
        {
            var query1 = client.Cypher
                .Match("(pp:Exercise )<-[r:WRITES]-(pr:Person)")
                .Where("id(pp)=$exerciseID")
                .WithParams(new { exerciseID })
                .Return(pr => pr.As<Person>());
            var trainers = new List<Person>();
            foreach (var person in await query1.ResultsAsync)
                trainers.Add(person);

            return Ok(new { People = trainers });

        }

        [HttpGet]
        [Route("Search/{searchParam}")]
        public async Task<IActionResult> Search(string searchParam) // 1
        {
            var query1 = client.Cypher
                .Match("(p:Person)")
                .Where((Person p) => p.Name.Contains(searchParam) || p.Surname.Contains(searchParam))
                .Return(p => p.As<Person>());
            var people = new List<Person>();
            foreach (var person in await query1.ResultsAsync)
                people.Add(person);
            var query2 = client.Cypher
                .Match("(p:exercise)")
                .Where((Exercise p) => p.Title.Contains(searchParam))
                .Return(p => p.As<Exercise>());
            var exercises = new List<Exercise>();
            foreach (var exercise in await query2.ResultsAsync)
                exercises.Add(exercise);


            return Ok(new { People = people, Exercises = exercises });

 

        }

        

        [HttpPut]
        [Route("UpdateExercise/{id}/{title}/{description}")]
        public async Task<IActionResult> Updateexercise(int id, string title, string description) // 16
        {
            await client.Cypher
                .Match("(n:Exercise)")
                .Where("id(n)=$id")
                .Set("n.title=$title,n.description=$description")
                .WithParams(new { id, title, description })
                .ExecuteWithoutResultsAsync();
            return Ok();

        }

        [HttpGet]
        [Route("GetExerciseReviewers/{exerciseID}")]
        public async Task<IActionResult> getExerciseReviewers(int exerciseID) // 22
        {
            var query1 = client.Cypher
                .Match("(pp:Exercise)<-[r:REVIEWS]-(pr:Person)")
                .Where("id(pp)=$exerciseID")
                .WithParams(new { exerciseID })
                .Return(pr => pr.As<Person>());
            var trainers = new List<Person>();
            foreach (var person in await query1.ResultsAsync)
                trainers.Add(person);

            return Ok(new { People = trainers });

        }


        [HttpPost]
        [Route("AddExercise/{title}/{description}/{date}/{link}")]   // 17
        public async Task<IActionResult> AddExercise(string title, string description, DateTime date, string link)
        {
            var result = client.Cypher
                .Create("(exercise:Exercise {title:\"" + title + "\",description:\"" + description + "\",date:\"" + date + "\",link:\"" + link + "\"})")
                //.ExecuteWithoutResultsAsync();
                .Set("exercise.id=id(exercise)")
                .Return(exercise => exercise.As<Exercise>());

            var exercise = (await result.ResultsAsync).FirstOrDefault();

            NormalizeIDs();
            return Ok(exercise);

        }

        [HttpGet]
        [Route("GetExerciseReferences1/{exerciseID}")]   
        public async Task<IActionResult> GetExerciseReferences1(int exerciseID)
        {
            var result = client.Cypher
                .Match("(po:Exercise)-[r1:REFERENCES]->(pr:Exercise)")
                .Where("id(pr)=" + exerciseID)
                .Return(po => po.As<Exercise>());
            var refexercise = new List<Exercise>();
            foreach (var p in await result.ResultsAsync)
                refexercise.Add(p);

            return Ok(new { Exercises = refexercise });

        }

        [HttpGet]
        [Route("GetExerciseReferences2/{exerciseID}")]  
        public async Task<IActionResult> GetExerciseReferences2(int exerciseID)
        {
            var result = client.Cypher
                .Match("(po:exercise)-[r1:REFERENCES]->(pr:exercise)")
                .Where("id(po)=" + exerciseID)
                .Return(pr => pr.As<Exercise>());
            var refExercises = new List<Exercise>();
            foreach (var p in await result.ResultsAsync)
                refExercises.Add(p);

            return Ok(new { Exercises = refExercises });

        }


        [HttpDelete]
        [Route("DeleteExercise/{exerciseID}")]
        public async Task<IActionResult> DeleteExercise(int exerciseID)
        {

            var result = client.Cypher
                 .Match("(exercise:Exercise)")
                 .Where("id(exercise)=" + exerciseID)
                 .DetachDelete("exercise")
                 .ExecuteWithoutResultsAsync();

            return Ok();
        }

        [HttpGet]
        [Route("GetDetails/{exerciseID}")]
        public async Task<IActionResult> GetDetails(int exerciseID)
        {


            var result = client.Cypher
                .Match("(exercise:exercise)")
                .Where("id(exercise)=" + exerciseID)
                .Return(exercise => exercise.As<Exercise>())
                .ResultsAsync;


            return Ok(result.Result.FirstOrDefault());



        }


    }
}