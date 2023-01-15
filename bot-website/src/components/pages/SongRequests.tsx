import * as React from 'react';
import { DrawerMenu } from '../ui/DrawerMenu';
import { SongTable } from '../SongTable';
export const SongRequests: React.FC = () => {



  return (
   <div className='flex justify-center w-full h-full'>
     <DrawerMenu name={'LouieBot'}/>
     <div className='flex-1 text-gray-300 ml-[17rem] mt-2'>
      <SongTable/>
     </div>
   </div>
  )
}