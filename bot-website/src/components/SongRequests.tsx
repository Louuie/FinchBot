import * as React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { DrawerMenu } from '../components/DrawerMenu';
import axios from 'axios';
import { Table } from './SongTable/Table/Table';
import { Songs } from '../interfaces/SongInterface';

// <div onClick={() => {deleteSong(initialSong.Id, initialSong.Title); setSongs(songs.filter((song : Songs) => song.Id !== initialSong.Id));}}>X</div>
export const SongRequests: React.FC = () => {
  const [songs, setSongs] = React.useState([]);
  const [streamer, setStreamerName] = React.useState('');
  const [songDeleteStatus, setSongDeleteStatus] = React.useState(false);
  const [songDeletedTitle, setDeletedTitle] = React.useState('');

  React.useEffect(() => {
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
  }, [songs]);

  const deleteSong = async (id: number, title: string) => {
    if (songDeleteStatus === false) {
      const deletedSongResponse = await axios.get('http://localhost:3030/song-request-delete', {
        params: {
          channel: 'louiee_tv',
          id: id,
        }
      })
      if (deletedSongResponse.data) setSongDeleteStatus(true); setDeletedTitle(title); setTimeout(() => setSongDeleteStatus(false), 2000);
    }
  }

  // Table Component
  const Table: React.FC = () => {
    return (
      <table>
      <tbody>
        {songs.map((initialSong: Songs) =>
        <tr>
          <td>{initialSong.Id}</td>
          <td>{initialSong.Title}</td>
          <td>{initialSong.Artist}</td>
          <td>{initialSong.Userid}</td>
          <td>{initialSong.Duration}</td>
          <td>{initialSong.Videoid}</td>
          <td onClick={() => {deleteSong(initialSong.Id, initialSong.Title); setSongs(songs.filter((song : Songs) => song.Id !== initialSong.Id));}}>X</td>
        </tr> 
        )}
      </tbody>
    </table>
    )
  }


  // Row Component
  const Row: React.FC<Songs> = ({Id, Title, Artist, Userid, Duration, Videoid}) => {
    return (
      <tr>
        <td>{Id}</td>
        <td>{Title}</td>
        <td>{Artist}</td>
        <td>{Userid}</td>
        <td>{Duration}</td>
        <td>{Videoid}</td>
      </tr>
    )
  }


  return (
   <div className='flex justify-center w-full h-full'>
     <DrawerMenu name={streamer}/>
     <div className='flex-1 text-gray-300 ml-[17rem] mt-2'>
      <Table/>
     </div>
     { songDeleteStatus ? 
     <div>
      <Alert severity='success'>
        <AlertTitle>Success</AlertTitle>Successfully deleted {songDeletedTitle} from the song queue.</Alert>
    </div> : <></> }
   </div>
  )
}