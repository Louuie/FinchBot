import * as React from 'react';
import axios from 'axios';
import { SongArray, Songs } from "../../../interfaces/SongInterface";
import { Row } from "./Row";


 export function Table ({data} : SongArray) {
  const [songDeleteStatus, setSongDeleteStatus] = React.useState(false);
  const [songDeletedTitle, setDeletedTitle] = React.useState('');

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

    return (
      <table>
        <tbody>
          {data.map((song : Songs) =>
          <Row Id={song.Id} Title={song.Title} Artist={song.Artist} Userid={song.Userid} Duration={song.Duration} Videoid={song.Videoid}/> 
          )}
        </tbody>
      </table>
    )
  }