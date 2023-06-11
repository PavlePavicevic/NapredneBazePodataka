import React, { useState, useEffect } from "react";
import {
    Paper,
    CssBaseline,
    Box,
    Divider,
    Grid,
    Container,
    Button,
    Typography,
    Slider,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import PhoneCard from "./components/Filter/PhoneCard";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import PhoneIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TabletIcon from '@mui/icons-material/Apartment';
import CashIcon from '@mui/icons-material/Pets';

export default function FilterProperties(props) {

    const [data, setData] = useState([]);

    const getData = async () => {
        let req = `http://localhost:5100/api/Phone/FilterPhones?price=$`;
        if (document.getElementById("cashonly").checked) {
            req += "&cashOnly=true";
        }
        if (document.getElementById("mobile").checked && !document.getElementById("mobile").checked) {
            req += "&phoneType=0";
        }
        if (document.getElementById("tablet").checked && !document.getElementById("tablet").checked) {
            req += "&phoneType=1";
        }
        const resp = await fetch(req);
        if (resp.ok) {
            const myphone = await resp.json();
            setData(myphone);
            console.log(req, myphone);
        }
    }

    const [price, setPrice] = React.useState([0, 9999]);

    
    const handleChange = (event, newValue) => {
        setPrice(newValue);
    };


    useEffect(() => {
        getData();
    }, []);

    const navigate = useNavigate();

    return (
        <Container component="main" maxWidth="xl">
            <CssBaseline />
            <React.Fragment>
                <Grid container xs={12} spacing={3} sx={{ pt: 3 }}>
                    <Grid item xs={3} spacing={3} >
                        <Paper variant="outlined" sx={{ position: "sticky", top: 90, p: 3, backgroundColor: "#FEBB02bb", border: "none" }}>
                            City:
                            <TextField fullWidth variant="filled" sx={{ backgroundColor: "white", mb: 3 }} id="city_name" />
                            Price range:
                            <Slider
                                value={price}
                                onChange={handleChange}
                                valueLabelDisplay="on"
                                valueLabelFormat={(value) => "$ " + value}
                                max={9999}
                                min={0}
                                sx={{ mt: 5 }}
                            />
                           
                            <FormGroup sx={{ display: "flex", flexDirection: "row", gap: 2, justifyContent: "center" }}>
                                <FormControlLabel control={<Checkbox defaultChecked id="mobile" icon={<PhoneIcon color="disabled" />} checkedIcon={<PhoneIcon />} />} label="Mobile" />
                                <FormControlLabel control={<Checkbox id="tablet" defaultChecked icon={<TabletIcon color="disabled" />} checkedIcon={<TabletIcon />} />} label="Tablet" />
                            </FormGroup>
                            <FormGroup sx={{ display: "flex", flexDirection: "row", gap: 2, justifyContent: "center" }}>
                                <FormControlLabel control={<Checkbox id="cashonly" defaultChecked icon={<CashIcon color="disabled" />} checkedIcon={<CashIcon />} />} label="Cash Only" />

                            </FormGroup>

                            <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={() => { getData() }}>Filter</Button>
                        </Paper>
                    </Grid>
                    <Grid container item xs={9} spacing={3} sx={{ pt: 3 }}>


                        {
                            data.map(phone => (
                                <Grid item xs={12} key={phone.id}>

                                    <PhoneCard
                                        id={phone.id}
                                        description={phone.description}
                                        photo={phone.photos[0]}
                                        name={phone.name}
                                        price={phone.price}
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
            </React.Fragment>
        </Container>
    );
}
