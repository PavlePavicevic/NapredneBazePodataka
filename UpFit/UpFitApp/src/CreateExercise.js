import { Paper, CssBaseline, Box } from '@mui/material';
import Container from '@mui/material/Container';
import React, { useEffect, useState } from 'react';
import {
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    CircularProgress
} from '@mui/material';
import { Formik, Form } from 'formik';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import * as Yup from 'yup';
import { NavLink, useNavigate } from 'react-router-dom';

import ExerciseBasicInfo from './components/ExerciseCreator/ExerciseBasicInfo';
import ChooseCategories from './components/ExerciseCreator/ExerciseChooseCategories';
import AuthorsAndReviewers from './components/ExerciseCreator/ExerciseAuthorsAndReviewers';
import References from './components/ExerciseCreator/ExerciseReferences';



//import { theme, useStyle } from './styles';
const steps = ['Basic info', 'Categories', "Authors and reviewers", 'References'];



export default function ExerciseCreator() {
    
    function _renderStepContent(step) {
        switch (step) {
            case 0:
                return <React.Fragment><ExerciseBasicInfo /></React.Fragment>;
            case 1:
                return <React.Fragment><ChooseCategories /></React.Fragment>;
            case 2:
                return <React.Fragment><AuthorsAndReviewers /></React.Fragment>;
            case 3:
                return <React.Fragment><References /></React.Fragment>;
            default:
                return <React.Fragment>Not Found</React.Fragment>;
        }
    }

    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0);
    const isLastStep = activeStep === steps.length - 1;

    function _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function _submitForm(values, actions) {
        
        const resp1 = await fetch("http://localhost:5211/api/Exercise/AddExercise/" +
            encodeURIComponent(values.title) + "/" + encodeURIComponent(values.description) + "/" +
            values.date + "/" + encodeURIComponent(values.link), { method: "POST" });
        if (!resp1.ok) {
            alert("Exercise creation failed!");
            return;
        }
        const exercise = await resp1.json();
        for (let i = 0; i < values.categories.length; i++) {
            fetch("http://localhost:5211/api/Relations/Has/" + exercise.id + "/" + values.categories[i].id, { method: "POST" }).then(r => {
                if (!r.ok) {
                    alert("An error occured while adding category: ", values.categories[i].id)
                }
            })
        }
        for (let i = 0; i < values.references.length; i++) {
            fetch("http://localhost:5211/api/Relations/References/" + exercise.id + "/" + values.references[i].id, { method: "POST" }).then(r => {
                if (!r.ok) {
                    alert("An error occured while adding reference: ", values.references[i].id)
                }
            })
        }
        for (let i = 0; i < values.authors.length; i++) {
            fetch("http://localhost:5211/api/Relations/Writes/" + values.authors[i].id + "/" + exercise.id, { method: "POST" }).then(r => {
                if (!r.ok) {
                    alert("An error occured while adding author: ", values.authors[i].id)
                }
            })
        }
        for (let i = 0; i < values.reviewers.length; i++) {
            fetch("http://localhost:5211/api/Relations/Reviews/" + values.reviewers[i].id + "/" + exercise.id, { method: "POST" }).then(r => {
                if (!r.ok) {
                    alert("An error occured while adding reviewer: ", values.reviewers[i].id)
                }
            })
        }
        setExerciseID(exercise.id);
        actions.setSubmitting(false);
        setActiveStep(activeStep + 1);
        

    }

    function _handleSubmit(values, actions) {
        if (isLastStep) {
            _submitForm(values, actions);
        } else {
            setActiveStep(activeStep + 1);
            actions.setTouched({});
            actions.setSubmitting(false);
        }
    }

    function _handleBack() {
        setActiveStep(activeStep - 1);
    }

    const [exerciseID,setExerciseID] = useState(0);

    const [exerciseData, setExerciseData] = useState({
        title: "",
        description: "",
        date: "",
        link:"",
        categories: [],
        references: [],
        authors: [],
        reviewers: [],

    });

    const exerciseValidationSchema = Yup.object().shape({
        title: Yup.string().required("The title is required"),
        description: Yup.string().required("Description is required"),
        date: Yup.date().required("The date is required"),
        link: Yup.string().matches('http(s)?://.*',"http(s) is required"),
        
    })


    return (

        <Container component="main"  >
            <CssBaseline />
            <React.Fragment>
                <Typography component="h1" variant="h4" align="center" sx={{ m: 2 }}>
                    Register Exercise
                </Typography>
                <Stepper activeStep={activeStep} >
                    {steps.map(label => (
                        <Step key={label}>
                            <StepLabel>
                                {
                                    <Typography sx={{
                                        display: { xs: 'none', md: "block" },
                                    }}>
                                        {label}
                                    </Typography>
                                }
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <React.Fragment>
                    {activeStep === steps.length ? (
                        <>
                            <Typography component="h1" variant="h2" align="center">
                                <CheckCircleOutlineRoundedIcon color="success" sx={{ fontSize: 100, mt: 10 }} />
                                <br />
                                Exercise successfully created
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ mt: 7, fontSize: 20, textDecoration: "none" }}
                                onClick={() => { navigate("/ExerciseInfoPage/" + exerciseID) }}
                            >
                                View Exercise
                            </Button>
                        </>
                    ) : (
                        <Formik
                            initialValues={
                                exerciseData
                            }
                            enableReinitialize
                            validationSchema={exerciseValidationSchema}
                            onSubmit={_handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form id={"cvForm"}>
                                    {_renderStepContent(activeStep)}

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-around",
                                            mb: 5
                                        }}
                                    >
                                        {activeStep !== 0 && (
                                            <Button onClick={_handleBack} variant="outlined" size="large" >
                                                Back
                                            </Button>
                                        )}
                                        <div >
                                            <Button
                                                disabled={isSubmitting}
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                            
                                            >
                                                {isLastStep ? 'Save changes' : 'Next'}
                                            </Button>
                                            {isSubmitting && (
                                                <CircularProgress
                                                    size={24}
                                                    sx={{ ml: 4 }}

                                                />
                                            )}
                                        </div>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    )}
                </React.Fragment>
            </React.Fragment>

        </Container >
    );
}
