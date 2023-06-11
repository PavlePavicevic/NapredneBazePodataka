import { exercise, CssBaseline, Box, Button } from '@mui/material';
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
import EditExerciseDialog from './EditExercise';
import DeleteexerciseDialog from './DeleteExercise';

export default function ExerciseInfoPage({ type, reloadHeader }) {

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
        description:"",
        date:"",
        link:""
    });

    const [exerciseAuthors, setexerciseAuthors] = useState(null);

    const [exerciseReviewers, setexerciseReviewers] = useState(null);

    const [exerciseReferences, setexerciseReferences] = useState(null);

    const [exerciseReferences2, setexerciseReferences2] = useState(null);

    const { id } = useParams();

    const getInfo = async () => {
        const response = await fetch("http://localhost:5211/api/Exercise/GetDetails/"+id);
        if (response.ok) {
            const fetchData = await response.json();
            console.log(fetchData)
            //if (fetchData.cv.education.length > 0) {
            setInfo(fetchData);
            //}
        }
    }

    const getexerciseAuthors = async () => {
        const response = await fetch("http://localhost:5211/api/Exercise/GetExerciseAuthors/"+id);
        if (response.ok) {
            const fetchData = await response.json();
            console.log(fetchData)
            //if (fetchData.cv.education.length > 0) {
            setexerciseAuthors(fetchData.people);
            //}
        }
    }

    const getexerciseReviewers = async () => {
        const response = await fetch("http://localhost:5211/api/Exercise/GetExerciseReviewers/"+id);
        if (response.ok) {
            const fetchData = await response.json();
            console.log(fetchData)
            //if (fetchData.cv.education.length > 0) {
            setexerciseReviewers(fetchData.people);
            //}
        }
    }

    const getexerciseReferences = async () => {
        const response = await fetch("http://localhost:5211/api/Exercise/GetExerciseReferences1/"+id);
        if (response.ok) {
            const fetchData = await response.json();
            console.log(fetchData)
            //if (fetchData.cv.education.length > 0) {
            setexerciseReferences(fetchData.exercises);
            //}
        }
    }

    const getexerciseReferences2 = async () => {
        const response = await fetch("http://localhost:5211/api/Exercise/GetExerciseReferences2/"+id);
        if (response.ok) {
            const fetchData = await response.json();
            console.log(fetchData)
            //if (fetchData.cv.education.length > 0) {
            setexerciseReferences2(fetchData.exercises);
            //}
        }
    }

    const update = () => {
        getInfo();
        reloadHeader();
    }

    const update2 = () => {
        navigate("/DeletedExercise");
        reloadHeader();
    }

    useEffect(() => {
        getInfo();
        getexerciseAuthors();
        getexerciseReviewers();
        getexerciseReferences();
        getexerciseReferences2();
    }, []);

    return (

        <Container component="main" sx={{ pt: 3 }}>
            <CssBaseline />
            <Grid container spacing={10}  >
                {/* <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }}>
                    <Avatar src={process.env.PUBLIC_URL + "/resources/" + info.picture} sx={{ width: 140, height: 140 }} />
                </Grid> */}
                <Grid item xs={12} md={10}>
                    <Typography variant='h3' align="left">{info != undefined ? info.title:""} </Typography>
                    <Typography align="left">{info != undefined ? info.description : ""}
                    </Typography>
                    <Grid container style={{display:"flex", marginTop:10}} >
                    <EditExerciseDialog
                            currentTitle={info.title}
                            currentDescription={info.description}
                            update={update}
                            id={info.id}
                    />
                    <DeleteexerciseDialog
                            id={info.id}
                            update={update2}
                    />
                    </Grid>
                </Grid>
                

            </Grid>
            <Box >
                <Box sx={{ borderBottom: 1, borderColor: 'divider', position: "sticky", top: 65, mt: 4, zIndex: 20, backgroundColor: theme.palette.background.default }}>
                    <Tabs value={value} variant="scrollable" scrollButtons onChange={handleChange} aria-label="basic tabs example" >
                        <Tab label="Referenced in" />
                        <Tab label="exercise authors" sx={{ display: type === "public" ? "none" : "" }} />
                        <Tab label="exercise reviewers" sx={{ display: type === "public" ? "none" : "" }} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                {exerciseReferences== undefined || exerciseReferences.length == 0 ? (<Typography>Currently no exercises to display</Typography>) : ""}
                    {exerciseReferences != null && (
                        <Grid container spacing={2}
                        /*xs={12} md={6} lg={6}*/
                        >

                            {exerciseReferences
                                //.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
                                .map((card, index) => {
                                    const { id, title, description, date, link } = card;
                                    console.log(card);
                                    return (
                                            <Grid container style={{ display:"flex", flexDirection:"column", marginBottom:20}}>
                                                <Typography style={{ textAlign: "center", textDecoration: 'underline', marginLeft: 20, fontSize: 20, cursor: "pointer" }} onClick={() => { window.location=("http://localhost:3000/exerciseInfoPage/" + card.id) }}>{card.title}</Typography>
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
                {exerciseAuthors== undefined || exerciseAuthors.length == 0 ? (<Typography>Currently no people to display</Typography>) : ""}
                    {exerciseAuthors != null && (
                        <Grid container spacing={2}
                        /*xs={12} md={6} lg={6}*/
                        >

                            {exerciseAuthors
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
                <TabPanel value={value} index={2}>
                {exerciseReviewers== undefined || exerciseReviewers.length == 0 ? (<Typography>Currently no people to display</Typography>) : ""}
                    {exerciseReviewers != null && (
                        <Grid container spacing={2}
                        /*xs={12} md={6} lg={6}*/
                        >

                            {exerciseReviewers
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