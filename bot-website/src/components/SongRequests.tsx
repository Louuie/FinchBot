import { useEffect, useState } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { DrawerMenu } from '../components/DrawerMenu';
import axios from 'axios';
import { Table } from './SongTable/Table/Table';

// <div onClick={() => {deleteSong(initialSong.Id, initialSong.Title); setSongs(songs.filter((song : Songs) => song.Id !== initialSong.Id));}}>X</div>
export const SongRequests: React.FC = () => {
  const [songs, setSongs] = useState([]);
  const [streamer, setStreamerName] = useState('');

  useEffect(() => {
    const pathname = window.location.pathname.slice(1, 14);
    setStreamerName(pathname);
    const fetchSongs = setInterval(() => {
      axios.get('http://localhost:3030/songs', {
        params: {
          channel: 'louiee_tv'
        }
      }).then((res) => setSongs(res.data.songs)).catch((err) => console.log(err))
    }, 5000);
    return () => clearInterval(fetchSongs);
  }, [songs])
  return (
   <div className='flex justify-center w-full h-full'>
     <DrawerMenu name={streamer}/>
     <div className='flex-1 text-gray-300 ml-[17rem] mt-2'>
      <Table data={songs}/>
     </div>
     { songDeleteStatus ? 
     <div>
      <Alert severity='success'>
        <AlertTitle>Success</AlertTitle>Successfully deleted {songDeletedTitle} from the song queue.</Alert>
    </div> : <></> }
   </div>
  )
}