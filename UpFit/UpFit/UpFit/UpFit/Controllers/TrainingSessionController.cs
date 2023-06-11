using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using Neo4jClient.Cypher;

using System.Xml.Linq;
using System.Collections;
using UpFit.Models;

namespace UpFit.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainingSessionController : Controller
    {

        private BoltGraphClient client;
        public TrainingSessionController()
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

        [HttpGet]
        [Route("GetTrainingSessionInfo/{TrainingSessionID}")]     // 2
        public async Task<IActionResult> GetTrainingSessionInfo(int TrainingSessionID)
        {
            var result = client.Cypher
                .Match("(pr:TrainingSession)")
                .Where("id(pr)=" + TrainingSessionID)
                .Return(pr => pr.As<TrainingSession>())
                .ResultsAsync;


            return Ok(result.Result.FirstOrDefault());

        }

        [HttpGet]
        [Route("GetTrainingSessionPeople/{TrainingSessionID}")]   // 8
        public async Task<IActionResult> GetTrainingSessionPeople(int TrainingSessionID)
        {
            var result = client.Cypher
                .Match("(pr:Person)-[r1:WRITES]->(pp:Exercise)-[r2:IS_PUBLISHED]->(pc:TrainingSession)")
                .Where("id(pc)=" + TrainingSessionID)
                .Return(pr => pr.As<Person>());
            var people = new List<Person>();
            foreach (var p in await result.ResultsAsync)
                people.Add(p);

            return Ok(new { People = people});

        }

        [HttpGet]
        [Route("GetTrainingSessionReviewers/{TrainingSessionID}")]   // 23
        public async Task<IActionResult> GetTrainingSessionReviewers(int TrainingSessionID)
        {
            var result = client.Cypher
                .Match("(pr:Person)-[r1:REVIEWS]->(pp:Exercise)-[r2:IS_PUBLISHED]->(pc:TrainingSession)")
                .Where("id(pc)=" + TrainingSessionID)
                .Return(pr => pr.As<Person>());
            var people = new List<Person>();
            foreach (var p in await result.ResultsAsync)
                people.Add(p);

            return Ok(new { People = people });

        }

        [HttpGet]
        [Route("GetTrainingSessionExercises/{TrainingSessionID}")]
        public async Task<IActionResult> GetTrainingSessionExercise(int TrainingSessionID)
        {

            var result = client.Cypher
                .Match("(exercise:Exercise)-[:IS_PUBLISHED]->(TrainingSession:TrainingSession)")
                .Where("id(TrainingSession)=" + TrainingSessionID)
                .Return(exercise => exercise.As<Exercise>());

            var lista = new List<Exercise>();
            foreach (var exercise in await result.ResultsAsync)
                lista.Add(exercise);

            return Ok(new { Exercises = lista });
        }

        [HttpGet]
        [Route("GetExercise/{TrainingSession}")]
        public async Task<IActionResult> GetExercise(string TrainingSession)
        {


            var result = client.Cypher
                .Match("(exercise:Exercise)-[:IS_PUBLISHED]->(TrainingSession:TrainingSession)")
                .Return(exercise => exercise.As<Exercise>());

            var lista = new List<Exercise>();
            foreach (var exercise in await result.ResultsAsync)
                lista.Add(exercise);

            return Ok(lista);


        }
        
        [HttpGet]
        [Route("GetExercisesFromTrainingSession/{TrainingSessionID}")]
        public async Task<IActionResult> GetExercisesFromTrainingSession(int TrainingSessionID)
        {

            var result = client.Cypher
                .Match("(exercise:Exercise)-[:IS_PUBLISHED]->(TrainingSession:TrainingSession)")
                .Where("id(TrainingSession)=" + TrainingSessionID)
                .Return(exercise => exercise.As<Exercise>());

            var lista = new List<Exercise>();
            foreach (var exercise in await result.ResultsAsync)
                lista.Add(exercise);

            return Ok(lista);
        }
        
    }
}
