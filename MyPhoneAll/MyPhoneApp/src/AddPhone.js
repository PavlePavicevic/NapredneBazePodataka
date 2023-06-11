import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { ThemeProvider, useTheme } from '@mui/material/styles';
import {
    Button,
    Typography,
    TextField,
    Container,
    CssBaseline,
    Box,
    Select,
    MenuItem,
    Radio,
    Grid,
    Paper,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import RadioGroup from '@mui/material/RadioGroup';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';

export default function AddPhone(props) {
    const theme = useTheme();

    const navigate = useNavigate();

    const { id } = useParams();

    async function _submitForm(values, actions) {

        const response = await fetch(
            "http://localhost:5100/api/Phone/AddPhone",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({"id":"", 
                "name": phoneName, 
                "description": phoneDescription,  
                "photos":[],  
                "phoneType": phoneType, 
                "price": phonePrice,
                "cashOnly": phoneCashOnly, 
                })
            }
        )
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            const response2 = await fetch(
                "http://localhost:5100/api/Seller/AddPhoneToSeller/" +
                data.id + "/"+id,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                      },
                    
                }
            )
            navigate("/AddedPhoneToSeller");
        }
    }

    const [phoneName, setPhoneName] = useState("");

    const [phoneDescription, setPhoneDescription] = useState("");


    const [phoneType, setPhoneType] = useState("");

    const [phonePrice, setPhonePrice] = useState(0);

    const [phoneCashOnly, setPhoneCashOnly] = useState(true);


    // const handleSubmit = () => console.log(textValue);




    const handlePNChange = (event) => {
        setPhoneName(event.target.value);
    }
    const handlePDChange = (event) => {
        setPhoneDescription(event.target.value);
    }


    const handlePTypeChange = (event) => {
        setPhoneType(event.target.value);
    }


    const handlePPriceChange = (event) => {
        setPhonePrice(event.target.value);
    }


    const handlePPetFChange = (event) => {
        setPhoneCashOnly(event.target.value);
    }


    return (

        <Container component="main"  >
            <CssBaseline />
            <React.Fragment>
                <Typography component="h1" variant="h4" align="center" sx={{ m: 2 }}>
                    Add new phone
                </Typography>
                <Paper
                    sx={{ p: 3, mb: 4, backgroundColor: theme.palette.mode === 'dark' ? "#3a3b3c" : "whitesmoke", }}
                    variant="outlined"
                >
                    <Typography component="h1" variant="h6" align="center" sx={{ m: 2 }}>
                        Fill out the following fields in order to post a new phone ad on our website!
                    </Typography>
                </Paper>
                <Paper
                    sx={{ p: 3, mb: 4 }}
                    variant="outlined"
                >

                <Grid item xs={12} style={{ top: 10, alignItems: "center", justifyContent: "center" }}>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <Typography component="subtitle1" align="center" sx={{ m: 2 }}> What type of phone are you listing? </Typography>
                                <Select fullWidth
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={phoneType}
                                    onChange={handlePTypeChange}
                                >
                                    <MenuItem value={0}>Mobile</MenuItem>
                                    <MenuItem value={1}>Tablet</MenuItem>
                                </Select>
                            </FormControl>

                </Grid>

                <Grid item xs={12} style={{ top: 10,alignItems: "center", justifyContent: "center" }}>
                        <Typography align="center" sx={{ m: 2 }}> What is the name of the phone? </Typography>
                        <TextField onChange={(event) => handlePNChange(event)} name={"phoneName"} label={"Enter phone name"} fullWidth />

                </Grid>

                <Grid item xs={12} style={{ top: 10,alignItems: "center", justifyContent: "center" }}>
                        <Typography align="center" sx={{ m: 2 }}> Provide a short description of the phone </Typography>
                        <TextField multiline rows={5} onChange={(event) => handlePDChange(event)} name={"phoneDecsription"} label={"Enter phone description"} fullWidth />

                </Grid>


                <Grid item xs={12} style={{ top: 10,alignItems: "center", justifyContent: "center" }}>
                        <Typography align="center" sx={{ m: 2 }}> Please provide a price of the phone </Typography>
                        <TextField onChange={(event) => handlePPriceChange(event)} name={"phonePrice"} label={"Please provide a price of the phone"} fullWidth />

                </Grid>


                <Grid container xs={12} style={{ top: 10, alignItems: "center", justifyContent: "center" }}>
                            <Typography component="subtitle1" align="center" sx={{ m: 2 }}> Is the phone cash only? </Typography>
                            <FormControl style={{ alignItems: "column", justifyContent: "column" }}>
                                <RadioGroup style={{ alignItems: "column", justifyContent: "column" }}
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={phoneCashOnly}
                                    onChange={handlePPetFChange}
                                >
                                    <Grid style={{ display: "inline-block" }}>
                                        <FormControlLabel value="true" control={<Radio onChange={handlePPetFChange} />} label="Yes" />
                                        <FormControlLabel value="false" control={<Radio onChange={handlePPetFChange} />} label="No" />
                                    </Grid>

                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid container xs={12} style={{ top: 10, alignItems: "center", justifyContent: "center" }}>
                            <Typography component="subtitle1" align="center" sx={{ m: 2 }}> Are basic living expenses covered? </Typography>
                            <FormControl style={{ alignItems: "column", justifyContent: "column" }}>
                                <RadioGroup style={{ alignItems: "column", justifyContent: "column" }}
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"

                                >

                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Button onClick={_submitForm}
                            variant="contained" endIcon={<SendIcon />}> Submit listing </Button>
                    {/* </Box> */}
                </Paper>

            </React.Fragment>
        </Container>
    );
}