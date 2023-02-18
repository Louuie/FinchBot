import * as React from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
export const FormDialog: React.FC = () => {

    const [open, setOpen] = React.useState(false);
    const queryRef = React.useRef<HTMLInputElement>(null);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onSubmit = () => {
        axios.get('http://localhost:3030/song-request', {
            params: {
                channel: 'Louiee_tv',
                user: 'testuser4588',
                q: queryRef.current?.value,
            }
        }).catch((err) => console.log(err));
    }

    return (
        <div className='flex'>
            <hr/>
            <div className='flex flex-1'>
                <div className='text-gray-200 text-3xl ml-4 font-poppins'>Song Requests</div>
            </div>
            <Button variant="contained" className='bg-[#127707] text-gray-200 mr-2 mt-4' onClick={handleClickOpen} >
                <AddIcon fontSize='small'/>
                Add Song
            </Button>
            <Button variant="contained" className='bg-[#127707] text-gray-200 mr-2 mt-4' onClick={handleClickOpen} >
                <PowerSettingsNewIcon fontSize='small'/>
                Disable
            </Button>
            <Button variant="contained" className='bg-[#127707] text-gray-200 mr-2 mt-4' onClick={handleClickOpen} >
                <DeleteForeverIcon fontSize='small'/>
                Clear Queue
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Song to Queue</DialogTitle>
                <DialogContent>
                    <DialogContentText>You can enter a direct url from YouTube or a term to search for the closest match is chosen, and the search is performed on YouTube.</DialogContentText>
                    <TextField inputRef={queryRef} autoFocus margin='dense' label='Query' fullWidth variant='standard'/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => { onSubmit(); handleClose(); }}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}