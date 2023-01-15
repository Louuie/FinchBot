import axios from "axios";
import React from "react";
import { Arrow90degUp, Trash } from "react-bootstrap-icons";
import { Songs } from "../interfaces/SongInterface";

export const SongTable: React.FC = () => {
    const [songs, setSongs] = React.useState([]);
    const [readjustedSongs, setReadjustedSongs] = React.useState([]);
    
    React.useEffect(() => {
        const fetchSongs = setInterval(() => {
          axios.get('http://localhost:3030/songs', {
            params: {
              channel: 'louiee_tv'
            }
          }).then((res) => { setSongs(res.data.songs);  }).catch((err) => console.log(err))
        }, 5000);
        songs.sort((a: Songs, b: Songs) => a.Id - b.Id);
        if (songs != readjustedSongs) {
          setSongs(songs);
          console.log(songs);
        } 
        return () => clearInterval(fetchSongs);
      }, [songs, readjustedSongs]);
    
    
      const deleteSong = async (id: number, title: string) => {
        axios.get('http://localhost:3030/song-request-delete', {
            params: {
              channel: 'louiee_tv',
              id: id,
            }
          }).then((res) => console.log(res.data)).catch((err) => console.log(err));
      }

      // TODO: Create a Resort method that allows the user to move the song/video up or down in the queue.
      const ResortSongUp = (array:any, from: number): void => {
        // Check if the index is 0, if it isn't then continue but if it is then just ignore the request.
        if (from !== 0) {
          // This will be our previous items.
          // This is where we want the Song/Video to go.
          let temp = array[from - 1]
          // Here we set the value of where we wanna go to the correct value that is being moved.
          array[from - 1] = array[from];
          // Here we set the value of where we came from to the correct value that is being moved.
          array[from] = temp;
          setReadjustedSongs(array);
          console.log(from, array);
        } else console.log('Ignoring resort request!');
      };


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
                    <th scope="col" className="text-sm font-medium text-gray-200 px-24 py-4 text-left">
                      Title
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-200 px-8 py-4 text-left">
                      Artist
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
                      Requested By
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
                      Duration
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-200 px-7 py-4 text-left">
                      VideoID
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-[#1B1E1F]'>
                  {songs.sort((a:never, b:never) => a - b).map((initialSong: Songs) =>
                    <tr className='bg-[#1B1E1F] border-b' key={initialSong.Id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200'>{initialSong.Id}</td>
                      <td className='text-sm text-gray-200 font-light py-4 whitespace-nowrap'>{initialSong.Title}</td>
                      <td className='text-sm text-gray-200 font-light -px-4 py-4 whitespace-nowrap'>{initialSong.Artist}</td>
                      <td className='text-sm text-gray-200 font-light px-10 py-4 whitespace-nowrap'>{initialSong.Userid}</td>
                      <td className='text-sm text-gray-200 font-light px-7 py-4 whitespace-nowrap'>{initialSong.Duration}</td>
                      <td className='text-sm text-gray-200 font-light px-4 py-4 whitespace-nowrap'>{initialSong.Videoid}</td>
                      <td className='text-sm text-gray-200 font-light px-7 py-4 whitespace-nowrap flex flex-1'>
                        <div className='h-4 bg-gray-800'>
                          <Arrow90degUp className='hover:cursor-pointer transform -scale-x-100' onClick={() => { ResortSongUp(songs, initialSong.Id - 1) }}/>
                        </div>
                        <div className='h-4 py-[11px] bg-red-800 hover:cursor-pointer' onClick={() => { deleteSong(initialSong.Id, initialSong.Title); setSongs(songs.filter((song: Songs) => song.Id !== initialSong.Id)); }}>
                          <Trash color='white'/>
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr className='bg-gray-100 border-b'></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
}