import * as React from 'react';
import { SongTable } from '../SongTable';
import { SongPlayer } from '../SongPlayer';
import { FormDialog } from '../mui/FormDialog';
import { ResponsiveAppBar } from '../mui/ResponsiveAppBar';
import { AuthenticationStatusInterface } from '../../interfaces/Auth';
import axios from 'axios';
import { SongArray, Songs } from '../../interfaces/Songs';
import { useParams } from 'react-router-dom';
import { Settings } from '../../interfaces/Settings';


export const SongRequests: React.FC<AuthenticationStatusInterface> = ({authenticated}) => {

  const params = useParams();
  // State variables
  // Variable used for SongPlayer for the firstSong in the queue
  const [song, setSong] = React.useState<Songs>({Title: '', Artist: '', DurationInSeconds: 0, Videoid: '', Userid: '', Id: 0});
  const [songs, setSongs] = React.useState<Songs[]>([]);

  // State variables for the Song Queue Settings
  const [ songQueueSettings, setSongQueueSettings ] = React.useState<Settings>({channel: params.streamer, status: false, song_limit: 20, user_limit: 2});
  

  // useEffect for the SongPlayer so that way we don't have to fetch this data in that individual component rather we can pass it down
  React.useEffect(() => {
    const fetchSong = setInterval(() => {
      axios.get('https://finchbot-backend-2ef58bf717e6.herokuapp.com/songs', {
        params: {
          channel: params.streamer,
        }
      }).then((res) => { const songDD = res.data.songs; setSongs(songDD); if(songs.length > 0) setSong(songDD[0]);}).catch((err) => console.log(err));
    }, 3000);
    return () => clearInterval(fetchSong)
  }, [song, songs]);

  // useEffect for the FormDialog that fetches the Song Queue Settings
  React.useEffect(() => {
    const fetchSongQueueSettings = setInterval(() => {
      axios.get('https://finchbot-backend-2ef58bf717e6.herokuapp.com/song-queue-settings', {
        params: {
          channel: params.streamer+"_settings",
        }
      }).then((res) => setSongQueueSettings(res.data.settings[0])).catch((err) => console.log(err));
    }, 3000)
      return () => clearInterval(fetchSongQueueSettings)
  }, [song, songs, songQueueSettings, params.streamer])



  return (
    <div className='w-full min-h-screen md:min-h-screen xl:min-h-screen xxxl:min-h-screen bg-[#292929]'>
        <ResponsiveAppBar authenticated={authenticated}/> 
        <div className='flex flex-col w-full h-full'>
          <FormDialog Streamer={params.streamer as string} songs={songs} authenticated={authenticated} status={songQueueSettings?.status} song_limit={songQueueSettings?.song_limit} user_limit={songQueueSettings?.user_limit}/>
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