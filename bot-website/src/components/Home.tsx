
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
      <div className='flex flex-1 justify-center items-center w-full'>
        <span className='md:mr-[395px] whitespace-pre-line md:w-[439px] md:h-[364px] mt-4 font-semibold text-[58px] w-full h-full leading-[96px]'>Free, Simple and easy to use Twitch Bot catered to DaCommunity.</span>
      </div>
      <div className='flex flex-1 justify-center items-center flex-wrap w-full'>
        <img src={gif} className='hidden md:block w-[186px] h-[178px] ml-[40rem] -mt-[15rem]'/>
      </div>
    </div>
  )
}
/* { !authenticated ? <Button variant="contained" classNameName='ml-[24rem] bg-[#121E40] mt-3 bg-opacity-50 font-bold rounded-2xl border border-solid whitespace-nowrap border-[#343333]'>Login</Button> : <Button>Dashboard</Button> } */