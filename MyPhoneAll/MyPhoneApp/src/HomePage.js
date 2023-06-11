
import { useState, useEffect } from "react";
import React from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import {
  Paper,
  CssBaseline,
  Box,
  Divider,
  Grid,
  Container,
  Button,
  Typography,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PhoneCard from "./components/HomePhoneCard";



export default function HomePage(props) {

  const theme = useTheme();
  console.log(theme);

  const navigate = useNavigate();

  

  const [search, setSearch] = useState("");

  
  const getData = async () => {
    const resp = await fetch("http://localhost:5100/api/Phone/Top");
    if (resp.ok) {
      const d = await (await resp).json();
      setData(d);
    }
  }

  const update = () => {
    
    props.reloadHeader();
  }

  const [data, setData] = useState([
      { id: "1", name: "Phone Model", description: "Primer opisa", photos: ["https://media.istockphoto.com/id/1161116588/photo/mobile-phone-top-view-with-white-screen.jpg?s=1024x1024&w=is&k=20&c=UyX6B0q_qjj8YHG1UNRhB138blbYuJyDw6Rwm60GSpU="], amenities: ["Pool", "Laundry room", "Sauna", "AC"] },
      { id: "2", name: "Phone Model", description: "Primer opisa", photos: ["https://media.istockphoto.com/id/1161116588/photo/mobile-phone-top-view-with-white-screen.jpg?s=1024x1024&w=is&k=20&c=UyX6B0q_qjj8YHG1UNRhB138blbYuJyDw6Rwm60GSpU="] },
      { id: "3", name: "Phone Model", description: "Primer opisa", photos: ["https://media.istockphoto.com/id/1161116588/photo/mobile-phone-top-view-with-white-screen.jpg?s=1024x1024&w=is&k=20&c=UyX6B0q_qjj8YHG1UNRhB138blbYuJyDw6Rwm60GSpU="] },
    

  ]);

  useEffect(() => {
    getData()
  }, [])

  return (
    <Box sx={{ backgroundImage: "url('" + process.env.PUBLIC_URL + "/images/back.svg')", backgroundSize: "100%" }}>
      <CssBaseline />
      <React.Fragment>


        {}
        <Grid fullwidth style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: 20 }}>

          <Typography variant="h1" style={{ alignSelf: "center", fontWeight: 800, marginTop: 200, color: "white", fontSize: 150 }}> MyPhone</Typography>
          <Button variant="contained" sx={{ backgroundColor: "#FEBB02", fontSize: 42 }} onClick={()=>{navigate("/FilterPhones")}}>Search</Button>
        </Grid>

        <Grid fullwidth style={{ marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "10%" }}>
        </Grid>
        
        <Grid container xs={12} spacing={4} sx={{ p: 10 }}>
          {
            data.map(d => (
              <Grid item xs={12} md={4}>
                <PhoneCard
                  id={d.id}
                  photo={d.photos[0]}
                  price={d.price}
                  name={d.name}
                />
              </Grid>
            ))

          }

        </Grid>


      </React.Fragment>

    </Box>
  );

}