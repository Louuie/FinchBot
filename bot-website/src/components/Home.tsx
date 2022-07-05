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
   <div className='flex h-screen items-center justify-center'>
    {authenticated ? <MUIMenu/> : <AuthButton authenticated={authenticated}/>}
   </div>
  )
}