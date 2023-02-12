import * as React from 'react';
import { DrawerMenu } from '../ui/DrawerMenu';
import { SongTable } from '../SongTable';
import { SongPlayer } from '../SongPlayer';
import { FormDialog } from '../mui/FormDialog';


export const SongRequests: React.FC = () => {

  return (
   <div className='flex flex-col w-full h-full'>
    <FormDialog/>
    <SongPlayer/>
    <div className='flex flex-1 text-gray-300 mt-[4rem] ml-[10rem]'>
      <SongTable/>
    </div>
   </div>
  )
}