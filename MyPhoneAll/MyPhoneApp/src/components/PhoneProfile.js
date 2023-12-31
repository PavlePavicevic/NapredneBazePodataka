import { Paper, CssBaseline, Box, Button } from '@mui/material';
import Container from '@mui/material/Container';
import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  Tabs,
  Tab,
  Typography,
  Avatar,
  Grid,
  Divider,
  TextField,
  IconButton,
  useTheme
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import CardActions from "@mui/material/CardActions";

export default function PhoneProfile({ type, reloadHeader }) {

  const theme = useTheme();

  const { id } = useParams();

  const navigate = useNavigate();

  const [newQuestion, setNewQuestion] = useState([]);

  
  const handleQAChange = async (event) => {
    setNewQuestion(event.target.value);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        sx={{ width: 1 }}
      >
        {value === index && (
          <Box sx={{ p: 3, width: 1 }}>
            {children}
          </Box>
        )}
      </Box>
    );
  }

  async function _submitForm(values, actions) {
    const response = await fetch(
      "http://localhost:5100/api/QA/Ask/" + id + "/" +
      newQuestion,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    getInfo();

    if (response.ok) {
      const data = await response.json();
      getInfo();
    }
  }

  async function _submitAnswer(index) {
    console.log(newAnswer[index].answer2);
    console.log(index);
    const response = await fetch(
      "http://localhost:5100/api/QA/Answer/" + id + "/" +
      newAnswer[index].answer2 + "/" + index,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    getInfo();

    if (response.ok) {
      const data = await response.json();
      // setSubmitted("yes");
      getInfo();
    }
  }

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const [info, setInfo] = useState({
    id: "",
    name: "",
    description: "",
    photos: [],
    phoneType: 0,
    price: "",
    cashOnly: true,
  });

  const getInfo = async () => {
    const response = await fetch("http://localhost:5100/api/Phone/GetPhone/" + id);
    if (response.ok) {
      const fetchData = await response.json();
      console.log(fetchData)
      //if (fetchData.cv.education.length > 0) {
      setInfo(fetchData);
      setNewAnswer(fetchData.qAs);
      //}
    }
  }

  const [newAnswer, setNewAnswer] = useState(info.qAs);

  console.log("NA" + newAnswer);

  const handleAnswerRemove = (index) => {
    const list = [...newAnswer];
    list.splice(index, 1);
    setNewAnswer(list);
  }

  const handleAnswerChange = (event, index) => {
    const { value, name } = event.target;
    const list = [...newAnswer];
    list[index][name] = value;
    setNewAnswer(list);
    console.log(list);
  }


  const update = () => {
    getInfo();
    reloadHeader();
  }

  useEffect(() => {
    getInfo();

  }, []);

  return (
    <Container component="main" sx={{ pt: 3 }}>
      <CssBaseline />
      <Grid container>
        <Grid container item xs={12}>
          <Grid item xs={10} sx={{ display: "flex", flexDirection: "row" }}>
            <Typography
              variant="h2"
              align="left"
              sx={{ align: "left" }}
            >
              {info.name}
            </Typography>
          </Grid>

          <Divider sx={{ width: "100%" }} />
          <Grid>
            <Typography
              variant="h5"
              align="left"
              sx={{ mt: 2, display: info.price == undefined ? "none" : "" }}
            >
              <LocationOnIcon sx={{ fontSize: "30px", color: "#FEBB02" }} /> {info.address + ", " + info.cityName}
            </Typography>
            <Typography
              variant="h5"
              align="left"
              sx={{ mt: 1, display: info.price == undefined ? "none" : "" }}
            >
              <MapsHomeWorkIcon sx={{ fontSize: "30px", color: "#FEBB02" }} /> {info.area + " sqm for " + info.price + " eur per month"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Typography
            align="left"
            variant="h6"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              mb: 1,
            }}
          >
            {info.description}
          </Typography>
        </Grid>
      </Grid>
      <Box >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', position: "sticky", top: 35, mt: 3, zIndex: 20, backgroundColor: theme.palette.background.default }}>
          <Tabs value={value} variant="scrollable" scrollButtons onChange={handleChange} aria-label="basic tabs example" >
            <Tab label="Basic info" />
            <Tab label="Phone Photos" sx={{ display: type === "public" ? "none" : "" }} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Grid>
            <Paper sx={{ height: 35 }}>
              <Typography
                variant="h5"
                align="center"
                sx={{ mt: 2, display: info.price == undefined ? "none" : "" }}
              >
                {"Phone type: "} {info.phoneType == 1 ? " Mobile" : " Tablet"}
              </Typography>
            </Paper>
            <Paper sx={{ height: 35 }}>
              <Typography
                variant="h5"
                align="center"
                sx={{ mt: 2, mb: 1, display: info.price == undefined ? "none" : "" }}
              >
                {"Cash only: "} {info.cashOnly == true ? " Yes" : " No"}
              </Typography>
            </Paper>
          </Grid>
        </TabPanel>
        
        <TabPanel value={value} index={2}>
          {info.photos.length == 0 ? "Currently no photos to display" : info.photos
            //.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
            .map((photo, index) => {
              return (
                <CardMedia
                  sx={{ mb: 2 }}
                  component="img"
                  height={250}
                  width={200}
                  image={"https://www.gannett-cdn.com/presto/2021/01/12/NPBD/08d0fd5e-2255-4d49-b608-e83342ae4615-PBN_POOL_REAR_535_N_County_Road_HiRes_PictureItSoldFL.jpg?crop=1279,720,x0,y64&width=1279&height=720&format=pjpg&auto=webp"}
                  alt=" "
                />
              );
            })}
        </TabPanel>
      </Box>
    </Container>
  );
}