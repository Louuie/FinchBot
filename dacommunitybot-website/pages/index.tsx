import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import axios from 'axios';

interface Songs {
  artist: string, 
  duration: number,
  id: number,
  title: string,
  userid: string,
  videoid: string,
}

const Home: NextPage = () => {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    let ignore = false;
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
   <div>
     {songs.map((song : Songs) => 
      <div key={song.id}>
        ID: {song.id}<br></br>
        Title: {song.title}<br></br>
        Channel/Artist: {song.artist}<br></br>
        Requested By: {song.userid}
      </div>
     )}
   </div>
  )
}

export default Home
