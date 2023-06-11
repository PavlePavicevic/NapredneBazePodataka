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
    public class PersonController : Controller 
    {
        private async void NormalizeIDs()
        {
            await client.Cypher.Match("(n)").Set("n.id=id(n)").ExecuteWithoutResultsAsync();
        }

        private BoltGraphClient client;
        public PersonController()
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
        [Route("GetPersonCategories/{personID}")]
        public async Task<IActionResult> GetPersonCategories(int personID) 
        {
            var query1 = client.Cypher
                .Match("(pr:Person)-[r1:WRITES]->(pp:Exercise)-[r2:HAS]->(c:Category)")
                .Where("id(pr)=" + personID)
                .Return(c => c.As<Category>());
            var categories = new List<Category>();
            foreach (var cat in await query1.ResultsAsync)
                categories.Add(cat);

            return Ok(categories);

        }

        [HttpPut]
        [Route("UpdatePerson/{id}/{name}/{surname}/{contact}")]
        public async Task<IActionResult> UpdatePerson(int id, string name, string surname, string contact) // 7
        {
            await client.Cypher
                .Match("(n:Person)")
                .Where("id(n)=" + id)
                .Set("n.name=$name,n.surname=$surname,n.contact=$contact")
                .WithParams(new { id, name, surname, contact })
                .ExecuteWithoutResultsAsync();
            return Ok();
        }

        [HttpPut]
        [Route("UpdatePersonPhoto/{id}/{link}")]
        public async Task<IActionResult> UpdatePersonPhoto(int id, string link) // 7
        {
            await client.Cypher
                .Match("(n:Person)")
                .Where("id(n)=" + id)
                .Set("n.profilePicture=$link")
                .WithParams(new { id, link })
                .ExecuteWithoutResultsAsync();
            return Ok();
        }


        [HttpGet]
        [Route("GetAllTrainers")]
        public async Task<IActionResult> GetAllAuthors() // 19
        {
            var query = client.Cypher
                .Match("(p:Person)-[r:WRITES]->(pp:exercise)")
                .Return(p => p.As<Person>());
            var lista = new List<Person>();
            foreach (var person in await query.ResultsAsync)
                lista.Add(person);
            return Ok(lista);

        }

        [HttpGet]
        [Route("GetAllPeople")]
        public async Task<IActionResult> GetAllPeople()
        {
            var query = client.Cypher
                .Match("(p:Person)")
                .Return(p => p.As<Person>());
            var lista = new List<object>();
            foreach (var person in await query.ResultsAsync)
                lista.Add(new { person.ID, Name = person.Name + " " + person.Surname });
            return Ok(lista);

        }

        // ---

        [HttpGet]
        [Route("GetPersonInfo/{personID}")]     // 2
        public async Task<IActionResult> GetPersonInfo(int personID)
        {
            var result = client.Cypher
                .Match("(pr:Person)")
                .Where("id(pr)=" + personID)
                .Return(pr => pr.As<Person>())
                .ResultsAsync;


            return Ok(result.Result.FirstOrDefault());

        }


        [HttpGet]
        [Route("GetPersonCoauthors/{personID}")]   // 5
        public async Task<IActionResult> GetPersonCoauthors(int personID)
        {
            var result = client.Cypher
                .Match("(pr:Person)-[r1:WRITES]->(pp:Exercise)")
                .Where("id(pr)=" + personID)
                .Return(pp => pp.As<Exercise>());
            var people = new List<Person>();

            NormalizeIDs();
            foreach (var p in await result.ResultsAsync)
            {
                var result2 = client.Cypher
                .Match("(pr:Person)-[r1:WRITES]->(pp:Exercise)")
                .Where("id(pp)=" + p.ID)
                
                .Return(pr => pr.As<Person>());

                foreach (var pp in await result2.ResultsAsync)
                    people.Add(pp);
            }
            people = people.Where(x => x.ID != personID).ToList();
            return Ok(people.Distinct());

        }

        // ---

        [HttpGet]
        [Route("GetExercises/{name}/{surname}")]
        public async Task<IActionResult> GetExercises(string name, string surname)
        {


            var result = client.Cypher
                .Match("(person:Person)-[:WRITES]->(exercise:Exercise)")
                .Where((Person person) => person.Name == name)
                .AndWhere((Person person) => person.Surname == surname)
                .Return(exercise => exercise.As<Exercise>());

            var lista = new List<Exercise>();
            foreach (var exercise in await result.ResultsAsync)
                lista.Add(exercise);

            return Ok(lista);
        }

        [HttpGet]
        [Route("GetTrainingSessions/{name}/{surname}")]
        public async Task<IActionResult> GetTrainingSessions(string name, string surname)
        {


            var result = client.Cypher
                .Match("(person:Person)-[:WRITES]->(exercise:Exercise)-[:IS_PUBLISHED]->(trainingSession:TrainingSession)")
                .Where((Person person) => person.Name == name)
                .AndWhere((Person person) => person.Surname == surname)
                .Return(trainingSession => trainingSession.As<TrainingSession>());

            var lista = new List<TrainingSession>();
            foreach (var trainingSession in await result.ResultsAsync)
                lista.Add(trainingSession);

            return Ok(lista);


        }

        [HttpPost]
        [Route("AddPerson/{name}/{surname}/{role}/{institution}/{contact}")]
        public async Task<IActionResult> AddPerson(string name, string surname, PersonRole role, string institution, string contact)
        {
            var result = client.Cypher
                .Create("(person:Person {name: '" + name + "', surname: '" + surname +
                "', role: '" + role + "', institution: '" + institution + "', contact: '" + contact + "'})")
                .Set("person.id=id(person)")
                
                .Return(person => person.As<Person>());
            NormalizeIDs();
            var person = (await result.ResultsAsync).FirstOrDefault();
            return Ok(person);
        }


        [HttpGet]
        [Route("GetTrainingSession/{personID}")]
        public async Task<IActionResult> GetTrainingSession(int personID)
        {


            var result = client.Cypher
                .Match("(person:Person)-[:WRITES]->(exercise:Exercise)-[:IS_PUBLISHED]->(trainingSession:TrainingSession)")
                .Where("id(person)=" + personID)
                .Return(trainingSession => trainingSession.As<TrainingSession>());

            var lista = new List<TrainingSession>();
            foreach (var trainingSession in await result.ResultsAsync)
                lista.Add(trainingSession);

            return Ok(lista);


        }



        [HttpGet]
        [Route("GetExerciseFromPerson/{personID}")]
        public async Task<IActionResult> GetExercisesFromPerson(int personID)
        {

            var result = client.Cypher
                .Match("(person:Person)-[:WRITES]->(exercise:Exercise)")
                .Where("id(person)=" + personID)
                .Return(exercise => exercise.As<Exercise>());

            var lista = new List<Exercise>();
            foreach (var exercise in await result.ResultsAsync)
                lista.Add(exercise);

            return Ok(lista);
        }



    }
}
