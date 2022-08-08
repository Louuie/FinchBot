
import axios from 'axios';
import * as React from 'react'
import { Auth } from '../auth/auth';
import { HomeNavBar } from './HomeNavBar';
import gif from '../3.0.gif';

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
    <div>
      <HomeNavBar/>
      <div className='flex justify-center items-center w-full'>
        <span className='md:mr-[425px] md:whitespace-pre-line md:w-[420px] md:h-[300px] md:mt-[28rem] font-semibold lg:text-[58px] text-[38px] w-full h-full leading-[96px]'>Open Source, Free, Simple and easy to use Song Request Twitch Bot.</span>
      </div>
      <div className='flex justify-center items-center flex-wrap w-full'>
        <img src={gif} className='md:w-[389px] md:h-[275px] w-[186px] h-[178px] lg:ml-[40rem] md:-mt-[62rem] -mt-[63rem]'/>
      </div>
    </div>
  )
}
/* { !authenticated ? <Button variant="contained" classNameName='ml-[24rem] bg-[#121E40] mt-3 bg-opacity-50 font-bold rounded-2xl border border-solid whitespace-nowrap border-[#343333]'>Login</Button> : <Button>Dashboard</Button> } */