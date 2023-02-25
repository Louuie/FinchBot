import React from "react";
import axios from "axios";
import { TableContainer, Paper, TableHead, Table, TableRow, TableCell, TableBody } from "@mui/material";
import { Delete, Upgrade } from "@mui/icons-material";
import { SongArray, Songs } from "../interfaces/Songs";

export const SongTable = ({songs} : SongArray) => {
      const deleteSong = async (id: number | undefined, title: string | undefined) => {
        axios.get('http://localhost:3030/song-request-delete', {
            params: {
              channel: 'louiee_tv',
              id: id,
            }
          }).then((res) => console.log(res.data)).catch((err) => console.log(err));
      }

      const promoteSong = async (videoID: string | undefined, pos1: number | undefined, pos2: number | undefined) => {
        console.log(pos1, pos2)
        axios.post('http://localhost:3030/promote-song', null, {
          params: {
            channel: 'louiee_tv',
            videoid: videoID,
            position1: pos1,
            position2: pos2,
          }
        }).then((res) => console.log(res.data)).catch((err) => console.log(err));
      }

    return (
      <TableContainer component={Paper} className="w-full md:mx-[2rem] mx-[1rem] ">
        <Table className="md:min-w-[450px] min-w-[350px]" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Artist</TableCell>
              <TableCell align="right">Requested by</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell className="md:block hidden" align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songs?.map((intialSong: Songs) => (
              <TableRow key={intialSong.Id}>
                <TableCell component="th" scope="row">
                  {intialSong.Title}
                </TableCell>
                <TableCell align="right">{intialSong.Artist}</TableCell>
                <TableCell align="right">{intialSong.Userid}</TableCell>
                <TableCell align="right">{intialSong.Duration}</TableCell>
                <TableCell className="md:block hidden" align="right">
                  <div className="flex flex-1 justify-end items-end">
                    <div className="hover:cursor-pointer" onClick={() => deleteSong(intialSong.Id, intialSong.Title)}>
                      <Delete color="error"/>
                    </div>
                    <div className="hover:cursor-pointer" onClick={() => promoteSong(intialSong.Videoid, intialSong.Id, intialSong.Id - 1)}>
                      <Upgrade/>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </TableContainer>




























      //   <div className='flex flex-col'>
      //   <div className=''>
      //     <div className='py-2 inline-block min-w-full sm:px-6 lg:px-24'>
      //       <div className=''>
      //         <table className='min-w-full bg-[#181A1B] overflow-auto'>
      //           <thead>
      //             <tr>
      //               <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
      //                 #
      //               </th>
      //               <th scope="col" className="text-sm font-medium text-gray-200 px-24 py-4 text-left">
      //                 Title
      //               </th>
      //               <th scope="col" className="text-sm font-medium text-gray-200 px-8 py-4 text-left">
      //                 Artist
      //               </th>
      //               <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
      //                 Requested By
      //               </th>
      //               <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
      //                 Duration
      //               </th>
      //               <th scope="col" className="text-sm font-medium text-gray-200 px-7 py-4 text-left">
      //                 VideoID
      //               </th>
      //               <th scope="col" className="text-sm font-medium text-gray-200 px-6 py-4 text-left">
      //                 Actions
      //               </th>
      //             </tr>
      //           </thead>
      //           <tbody className='bg-[#1B1E1F]'>
      //             {songs.sort((a:never, b:never) => a - b).map((initialSong: Songs) =>
      //               <tr className='bg-[#1B1E1F] border-b' key={initialSong.Id}>
      //                 <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200'>{initialSong.Id}</td>
      //                 <td className='text-sm text-gray-200 font-light py-4 whitespace-nowrap'>{initialSong.Title}</td>
      //                 <td className='text-sm text-gray-200 font-light -px-4 py-4 whitespace-nowrap'>{initialSong.Artist}</td>
      //                 <td className='text-sm text-gray-200 font-light px-10 py-4 whitespace-nowrap'>{initialSong.Userid}</td>
      //                 <td className='text-sm text-gray-200 font-light px-7 py-4 whitespace-nowrap'>{initialSong.Duration}</td>
      //                 <td className='text-sm text-gray-200 font-light px-4 py-4 whitespace-nowrap'>{initialSong.Videoid}</td>
      //                 <td className='text-sm text-gray-200 font-light px-7 py-4 whitespace-nowrap flex flex-1'>
      //                   <div className='h-4 bg-gray-800'>
      //                     <Arrow90degUp className='hover:cursor-pointer transform -scale-x-100' onClick={() => { ResortSongUp(songs, initialSong.Id - 1) }}/>
      //                   </div>
      //                   <div className='h-4 py-[11px] bg-red-800 hover:cursor-pointer' onClick={() => { deleteSong(initialSong.Id, initialSong.Title); setSongs(songs.filter((song: Songs) => song.Id !== initialSong.Id)); }}>
      //                     <Trash color='white'/>
      //                   </div>
      //                 </td>
      //               </tr>
      //             )}
      //             <tr className='bg-gray-100 border-b'></tr>
      //           </tbody>
      //         </table>
      //       </div>
      //     </div>
      //   </div>
      // </div>

      
    );
}