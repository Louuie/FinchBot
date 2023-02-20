import * as React from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Transition } from "./Transitions";
export const FormDialog: React.FC = () => {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  const queryRef = React.useRef<HTMLInputElement>(null);

  const handleAddSongClick = () => setOpen1(true);
  const handleAddSongClose = () => setOpen1(false);

  const handleDisableClick = () => setOpen2(true);
  const handleDisableClose = () => setOpen2(false);

  const handleClearQueueClick = () => setOpen3(true);
  const handleClearQueueClose = () => setOpen3(false);

  const onSubmit = () => {
    axios
      .get("http://localhost:3030/song-request", {
        params: {
          channel: "Louiee_tv",
          user: "testuser4588",
          q: queryRef.current?.value,
        },
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex">
      <hr />
      <div className="flex flex-1 justify-center items-center">
        <div className="text-gray-200 text-3xl mr-[31rem] font-poppins">
          Song Requests
        </div>
      </div>
      <div className="mr-[29.5rem]">
        <Button
          variant="contained"
          className="bg-[#127707] text-gray-200 mr-2 mt-4"
          onClick={handleAddSongClick}
        >
          <AddIcon fontSize="small" />
          Add Song
        </Button>
        <Button
          variant="contained"
          className="bg-[#127707] text-gray-200 mr-2 mt-4"
          onClick={handleDisableClick}
        >
          <PowerSettingsNewIcon fontSize="small" />
          Disable
        </Button>
        <Button
          variant="contained"
          className="bg-[#127707] text-gray-200 mr-2 mt-4"
          onClick={handleClearQueueClick}
        >
          <DeleteForeverIcon fontSize="small" />
          Clear Queue
        </Button>
      </div>

      <Dialog open={open1} onClose={handleAddSongClose} TransitionComponent={Transition}>
        <DialogTitle>Add Song to Queue</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can enter a direct url from YouTube or a term to search for the
            closest match is chosen, and the search is performed on YouTube.
          </DialogContentText>
          <TextField
            inputRef={queryRef}
            autoFocus
            margin="dense"
            label="Query"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddSongClose}>Cancel</Button>
          <Button
            onClick={() => {
              onSubmit();
              handleAddSongClose();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open2}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDisableClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisableClose}>Disagree</Button>
          <Button onClick={handleDisableClose}>Agree</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
