import { Button, Box } from '@mui/material';
import axios from 'axios';
import * as React from 'react'
import { Auth } from '../auth/auth';
import { AuthButton } from './auth/AuthButton';
import ButtonAppBar from './ButtonAppBar';
import { MUIMenu } from './mui/Menu';

export const Home: React.FC = () => {
  const [authenticated, setAuthenticated] = React.useState(false);
  React.useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:3030/auth/twitch/validate').then((res) => {
      const auth : Auth = res.data;
      if (!auth.error) setAuthenticated(true);
    })
  }, [])

  return (
  // // <Box sx={{flexGrow: 1}}>
  //  <div className='mx-auto max-w-[865px] w-full p-8'>
  //    <div className='justify-between items-center'>
  //     <nav className='bg-[#091126] w-auto h-auto rounded-[25px] mt-[35px]'>
  //       <div className='mx-auto flex flex-row w-full'>
  //       <div className='mt-[24px] ml-10 font-semibold text-[20px] font-roboto'>DaCommunityBot</div>
  //       <div className='flex w-full'>{ !authenticated ? <Button variant="contained" className='flex-shrink-1 mx-auto px-auto ml-[30rem] bg-[#121E40] mt-5 bg-opacity-50 font-bold rounded-2xl border border-solid border-[#343333] w-[100px] h-[36px]'>Login</Button> : <Button>Dashboard</Button> }</div>
  //       </div>
  //     </nav>
  //    </div>
  //  </div>
  // //  </Box>
  // // <ButtonAppBar/>
  <nav className="bg-[#091126] px-2 sm:px-4 py-2.5 rounded-2xl max-w-[685px] w-full mx-auto mt-4">
  <div className="container flex flex-row justify-between items-center mx-auto">
    <span className="flex items-center">
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">DaCommunityBot</span>
    <div>{ !authenticated ? <Button variant="contained" className='mx-auto px-auto ml-[24rem] bg-[#121E40] mt-3 bg-opacity-50 font-bold rounded-2xl border border-solid whitespace-nowrap border-[#343333]'>Login</Button> : <Button>Dashboard</Button> }</div>
    </span>
  </div>
</nav>
  )
}