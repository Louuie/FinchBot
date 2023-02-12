import * as React from 'react'
import { Routes, Route } from 'react-router-dom';
import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login';
import { Callback } from './components/pages/Callback';
import { SongRequests } from './components/pages/SongRequests';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


export const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/auth/callback' element={<Callback/>}/>
        <Route path=':streamer/songrequests' element={<SongRequests/>}/>
      </Routes>
    </ThemeProvider>
  )
}