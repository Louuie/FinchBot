import { Button } from '@mui/material';
import axios from 'axios';
import * as React from 'react'
import { Auth } from '../auth/auth';
import { AuthButton } from './auth/AuthButton';
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
   <div className='flex h-screen justify-center bg-[#121E40]'>
     <div className='bg-[#091126] w-[835px] h-[75px] rounded-[25px] mt-[35px]'>
      <div className='mt-[24px] ml-10 font-semibold text-[20px] font-roboto'>DaCommunityBot</div>
      { !authenticated ? <Button variant='contained' sx={{ backgroundColor: '#121E40', opacity: '50',  fontWeight: 'bold', mt: 1.5, borderRadius: 8, ml: '40', width: '100', height: '36', stroke: { backgroundColor: '#343333' },  ':hover':  { backgroundColor: '#121E40' }}}>Login</Button> : <Button>Dashboard</Button> }
     </div>
   </div>
  )
}