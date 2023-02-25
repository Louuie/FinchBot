import * as React from 'react';
import { DrawerMenu } from '../ui/DrawerMenu';
import { SongTable } from '../SongTable';
import { SongPlayer } from '../SongPlayer';
import { FormDialog } from '../mui/FormDialog';
import { ResponsiveAppBar } from '../mui/ResponsiveAppBar';
import { AuthenticationStatusInterface } from '../../interfaces/Auth';
import axios from 'axios';
import { SongArray, Songs } from '../../interfaces/Songs';


export const SongRequests: React.FC<AuthenticationStatusInterface> = ({authenticated}) => {

  // State variables
  // Variable used for SongPlayer for the firstSong in the queue
  const [song, setSong] = React.useState<Songs>();
  const [songs, setSongs] = React.useState<Songs[]>([]);

  // useEffect for the SongPlayer so that way we don't have to fetch this data in that individual component rather we can pass it down
  React.useEffect(() => {
    const fetchSong = setInterval(() => {
      axios.get('http://localhost:3030/songs', {
        params: {
          channel: 'louiee_tv'
        }
      }).then((res) => { const songDD = res.data.songs; setSongs(songDD); console.log(songs);  setSong(songDD[0]); }).catch((err) => console.log(err));
    }, 3000);
    return () => clearInterval(fetchSong)
  }, [song, songs])



  return (
    <div className='w-full h-screen bg-[#292929]'>
        <ResponsiveAppBar authenticated={authenticated}/> 
        <div className='flex flex-col w-full h-full'>
          <FormDialog authenticated={authenticated}/>
          <div className='flex justify-center align-middle items-center'>
            <SongPlayer Id={song?.Id || 0} Videoid={song?.Videoid} Title={song?.Title} Artist={song?.Artist} Duration={song?.Duration} Userid={song?.Userid}  />
          </div>
          <div className='flex flex-1 items-center align-top md:align-middle text-gray-300 md:mb-[32rem] mb-[47rem] sm:mb-[69rem]'>
            <SongTable songs={songs}/>
          </div>
        </div>
   </div>
  )
}