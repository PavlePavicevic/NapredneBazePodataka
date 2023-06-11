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
    public class RelationsController : Controller 
    {

        private BoltGraphClient client;
        public RelationsController()
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


        // -----------------------------------------------
        // -------------CREATE RELATIONSHIPS--------------
        // -----------------------------------------------

        [HttpPost]
        [Route("References/{exercise1ID}/{exercise2ID}")]
        public async Task<IActionResult> References(int exercise1ID, int exercise2ID)
        {
            //(exercise1)-[r:REFERENCES]->(exercise2)
            await client.Cypher
                .Match("(exercise1:exercise)", "(exercise2:exercise)")
                .Where("id(exercise1)=" + exercise1ID)
                .AndWhere("id(exercise2)=" + exercise2ID)
                .Create("(exercise1)-[r:REFERENCES]->(exercise2)")
                .ExecuteWithoutResultsAsync();

                NormalizeIDs();
                return Ok();
        }

        [HttpPost]
        [Route("Reviews/{personID}/{exerciseID}")]
        public async Task<IActionResult> Reviews(int personID, int exerciseID)
        {
            //(person)-[r:REVIEWS]->(exercise)
            await client.Cypher
                .Match("(person:Person)", "(exercise:exercise)")
                .Where("id(person)=" + personID)
                .AndWhere("id(exercise)=" + exerciseID)
                .Create("(person)-[r:REVIEWS]->(exercise)")
                .ExecuteWithoutResultsAsync();

                NormalizeIDs();
                return Ok();
        }

        [HttpPost]
        [Route("Is_published/{exerciseID}/{TrainingSessionID}")]
        public async Task<IActionResult> Is_published(int exerciseID, int TrainingSessionID)
        {
            //(exercise)-[r:IS_PUBLISHED]->(TrainingSession)
            await client.Cypher
                .Match("(exercise:exercise)", "(TrainingSession:TrainingSession)")
                .Where("id(exercise)=" + exerciseID)
                .AndWhere("id(TrainingSession)=" + TrainingSessionID)
                .Create("(exercise)-[r:IS_PUBLISHED]->(TrainingSession)")
                .ExecuteWithoutResultsAsync();

                NormalizeIDs();
                return Ok();
        }

        [HttpPost]
        [Route("Writes/{personID}/{exerciseID}")]
        public async Task<IActionResult> Writes(int personID, int exerciseID)
        {
            //(person)-[r:WRITES]->(exercise)
            await client.Cypher
                .Match("(person:Person)", "(exercise:exercise)")
                .Where("id(person)=" + personID)
                .AndWhere("id(exercise)=" + exerciseID)
                .Create("(person)-[r:WRITES]->(exercise)")
                .ExecuteWithoutResultsAsync();

                NormalizeIDs();
                return Ok();
        }

        [HttpPost]
        [Route("Has/{exerciseID}/{categoryID}")]
        public async Task<IActionResult> Has(int exerciseID, int categoryID)
        {
            //(exercise)-[r:HAS]->(category)
            await client.Cypher
                .Match("(exercise:exercise)", "(category:Category)")
                .Where("id(exercise)=" + exerciseID)
                .AndWhere("id(category)=" + categoryID)
                .Create("(exercise)-[r:HAS]->(category)")
                .ExecuteWithoutResultsAsync();

                NormalizeIDs();
                return Ok();
        }


    }
}
