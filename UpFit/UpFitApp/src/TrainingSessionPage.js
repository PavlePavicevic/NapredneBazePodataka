import { Exercise, CssBaseline, Box, Button } from '@mui/material';
import Container from '@mui/material/Container';
import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import {
    Tabs,
    Tab,
    Typography,
    Avatar,
    Grid,
    Divider,
    useTheme
} from '@mui/material';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import CardActions from "@mui/material/CardActions";

export default function TrainingSessionPage({ type, reloadHeader }) {

    const theme = useTheme();

    const navigate = useNavigate();

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

    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [info, setInfo] = useState({
        id:"",
        title:"",
        year:"",
        description:""
    });

    const [TrainingSessionPeople, setTrainingSessionPeople] = useState(null);

    const [TrainingSessionReviewers, setTrainingSessionReviewers] = useState(null);

    const [TrainingSessionExercises, setTrainingSessionExercises] = useState(null);

    const { id } = useParams();

    const getInfo = async () => {
        const response = await fetch("http://localhost:5211/api/TrainingSession/GetTrainingSessionInfo/"+id);
        if (response.ok) {
            const fetchData = await response.json();
            console.log(fetchData)
            //if (fetchData.cv.education.length > 0) {
            setInfo(fetchData);
            //}
        }
    }

    const getTrainingSessionPeople = async () => {
        const response = await fetch("http://localhost:5211/api/TrainingSession/GetTrainingSessionPeople/"+id);
        if (response.ok) {
            const fetchData = await response.json();
            console.log(fetchData)
            //if (fetchData.cv.education.length > 0) {
            setTrainingSessionPeople(fetchData.people);
            //}
        }
    }

    const getTrainingSessionReviewers = async () => {
        const response = await fetch("http://localhost:5211/api/TrainingSession/GetTrainingSessionReviewers/"+id);
        if (response.ok) {
            const fetchData = await response.json();
            console.log(fetchData)
            //if (fetchData.cv.education.length > 0) {
            setTrainingSessionReviewers(fetchData.people);
            //}
        }
    }

    const getTrainingSessionExercises = async () => {
        const response = await fetch("http://localhost:5211/api/TrainingSession/GetTrainingSessionExercises/"+id);
        if (response.ok) {
            const fetchData = await response.json();
            console.log(fetchData)
            //if (fetchData.cv.education.length > 0) {
            setTrainingSessionExercises(fetchData.Exercises);
            //}
        }
    }

    const update = () => {
        getInfo();
        reloadHeader();
    }

    useEffect(() => {
        getInfo();
        getTrainingSessionExercises();
        getTrainingSessionPeople();
        getTrainingSessionReviewers();
    }, []);

    return (

        <Container component="main" sx={{ pt: 3 }}>
            <CssBaseline />
            <Grid container spacing={10}  >
                {/* <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }}>
                    <Avatar src={process.env.PUBLIC_URL + "/resources/" + info.picture} sx={{ width: 140, height: 140 }} />
                </Grid> */}
                <Grid item xs={12} md={10}>
                    <Typography variant='h3' align="left">{info != undefined ? info.title:""}</Typography>
                    <Typography align="left">{info != undefined ? info.description : ""}</Typography>
                </Grid>

            </Grid>
            <Box >
                <Box sx={{ borderBottom: 1, borderColor: 'divider', position: "sticky", top: 65, mt: 4, zIndex: 20, backgroundColor: theme.palette.background.default }}>
                    <Tabs value={value} variant="scrollable" scrollButtons onChange={handleChange} aria-label="basic tabs example" >
                        <Tab label="Published Exercises" />
                        <Tab label="Exercise authors" sx={{ display: type === "public" ? "none" : "" }} />
                        <Tab label="Exercise reviewers" sx={{ display: type === "public" ? "none" : "" }} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                {TrainingSessionExercises== undefined || TrainingSessionExercises.length == 0 ? (<Typography>Currently no Exercises to display</Typography>) : ""}
                    {TrainingSessionExercises != null && (
                        <Grid container spacing={2}
                        /*xs={12} md={6} lg={6}*/
                        >

                            {TrainingSessionExercises
                                //.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
                                .map((card, index) => {
                                    const { id, title, description, date, link } = card;
                                    console.log(card);
                                    return (
                                            <Grid container style={{ display:"flex", flexDirection:"column", marginBottom:20}}>
                                                <Typography style={{ textAlign: "center", textDecoration: 'underline', marginLeft: 20, fontSize: 20, cursor: "pointer" }} onClick={() => { navigate("/ExerciseInfoPage/" + card.id) }}>{card.title}</Typography>
                                                <Typography > {"Description: "}{card.description}</Typography>
                                                <Typography > {"Publication date: "}{card.date.substring(0,10)}</Typography>
                                                <Divider style={{marginTop:20}}></Divider>
                                            </Grid>
                                            
                                          );
                                })}
                        </Grid>
                    )}
                </TabPanel>
                <TabPanel value={value} index={1}>
                {TrainingSessionPeople== undefined || TrainingSessionPeople.length == 0 ? (<Typography>Currently no people to display</Typography>) : ""}
                    {TrainingSessionPeople != null && (
                        <Grid container spacing={2}
                        /*xs={12} md={6} lg={6}*/
                        >

                            {TrainingSessionPeople
                                //.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
                                .map((card, index) => {
                                    const { id, name, surname, role, institution, contact, profilePicture } = card;
                                    console.log(card.name);
                                    return (
                                            <Grid item >
                                              <Card key={index} style={{ width: 350, height: 230, cursor: "pointer" }} onClick={() => { navigate("/ProfilePage/" + card.id) }}>
                            
                                                <CardMedia />
                                                <Grid container spacing={3}  >
                                                    <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "left" }}>
                                                    <Avatar src={decodeURIComponent(card.profilePicture)} sx={{ width: 80, height: 80, ml:1, mt:1 }} />
                                                    </Grid>
                                                <Grid item xs={12} md={10}>
                                                <Typography style={{marginRight:20, marginBottom:10, marginTop:10}} variant='h5' align="right">{card.surname + ", "+ card.name}</Typography>
                                                <Divider  style={{marginBottom:10}}></Divider>
                                                <Typography style={{marginLeft:10, display:"flex", justifyContent:"center", alignItems:"flex-end"}} align="right"><AssuredWorkloadIcon style={{marginRight:2}}/>{"Institution: "}</Typography>
                                                <Typography style={{marginLeft:10,marginBottom:10,  display:"flex", justifyContent:"center", alignItems:"flex-end"}} align="right">{card.institution}</Typography>
                                                <Typography style={{marginLeft:5, display:"flex", justifyContent:"center", alignItems:"flex-end"}} align="right"><ContactMailIcon style={{marginRight:2}}/>{"Contact: "}</Typography>
                                                <Typography style={{marginLeft:10, display:"flex", justifyContent:"center", alignItems:"flex-end"}} align="right">{card.contact}</Typography>
                                                </Grid>

                                            </Grid>
                                                
                                                <CardActions style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                                                </CardActions>
                                              </Card>
                                            </Grid>
                                          );
                                })}
                        </Grid>
                    )}
                </TabPanel>
                <TabPanel value={value} index={2}>
                {TrainingSessionReviewers== undefined || TrainingSessionReviewers.length == 0 ? (<Typography>Currently no people to display</Typography>) : ""}
                    {TrainingSessionReviewers != null && (
                        <Grid container spacing={2}
                        /*xs={12} md={6} lg={6}*/
                        >

                            {TrainingSessionReviewers
                                //.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
                                .map((card, index) => {
                                    const { id, name, surname, role, institution, contact, profilePicture } = card;
                                    console.log(card);
                                    return (
                                        <Grid item >
                                              <Card key={index} style={{ width: 350, height: 230, cursor: "pointer" }} onClick={() => { navigate("/ProfilePage/" + card.id) }}>
                            
                                                <CardMedia />
                                                <Grid container spacing={3}  >
                                                    <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "left" }}>
                                                    <Avatar src={decodeURIComponent(card.profilePicture)} sx={{ width: 80, height: 80, ml:1, mt:1 }} />
                                                    </Grid>
                                                <Grid item xs={12} md={10}>
                                                <Grid>
                                                <Typography style={{marginRight:20, marginBottom:10, marginTop:10}} variant='h5' align="right">{card.surname + ", "+ card.name}</Typography>
                                                </Grid>
                                                <Divider  style={{marginBottom:10}}></Divider>
                                                <Typography style={{marginLeft:10, display:"flex", justifyContent:"center", alignItems:"flex-end"}} align="right"><AssuredWorkloadIcon style={{marginRight:2}}/>{"Institution: "}</Typography>
                                                <Typography style={{marginLeft:10,marginBottom:10,  display:"flex", justifyContent:"center", alignItems:"flex-end"}} align="right">{card.institution}</Typography>
                                                <Typography style={{marginLeft:5, display:"flex", justifyContent:"center", alignItems:"flex-end"}} align="right"><ContactMailIcon style={{marginRight:2}}/>{"Contact: "}</Typography>
                                                <Typography style={{marginLeft:10, display:"flex", justifyContent:"center", alignItems:"flex-end"}} align="right">{card.contact}</Typography>
                                                </Grid>

                                            </Grid>
                                            <CardActions style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                                                </CardActions>
                                              </Card>
                                            </Grid>
                                      );
                                })}
                        </Grid>
                    )}
                </TabPanel>

            </Box>

        </Container >
    );
}