import { Grid, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExerciseCard from "./ExerciseCard";

export default function CardList({ type }) {
  const [infos, setInfos] = useState([]);
  const theme = useTheme();

  const { id } = useParams();

  const getInformations = async () => {
    let response;
    if (type === "Exercises") {
      response = await fetch(
        "http://localhost:5211/api/Person/GetExercisesFromPerson/" + id,
        {
          credentials: "include",
        }
      );
    } else if (type === "TrainingSessions") {
      response = await fetch(
        "http://localhost:5211/api/Person/GetTrainingSessions/" + id,
        {
          credentials: "include",
        }
      );
    } else return;
    const data = await response.json();
    console.log(data);
    setInfos(data);
  };

  useEffect(() => {
    getInformations();
  }, []);

  return (
    <Grid container spacing={3}>
      {console.log(infos)}
      {infos.map((info, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <ExerciseCard
            title={info.title}
            description={info.description}
            date={type === "Exercises" ? info.date.split("T")[0] : info.year}
            link={type === "Exercises" ? "localhost:3000/ExerciseInfoPage/" + info.id : "localhost:3000/TrainingSessionPage/" + info.id}
          />
        </Grid>
      ))}
    </Grid>
  );
}
