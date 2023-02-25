import * as React from 'react'
import { Routes, Route } from 'react-router-dom';
import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login';
import { Callback } from './components/pages/Callback';
import { SongRequests } from './components/pages/SongRequests';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { AuthenticationStatusInterface } from './interfaces/Auth';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


export const App: React.FC = () => {

  // state variable for auth
  const [isAuthed, setIsAuthed] = React.useState(false);
  
  // useEffect that fetches the users authentication status
  React.useEffect(() => {
    axios.post('http://localhost:3030/auth/twitch/validate', null, {withCredentials: true}).then((res) => {
        const authData: AuthenticationStatusInterface = res.data;
        console.log(authData);
        setIsAuthed(Boolean(authData.authenticated));
        console.log('auth status', isAuthed);
    }).catch((err) => console.log(err))
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/auth/callback' element={<Callback/>}/>
        <Route path='/dashboard/:streamer' element={<SongRequests authenticated={isAuthed}/>}/>
      </Routes>
    </ThemeProvider>
  )
}