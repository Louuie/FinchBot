
import axios from 'axios';
import * as React from 'react'
import { Auth } from '../auth/auth';
import { HomeNavBar } from './HomeNavBar';
import gif from '../3.0.gif';
import { Button } from '@mui/material';

export const Home: React.FC = () => {
  const [authenticated, setAuthenticated] = React.useState(false);
  React.useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3030/auth/twitch/validate').then((res) => {
      const auth : Auth = res.data;
      if (!auth.error) setAuthenticated(true);
    })
  }, []);

  return (
    <div>
      <HomeNavBar/>
      <div className='flex justify-center items-center w-full h-full'>
        <span className='md:mr-[425px] md:whitespace-pre-line md:w-[420px] md:h-[300px] md:ml-4 md:mt-[1rem] md:text-[42px] font-semibold lg:text-[58px] text-[38px] w-full h-full leading-[96px] lg:-mt-1 mt-44'>Open Source, Free, Simple and easy to use Song Request Twitch Bot.</span>
      </div>
      <div className='flex justify-center items-center flex-wrap w-full'>
        <img src={gif} alt='NODDERS' className='md:w-[375px] md:h-[265px] md:ml-[25rem] md:-mt-[22rem] w-[186px] h-[178px] lg:ml-[40rem] lg:-mt-60 lg:w-[275px] lg:h-[225px] -mt-[65rem]'/>
      </div>
      { !authenticated ? <Button variant="contained" className='ml-[24rem] bg-[#121E40] mt-3 bg-opacity-50 font-bold rounded-2xl border border-solid whitespace-nowrap border-[#343333]'>Login</Button> : <Button className='ml-[24rem] bg-[#121E40] mt-3 bg-opacity-50 font-bold rounded-2xl border border-solid whitespace-nowrap border-[#343333]'>Dashboard</Button> }
    </div>
  )
}