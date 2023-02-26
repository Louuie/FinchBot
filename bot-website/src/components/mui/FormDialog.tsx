import * as React from "react";
import axios from "axios";
import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormGroup,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Transition } from "./Transitions";
import { AuthenticationStatusInterface } from "../../interfaces/Auth";
import { SongArray, SongEntry, Songs } from "../../interfaces/Songs";

type Props = AuthenticationStatusInterface | SongArray;

export const FormDialog: React.FC<Props> = (props) => {
  const { authenticated } = props as AuthenticationStatusInterface;

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
          user: "testuser4588",
          q: queryRef.current?.value,
        },
      }).then((res) => {
        const song : SongEntry = res.data.data[0];
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
    <Container className="flex w-full md:w-full" maxWidth={false}>
      <hr />
      <div className="flex flex-1 justify-start items-start mx-2">
        <Typography textAlign="center" variant="h4">Song Requests</Typography>
      </div>
      {authenticated
        ?
        <div>
          <Container className="hidden md:visible md:flex flex-1 items-end justify-end w-full md:mx-6" maxWidth={false}>
            <FormGroup>
              <Switch color="success" defaultChecked />
            </FormGroup>
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
              <PowerSettingsNewIcon fontSize="small" />
              Disable Queue
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


      <Snackbar open={successSnackBarStatus} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {`"${newSongTitle}" has been added to the queue!`}
        </Alert>
      </Snackbar>

      <Snackbar open={errorSnackBarStatus} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
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
        <DialogTitle>{"Clear Queue"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to disable the queue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClearQueueClose}>Cancel</Button>
          <Button color="success" onClick={handleClearQueueClose}>Disable</Button>
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
          <Button color="success" onClick={handleClearQueueClose}>Clear</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
