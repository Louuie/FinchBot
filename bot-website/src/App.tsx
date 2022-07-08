import * as React from 'react'
import { Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Callback } from './components/Callback';
import { SongRequests } from './components/SongRequests';
export const App: React.FC = () => {
  return (
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/auth/callback' element={<Callback/>}/>
    <Route path=':streamer/songrequests' element={<SongRequests/>}/>
   </Routes>
  )
}