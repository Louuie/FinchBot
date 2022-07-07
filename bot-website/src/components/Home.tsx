
import axios from 'axios';
import * as React from 'react'
import { Auth } from '../auth/auth';
import { HomeNavBar } from './HomeNavBar';

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
      <div className='flex justify-center items-center flex-wrap w-full'>
        <span className='hidden md:block mr-[395px] mt-8 font-semibold text-[58px] whitespace-pre-line w-[439px] h-[364px] leading-[96px]'>Free, Simple and easy to use Twitch Bot catered to DaCommunity.</span>
      </div>
    </div>
  )
}
/* { !authenticated ? <Button variant="contained" classNameName='ml-[24rem] bg-[#121E40] mt-3 bg-opacity-50 font-bold rounded-2xl border border-solid whitespace-nowrap border-[#343333]'>Login</Button> : <Button>Dashboard</Button> } */