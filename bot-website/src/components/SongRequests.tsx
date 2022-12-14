import { useEffect, useState } from 'react'
import { DrawerMenu } from '../components/DrawerMenu';
import axios from 'axios';

interface Songs {
  Artist: string, 
  Duration: number,
  Id: number,
  Title: string,
  Userid: string,
  Videoid: string,
}

export const SongRequests: React.FC = () => {
  const [songs, setSongs] = useState([]);
  const [streamer, setStreamerName] = useState('');
  const deleteSong = async (id: number) => {
    const deletedSongResponse = await axios.get('http://localhost:3030/song-request-delete', {
      params: {
        channel: 'louiee_tv',
        id: id,
      }
    })
    console.log(deletedSongResponse.data);
  }
  const songMap = songs?.map((song : Songs) =>
    <div key={song.Id} className='text-gray-300 ml-[15.5rem] mt-5'>
      ID: {song.Id}<br></br>
      Title: {song.Title}<br></br>
      Channel/Artist: {song.Artist}<br></br>
      Requested By: {song.Userid}
      <div onClick={() => deleteSong(song.Id)}>X</div>
    </div>
  )
  useEffect(() => {
    let ignore = false;
    const pathname = window.location.pathname.slice(1, 14);
    setStreamerName(pathname);
    const fetchData = async () => {
      const fetchSongs = await axios.get('http://localhost:3030/songs', {
        params: {
          channel: 'louiee_tv'
        }
      })
      if (!ignore) setSongs(fetchSongs.data.songs);
    }
    fetchData();
    return () => {
      ignore = true;
    }
  }, [])
  return (
   <div className='flex'>
     <DrawerMenu name={streamer}/>
     <div className='flex-col bg-gray-800 h-full text-gray-300'>{songMap}</div>
   </div>
  )
}