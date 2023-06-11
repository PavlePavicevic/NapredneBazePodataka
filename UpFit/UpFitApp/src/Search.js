import React, { useState, useEffect } from "react";
import {
  exercise,
  CssBaseline,
  Box,
  Divider,
  Grid,
  Container,
  Button,
  Typography,
  Chip,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import ExerciseCard from "./components/Search/ExerciseCard";
import { useParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

export default function Search(props) {
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);

  const { id, param } = useParams();
  const getSearchData = async () => {
    const response = await fetch(
      "http://localhost:5211/api/exercise/Search/" + param,
      {
        credentials: "include",
        method: "GET",
      }
    );

    const fetchData = await response.json();
    console.log(fetchData);
    setSearchData(fetchData);
  };

  useEffect(() => {
    getSearchData();
    // setSearchData("");
  }, []);

  const navigate = useNavigate();

  return (
    <Container component="main">
      <CssBaseline />
      <React.Fragment>
        <exercise sx={{ p: 3, mb: 4 }} variant="outlined">
          <Grid item xs={12} style={{ padding: "10px", maxWidth: 800, justifyContent: "center",
                alignItems: "center" }}>
            <Grid
              container
              xs={12}
              md={6}
              lg={6}
              style={{
                display: "flex",
                flexDirection: "row",
                padding: "10px",
                width: "90%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                style={{ marginBottom: 5 }}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                id="outlined-basic-email"
                label="Expand your knowledge..."
                variant="outlined"
                fullWidth
                onKeyPress={(ev) => {
                  console.log(`Pressed keyCode ${ev.key}`);
                  if (ev.key === 'Enter') {
                    // Do code here
                    navigate("/Search/" + search)
                    getSearchData()
                    navigate(0)
                  }
                }}
              />

            </Grid>

            {/* <TextField
              onChange={(event) => {
                setSearch(event.target.value);
                console.log("Search", search);
                getSearchData();
                console.log(searchData);
              }}
              id="outlined-basic-email"
              label="Expand your knowledge..."
              variant="outlined"
              fullWidth
            /> */}
          </Grid>

          {searchData.people !== undefined || searchData.people != null
            ? searchData.people.map((info, index) =>
                info.people !== null ? (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <ExerciseCard
                      title={info.name + " " + info.surname}
                      id={info.id}
                      description={info.institution}
                      type="people"
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <ExerciseCard
                      title={info.exercises.title}
                      id={info.exercises.id}
                      description={info.exercises.description}
                    />
                  </Grid>
                )
              )
            : console.log("searchData is undef or null")}

          {searchData.exercises !== undefined || searchData.exercises != null
            ? searchData.exercises.map((info, index) =>
                info.exercises !== null ? (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <ExerciseCard
                      title={info.title}
                      id={info.id}
                      description={info.description}
                      type="exercises"
                      link={info.link}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <ExerciseCard
                      title={info.exercises.title}
                      id={info.exercises.id}
                      description={info.exercises.description}
                    />
                  </Grid>
                )
              )
            : console.log("searchData is undef or null")}
        </exercise>
      </React.Fragment>
    </Container>
  );
}
