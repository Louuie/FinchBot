import axios from "axios";
import * as React from "react"
import { ClockFill, Link45deg, PersonFill } from "react-bootstrap-icons";
import YouTube from "react-youtube";
import {Songs} from "../interfaces/Songs";




export const SongPlayer: React.FC = () => {

    
  // State variable used for songs?
  const [firstSong, setFirstSong] = React.useState<Songs | null>(null);

  // Setting the options for the YouTube Video Player.
  const youtubeOpts = {
    height: '250',
    width: '380',
    playerVars: {
      autoplay: 1,
    }
  };

  // useEffect that fetches the videoID of the Song/Video in the first position.
  React.useEffect(() => {
    const fetchSong = setInterval(() => {
      axios.get('http://localhost:3030/songs', {
        params: {
          channel: 'louiee_tv'
        }
      }).then((res) => { setFirstSong(res.data.songs[0]);  }).catch((err) => console.log(err))
    }, 3000);
    return () => clearInterval(fetchSong)
  }, [firstSong]);


  // onEnd function that deletes the song/video that was playing that has "just ended".
  const onSongEnd = (songID: number | undefined): void => {
    axios.get('http://localhost:3030/song-request-delete', {
      params: {
        channel: 'Louiee_tv',
        id: songID,
      }
    }).then((res) => (console.log(res.data))).catch((err) => console.log(err));
  }

  return (
    <div className='flex flex-col h-[25rem] w-[80rem] mt-[14rem] ml-[16rem] bg-gray-800'>
    <div className='flex flex-1 mt-4 ml-2 font-bold text-lg'>Current Song</div>
    <hr className="mb-8"/>
    <div className='flex flex-1 mb-20 px-2'>
      <YouTube videoId={firstSong?.Videoid} opts={youtubeOpts} onEnd={() => onSongEnd(firstSong?.Id)}/>
      <div className='flex flex-col ml-2 h-1'>
        <a className='font-bold text-lg'>{firstSong?.Title}</a>
        <div className='flex flex-1'>
          <ClockFill className='mt-[3px]'/>
          <a className='px-1 text-sm'>{firstSong?.Duration}</a>
        </div>
        <div className='flex flex-1 py-2'>
          <Link45deg className='mt-1'/>
          <a href={`http://youtu.be/${firstSong?.Videoid}`}>{`http://youtu.be/${firstSong?.Videoid}`}</a>
        </div>
        <div className='flex'>
          <PersonFill className='mt-[3px]'/>
          <a>{firstSong?.Userid}</a>
        </div>
      </div>
    </div>
   </div>
  )
}