import * as React from 'react';
import { DrawerMenu } from '../ui/DrawerMenu';
import { SongTable } from '../SongTable';
import { SongPlayer } from '../SongPlayer';
import { FormDialog } from '../mui/FormDialog';
import { ResponsiveAppBar } from '../mui/ResponsiveAppBar';


export const SongRequests: React.FC = () => {

  return (
    <div>
      <ResponsiveAppBar/> 
      <div className='flex flex-col w-full h-full'>
        <FormDialog/>
        <div className='flex justify-center align-middle items-center'>
          <SongPlayer/>
        </div>
        <div className='flex flex-1 text-gray-300 mt-[4rem] ml-[10rem]'>
          <SongTable/>
        </div>
      </div>
   </div>
  )
}