import * as React from 'react';
import { SongTable } from '../SongTable';
import { SongPlayer } from '../SongPlayer';
import { FormDialog } from '../mui/FormDialog';
import { ResponsiveAppBar } from '../mui/ResponsiveAppBar';
import { AuthenticationStatusInterface } from '../../interfaces/Auth';
import axios from 'axios';
import { SongArray, Songs } from '../../interfaces/Songs';
import { useParams } from 'react-router-dom';


export const SongRequests: React.FC<AuthenticationStatusInterface> = ({authenticated}) => {

  // State variables
  // Variable used for SongPlayer for the firstSong in the queue
  const [song, setSong] = React.useState<Songs>({Title: '', Artist: '', DurationInSeconds: 0, Videoid: '', Userid: '', Id: 0});
  const [songs, setSongs] = React.useState<Songs[]>([]);
  
  const params = useParams();

  const blankObj = {Title: '', Artist: '', DurationInSeconds: 0, Videoid: '', Userid: '', Id: 0};

  // useEffect for the SongPlayer so that way we don't have to fetch this data in that individual component rather we can pass it down
  React.useEffect(() => {
    const fetchSong = setInterval(() => {
      axios.get('http://localhost:3030/songs', {
        params: {
          channel: params.streamer,
        }
      }).then((res) => { const songDD = res.data.songs; setSongs(songDD); if(songs.length > 0) setSong(songDD[0]);}).catch((err) => console.log(err));
    }, 3000);
    return () => clearInterval(fetchSong)
  }, [song, songs])



  return (
    <div className='w-full h-screen md:h-screen xxxl:h-screen bg-[#292929] overflow-hidden'>
        <ResponsiveAppBar authenticated={authenticated}/> 
        <div className='flex flex-col w-full h-full'>
          <FormDialog Streamer={params.streamer as string} songs={songs} authenticated={authenticated}/>
          <div className='flex justify-center align-middle items-center'>
            <SongPlayer Streamer={params.streamer as string} songs={songs} Id={song?.Id} Videoid={song?.Videoid} Title={song?.Title} Artist={song?.Artist} DurationInSeconds={song?.DurationInSeconds} Userid={song?.Userid}  />
          </div>
          <div className='flex flex-1 items-start align-top lg:items-center lg:align-middle xl:items-center xl:align-middle xxl:items-center xxl:align-middle xxxl:items-center xxxl:align-middle text-gray-300 lg:mb-[12rem] lg:-my-6 xxl:my-1 xxxl:my-2 xxl:mb-[12rem] xxxl:mb-[24rem]'>
            <SongTable Streamer={params.streamer as string} songs={songs} authenticated={authenticated}/>
          </div>
        </div>
   </div>
  )
}