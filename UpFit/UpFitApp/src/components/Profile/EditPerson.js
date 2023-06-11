import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Typography, TextField, Box, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/EditRounded";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function EditStudentProfileDialog({
    currentId,
    currentName,
    currentSurname,
    currentPicture,
    currentContact,
    update,
}) {
    const [open, setOpen] = React.useState(false);

    const { id } = useParams();

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleSelectImage = () => {
        setFilename(fileInput.current.files[0].name);
    };

    const handleClose = () => {
        setOpen(false);
    };


    async function handleSubmit() {
        console.log(id, name, surname, contact);
        const response = await fetch(
            "http://localhost:5211/api/Person/UpdatePerson/" +
            id +
            "/"+
            name +
            "/" +
            surname +
            "/" +
            contact,
            {
                method: "PUT",
                credentials: "include",
            }
        )

        setOpen(false)

        if(!response.ok) {
            alert("[Error occured] Could not update person")
            return
        }
    };

    
    const [name, setName] = useState(currentName);
    const [surname, setSurname] = useState(currentSurname);
    const [contact, setContact] = useState(currentContact);
    const fileInput = React.createRef();

    const [filename, setFilename] = useState(currentPicture);
    //console.log(filename)
    React.useEffect(() => {
        setName(currentName);
        setSurname(currentSurname);
        setFilename(currentPicture);
        setContact(currentContact);
    }, [currentSurname, currentName, currentPicture, currentContact]);

    return (
        <div>
            <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleClickOpen}
            >
                Edit profile
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Edit profile info"}</DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        value={name}
                        required
                        error={name === undefined || name === ""}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Surname"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setSurname(e.target.value);
                        }}
                        value={surname}
                        required
                        error={surname === undefined || surname === ""}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Contact"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setContact(e.target.value);
                        }}
                        value={contact}
                        required
                        error={contact === undefined || contact === ""}
                    />
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        autoFocus
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


