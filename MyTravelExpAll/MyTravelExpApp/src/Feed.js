import { Paper, IconButton, Divider, InputBase, Box, Chip, Container, Grid, CssBaseline, TextField, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Menu as MenuIcon, Directions as DirectionsIcon, AddCircle as SearchIcon } from "@mui/icons-material";
import PostCard from "./components/Feed/PostCard";
import { NavLink, useNavigate } from 'react-router-dom';

export default function Feed() {
    const [destinations, setDestinations] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(-1);

    const getDestinations = async () => {
        const result = await fetch("http://localhost:5222/api/Home/GetDestinations");
        const data = await result.json();
        setDestinations(data.destinations);
        if (data.destinations.length > 0) {
            setSelectedDestination(data.destinations[data.destinations.length - 1].id);
            getPosts(data.destinations[data.destinations.length - 1].id);
        }
    }

    const getPosts = async (destinationID, postreq = "GetDestinationPosts/") => {
        console.log("http://localhost:5222/api/Home/" + postreq + destinationID)
        const result = await fetch("http://localhost:5222/api/Home/" + postreq + destinationID);
        const data = await result.json();
        setPosts([]);
        setPosts(data.posts);
        console.log(data.posts);
    }

    const getUsername = async () => {
        const resp = await fetch("http://localhost:5222/api/Home/GetUsername/" + localStorage.getItem("userID"));
        const data = await resp.json();
        setUsername(data.username);
    }

    const navigate = useNavigate();

    useEffect(() => {
        getDestinations();
        getUsername();
    }, []);

    const [username, setUsername] = useState("");
    const [sorted, setSorted] = useState(false);

    return (
        <>
            <CssBaseline />
            <Box
                sx={{ position: "sticky", width: "97%", p: 1.7 }}
            >
                <Container sx={{ alignItems: "flex-start", display: "flex", gap: 1.5, overflowX: "scroll", borderBottom: "1px solid gray" }}>
                    {
                        destinations.map(destination => (
                            <Chip
                                label={destination.name}
                                key={destination.id}
                                variant={destination.id == selectedDestination ? "outlined" : "filled"}
                                sx={{ cursor: "pointer" }}
                                onClick={() => { setSelectedDestination(destination.id); getPosts(destination.id); }}
                            />
                        ))
                    }
                    <Paper
                        component="form"
                        sx={{ display: 'flex', alignItems: 'center', width: 150, height: "32px" }}
                        variant="outlined"
                    >

                        <InputBase
                            sx={{ ml: 1, flex: 1, mt: 0.5, fontSize: "14px" }}
                            placeholder="New Destination"
                            inputProps={{ 'aria-label': 'search google maps' }}
                            size="small"
                            id="new_destination_input"
                        />
                        <IconButton type="button" sx={{ height: "30px" }} aria-label="search"
                            onClick={() => {
                                //console.log(document.getElementById("new_destination_input").value)
                                const catName = document.getElementById("new_destination_input").value;
                                if (catName == null || catName == undefined || catName == "")
                                    return;
                                fetch("http://localhost:5222/api/Home/CreateDestination/" + encodeURIComponent(catName), {
                                    method: "POST"
                                })
                                    .then(resp => {
                                        if (resp.ok) {
                                            getDestinations();
                                            document.getElementById("new_destination_input").value = "";
                                        }
                                    })
                            }}
                        >
                            <SearchIcon />
                        </IconButton>

                    </Paper>
                </Container>
            </Box>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex" }}>
                            <Typography variant="h3" sx={{ fontStyle: "italic" }}>{"Welcome, "}</Typography>
                            <Typography variant="h3" sx={{ fontWeight: "1000", ml: 2 }} color="#32CD32">{" @" + username }</Typography>
                        </Box >
                        <Button size="large" variant="outlined" onClick={() => { navigate("/AddPost") }} sx={{ mr: 2, mt: 2 }}>Write something </Button>
                        <Button size="large" variant={sorted ? "contained" : "outlined"} onClick={() => {
                            getPosts(selectedDestination, sorted ? "GetDestinationPosts/" : "GetDestinationPostsSorted/");
                            setSorted(!sorted);
                        }} sx={{ mr: 2, mt: 2 }}>{"Sort by " + (sorted ? "date" : "popularity")} </Button>
                    </Grid>

                    {
                        posts.length > 0 ?
                            posts.map((post, index) => (
                                <Grid item xs={12} key={index}>
                                    <PostCard
                                        text={post.text}
                                        time={post.time}
                                        authorID={post.authorID}

                                        postID={post.id}
                                    />
                                </Grid>
                            )) :
                            <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 5 }}>
                                <Typography variant="h4">Looks like there are no posts about this destination... </Typography>
                            </Box >
                    }
                </Grid >
            </Container>
        </>
    )
}