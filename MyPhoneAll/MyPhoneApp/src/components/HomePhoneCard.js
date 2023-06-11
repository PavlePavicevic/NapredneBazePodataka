import { Button, Card, Divider, Typography, Grid, Checkbox, CardMedia, Box } from "@mui/material";

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { useNavigate } from "react-router-dom";


export default function PhoneCard({
    id, name, photo, description, price
}) {

    const navigate = useNavigate();
    
    return (
        <Card  >
            <CardMedia
                component="img"
                onClick={()=>{navigate("/PhoneProfile/"+id)}}
                image={photo}
                alt="MyPhoneCopyright"
            />

            <Grid container spacing={0} sx={{ p: 2 }} >

                <Grid item xs={12} md={8} >
                    <Typography
                        align="left"
                        variant="h5"
                        sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            color: "#0071C2",
                            fontWeight: "bold"
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography
                        align="left"
                        variant="body2"
                        sx={{ p: 1 }}
                    >
                        {description}
                    </Typography>

                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={{ display: "flex", gap: 0, flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                        
                        <Typography
                            align="left"
                            variant="h4"
                            sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
                            color="error"
                        >
                            <AttachMoneyIcon color="error" fontSize="large" />
                            {price}
                        </Typography>

                    </Box>
                </Grid>
            </Grid>
        </Card>
    )
}