import { Grid, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PaperCard from "./PaperCard";

export default function PhoneList({ PhoneIDs }) {
  const [infos, setInfos] = useState([]);
  const theme = useTheme();

  const { id } = useParams();

 
  useEffect(() => {
    // getInformations();
  }, []);

  return (
    <Grid container spacing={3}>
      {console.log(PhoneIDs)}
      {PhoneIDs.map((info, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <PaperCard
            info={info}
            index={index}
          />
          
        </Grid>
      ))}
    </Grid>
  );
}
