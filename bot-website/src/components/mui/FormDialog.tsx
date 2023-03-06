import * as React from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Transition } from "./Transitions";
import { AuthenticationStatusInterface } from "../../interfaces/Auth";
import { SongArray, SongEntry, Songs } from "../../interfaces/Songs";
import { deleteAllSongs, promoteSong } from "../../api/api";
import { MoveUp } from "@mui/icons-material";

type Props = AuthenticationStatusInterface | SongArray;

export const FormDialog: React.FC<Props> = (props) => {
  const { authenticated } = props as AuthenticationStatusInterface;
  const { songs } = props as SongArray;

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);



  const queryRef = React.useRef<HTMLInputElement>(null);

  const handleAddSongClick = () => setOpen1(true);
  const handleAddSongClose = () => setOpen1(false);

  const handleDisableQueueClick = () => setOpen2(true);
  const handleDisableQueueClose = () => setOpen2(false);



  const handleClearQueueClick = () => setOpen3(true);
  const handleClearQueueClose = () => setOpen3(false);

  const [newSongTitle, setNewSongTitle] = React.useState('');
  const [songEntryErrorMessage, setSongEntryErrorMessage] = React.useState('');


  const [successSnackBarStatus, setSucessSnackBarStatus] = React.useState(false);
  const [errorSnackBarStatus, setErrorSnackBarStatus] = React.useState(false);


  const [song1ID, setSong1ID] = React.useState('');
  const [song1Title, setSong1Title] = React.useState('');
  const [song2ID, setSong2ID] = React.useState('');

  const handleSong1Change = (event: SelectChangeEvent) => {
    setSong1ID(event.target.value as string);
    console.log(song1ID);
  };

  const handleSong2Change = (event: SelectChangeEvent) => {
    setSong2ID(event.target.value as string);
    console.log(song2ID);
  };

  const handleMenuItemClick = (event: any) => {
    console.log(event.nativeEvent.target.outerText);
    setSong1Title(event.nativeEvent.target.outerText);
  }


  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSucessSnackBarStatus(false);
    setErrorSnackBarStatus(false);
  };



  const onSubmit = () => {
    axios
      .get("http://localhost:3030/song-request", {
        params: {
          channel: "Louiee_tv",
          user: 'testuser_'+(Math.random() + 1).toString(36).substring(7),
          q: queryRef.current?.value,
        },
      }).then((res) => {
        const song: SongEntry = res.data.data[0];
        console.log(res.data)
        setNewSongTitle(song.name);
        setSucessSnackBarStatus(true);
      })
      .catch((err) => {
        setErrorSnackBarStatus(true);
        setSongEntryErrorMessage(err.response.data.error);
      });
  };

  return (
    <Container className="flex w-full md:w-full -my-[0.45rem] lg:-my-[0.45rem]" maxWidth={false}>
      <hr />
      <div className="flex flex-1 justify-start items-start mx-2">
        <Typography textAlign="center" variant="h4" className="mt-3">Song Requests</Typography>
      </div>
      {authenticated
        ?
        <div>
          <Container className="hidden md:visible md:flex flex-1 items-end justify-end w-full md:mx-6" maxWidth={false}>
            <Stack direction={"row"}>
              <Typography className="mt-[6px]">Song Queue:</Typography>
              <Switch color="success"/>
            </Stack>
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
              onClick={handleDisableQueueClick}
            >
              <MoveUp fontSize="small" />
              Promote Song
            </Button>
            <Button
              variant="contained"
              className="bg-[#127707] text-gray-200 mr-2 mt-4"
              onClick={handleClearQueueClick}
            >
              <DeleteForeverIcon fontSize="small" />
              Clear Queue
            </Button>
          </Container>
        </div>
        :
        <div className="hidden"></div>
      }

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
            color="success"
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleAddSongClose}>Cancel</Button>
          <Button
            color="success"
            onClick={() => {
              onSubmit();
              handleAddSongClose();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>


      <Snackbar open={successSnackBarStatus} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {`"${newSongTitle}" has been added to the queue!`}
        </Alert>
      </Snackbar>

      <Snackbar open={errorSnackBarStatus} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {`${songEntryErrorMessage}`}
        </Alert>
      </Snackbar>


      <Dialog
        open={open2}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDisableQueueClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Promote Song"}</DialogTitle>
        <DialogContent>
          <Box padding={6}>
            <InputLabel id="demo-simple-select-label">Song #1</InputLabel>
            <Box paddingBottom={2}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={song1ID}
                label="Song #1"
                onChange={handleSong1Change}
              >
                {songs.map((song: Songs) => 
                  <MenuItem value={song.Id} onClick={handleMenuItemClick} key={song.Id}>{song.Title}</MenuItem>
                )}
              </Select>
            </Box>
            <InputLabel id="demo-simple-select-label">Song #2</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={song2ID}
              label="Song #2"
              onChange={handleSong2Change}
            >
              {songs.map((song: Songs) => 
                <MenuItem value={song.Id} key={song.Id}>{song.Title}</MenuItem>
              )}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleDisableQueueClose}>Cancel</Button>
          <Button color="success" onClick={() => { promoteSong(song1Title, Number(song1ID), Number(song2ID)); setOpen2(false); setSong1ID(''); setSong2ID('');  }}>Promote</Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={open3}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClearQueueClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Clear Queue"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to disable the queue? There is no going back!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClearQueueClose}>Cancel</Button>
          <Button color="success" onClick={(() => { deleteAllSongs(); handleClearQueueClose() } )}>Clear</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
