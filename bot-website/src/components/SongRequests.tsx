import * as React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { DrawerMenu } from '../components/DrawerMenu';
import axios from 'axios';
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
  // TODO: Add a Reorder button as well, so two buttons that will move the song/video either up or down in the queue depending on what button you press.
  const Table: React.FC = () => {
    return (
      <div className='flex flex-col'>
        <div className=''>
          <div className='py-2 inline-block min-w-full sm:px-6 lg:px-24'>
            <div className=''>
              <table className='min-w-full bg-[#181A1B] overflow-auto'>
                <thead>
                  <tr>
                    <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
                      #
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
                      Title
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
                      Artist
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
                      Requested By
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
                      Duration
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
                      VideoID
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-[#1B1E1F]'>
                  {songs.map((initialSong: Songs) =>
                    <tr className='bg-[#1B1E1F] border-b'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200'>{initialSong.Id}</td>
                      <td className='text-sm text-gray-200 font-light px-6 py-4 whitespace-nowrap'>{initialSong.Title}</td>
                      <td className='text-sm text-gray-200 font-light px-6 py-4 whitespace-nowrap'>{initialSong.Artist}</td>
                      <td className='text-sm text-gray-200 font-light px-6 py-4 whitespace-nowrap'>{initialSong.Userid}</td>
                      <td className='text-sm text-gray-200 font-light px-6 py-4 whitespace-nowrap'>{initialSong.Duration}</td>
                      <td className='text-sm text-gray-200 font-light px-6 py-4 whitespace-nowrap'>{initialSong.Videoid}</td>
                      <td className='text-sm text-red-900 font-light px-6 py-4 whitespace-nowrap' onClick={() => { deleteSong(initialSong.Id, initialSong.Title); setSongs(songs.filter((song: Songs) => song.Id !== initialSong.Id)); }}>X</td>
                    </tr>
                  )}
                  <tr className='bg-gray-100 border-b'></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
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