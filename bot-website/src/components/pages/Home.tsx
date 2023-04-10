
import axios from 'axios';
import * as React from 'react'
import { AuthenticationStatusInterface } from '../../interfaces/Auth';
import { HomeNavBar } from '../ui/HomeNavBar';
import gif from '../../3.0.gif';
import { Button } from '@mui/material';

export const Home: React.FC = () => {
  const [authData, setAuthData] = React.useState<AuthenticationStatusInterface>();
  React.useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3030/auth/twitch/validate').then((res) => {
      const auth : AuthenticationStatusInterface = res.data
      if (!auth.error) setAuthData(auth);
    })
  }, []);

  return (
    <div>
      <HomeNavBar/>
      <div className='flex justify-center items-center w-full h-full'>
        <span className='md:mr-[425px] md:whitespace-pre-line md:w-[420px] md:h-[300px] md:ml-4 md:mt-[1rem] md:text-[42px] font-semibold xxxl:text-[58px] text-[38px] w-full h-full leading-[96px] xxxl:-mt-1 mt-34'>Open Source, Free, Simple and easy to use Song Request Twitch Bot.</span>
      </div>
      <div className='flex justify-center items-center flex-wrap w-full'>
        <img src={gif} alt='NODDERS' className='hidden md:block  md:w-[375px] md:h-[265px] md:ml-[25rem] md:-mt-[22rem] w-[186px] h-[178px] xxxl:ml-[40rem] xxxl:-mt-60 xxxl:w-[275px] xxxl:h-[225px] -mt-[65rem]'/>
      </div>
      <div className='flex flex-1 w-full md:justify-center md:items-center justify-start items-start md:mt-56 mt-12 mr-[36rem] md:-mx-[18rem]'>
          <Button variant="contained" className='bg-[#121E40] text-gray-200 mr-8 bg-opacity-50 font-bold rounded-2xl border border-solid whitespace-nowrap border-[#343333] mx-2'>Learn More</Button>
          { !authData?.authenticated ? <Button href='/login' variant="contained" className='bg-[#121E40] text-gray-200 bg-opacity-50 font-bold rounded-2xl border border-solid whitespace-nowrap border-[#343333]'>Login</Button> : <Button className='bg-[#121E40] text-gray-200 bg-opacity-50 font-bold rounded-2xl border border-solid whitespace-nowrap border-[#343333]' href={`/dashboard/${authData.display_name}`}>Dashboard</Button> }
      </div>
      <div className='flex justify-center items-center'>
        <div className='mt-36 bg-[#171E32] w-[856px] h-[331px] rounded-3xl'>
          <a className='font-semibold text-3xl'>FinchBot is finally here.</a>
        </div>
      </div>
    </div>
  )
}