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
    public class CategoryController : Controller 
    {
        public enum PersonRole
        {
            Trainer,
            Student,
            Other
        }

        private BoltGraphClient client;
        public CategoryController()
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
        [Route("GetCategoryExercises")]
        public async Task<IActionResult> GetCategoryExercises([FromQuery] int[] categoryIDs) // 10
        {
            string whereParams = "";
            for (int i = 0; i < categoryIDs.Length; i++)
            {
                whereParams += "id(c)=" + categoryIDs[i];
                if (i != categoryIDs.Length - 1)
                    whereParams += " OR ";
            }
            var query1 = client.Cypher
                .Match("(p:Exercise)-[r:HAS]->(c:Category)")
                .Where(whereParams)
                .ReturnDistinct(p => p.As<Exercise>());
            var Exercise = new List<Exercise>();
            foreach (var exercise in await query1.ResultsAsync)
                Exercise.Add(exercise);

            return Ok(Exercise);

        }

        [HttpGet]
        [Route("GetCategoryTrainingSessions/{categoryID}")]   // 20 
        public async Task<IActionResult> GetCategoryTrainingSessions(int categoryID)
        {
            var result = client.Cypher
                .Match("(pp:Exercise)-[r1:HAS]->(c:Category)")
                .Where("id(c)=" + categoryID)
                .Match("(pp:Exercise)-[r2:IS_PUBLISHED]->(pr:TrainingSessions)")
                .Return(pr => pr.As<TrainingSession>());
            var trainingSessions = new List<TrainingSession>();
            foreach (var p in await result.ResultsAsync)
                trainingSessions.Add(p);

            return Ok(trainingSessions);

        }

        [HttpGet]
        [Route("GetCategoryPeople/{categoryID}")]   // 11
        public async Task<IActionResult> GetCategoryPeople(int categoryID)
        {
            var result = client.Cypher
                .Match("(pr:Person)-[r1:WRITES]->(pp:Exercise)-[r2:HAS]->(c:Category)")
                .Where("id(c)=" + categoryID)
                .Return(pr => pr.As<Person>());
            var people = new List<Person>();
            foreach (var p in await result.ResultsAsync)
                people.Add(p);

            return Ok(people);

        }

        [HttpGet]
        [Route("GetCategories")]
        public async Task<IActionResult> GetCategories()
        {

            var result = client.Cypher
                .Match("(category:Category)")
                .Return(category => category.As<Category>());

            var lista = new List<Category>();
            foreach (var category in await result.ResultsAsync)
                lista.Add(category);

            return Ok(lista);
        }

        [HttpGet]
        [Route("GetExerciseFromCategory/{categoryID}")]
        public async Task<IActionResult> GetExerciseFromCategory(int categoryID)
        {

            var result = client.Cypher
                .Match("(exercise:Exercise)-[:HAS]->(category:Category)")
                .Where("id(category)=" + categoryID)
                .Return(exercise => exercise.As<Exercise>());

            var lista = new List<Exercise>();
            foreach (var exercise in await result.ResultsAsync)
                lista.Add(exercise);

            return Ok(lista);
        }

        [HttpGet]
        [Route("GetPeopleFromCategory/{categoryID}")]
        public async Task<IActionResult> GetPeopleFromCategory(int categoryID)
        {

            var result = client.Cypher
                .Match("(person:Person)-[:WRITES]->(exercise:Exercise)-[:HAS]->(category:Category)")
                .Where("id(category)=" + categoryID)
                .ReturnDistinct(person => person.As<Person>());

            var lista = new List<Person>();
            foreach (var person in await result.ResultsAsync)
                lista.Add(person);

            return Ok(lista);
        }

        [HttpGet]
        [Route("GetCategoryName/{categoryID}")]
        public async Task<IActionResult> GetCategoryName(int categoryID)
        {

            var result = client.Cypher
                .Match("(category:Category)")
                .Where("id(category)=" + categoryID)
                .Return(category => category.As<Category>())
                .ResultsAsync;


            return Ok(result.Result.FirstOrDefault());

        }
    }
}