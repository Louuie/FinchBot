import axios from 'axios';
import * as React from 'react';
import { AuthenticationStatusInterface } from '../../interfaces/Auth';
import { HomeNavBar } from '../ui/HomeNavBar';
import { Button } from '@mui/material';
import finchBotLogo from '../../assets/FinchBot_logo.png';

export const Home: React.FC = () => {
  const [authData, setAuthData] = React.useState<AuthenticationStatusInterface>();
  React.useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.post('https://api.finchbot.xyz/auth/twitch/validate').then((res) => {
      const auth : AuthenticationStatusInterface = res.data
      if (!auth.error) setAuthData(auth);
    })
  }, []);

  return (
    <div className='bg-gradient-to-b from-[#0A1228] to-[#172442] min-h-screen text-white'>
      <HomeNavBar/>
      
      {/* Hero Section */}
      <section className='container mx-auto px-6 py-16 md:py-24'>
        <div className='flex flex-col md:flex-row items-center gap-12'>
          <div className='md:w-1/2'>
            <h1 className='text-4xl md:text-5xl xxxl:text-6xl font-bold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300'>
              Open Source, Free, Simple and easy to use Song Request Twitch Bot.
            </h1>
            <p className='text-lg text-blue-100 mb-8 max-w-lg'>
              Take interacting with your community to a whole new level using FinchBot!
            </p>
            <div className='flex flex-wrap gap-4 mt-8'>
              { !authData?.authenticated ? 
                <Button 
                  href='/login' 
                  variant="contained" 
                  className='bg-[#121E40] text-white bg-opacity-60 font-bold rounded-full border border-blue-400 px-8 py-3 hover:bg-opacity-80 transition-all duration-300'
                >
                  Login with Twitch
                </Button> : 
                <Button 
                  className='bg-[#121E40] text-white bg-opacity-60 font-bold rounded-full border border-blue-400 px-8 py-3 hover:bg-opacity-80 transition-all duration-300' 
                  href={`/c/${authData.display_name}/dashboard`}
                >
                  Dashboard
                </Button> 
              }
            </div>
          </div>
          <div className='md:w-1/2'>
          <img 
                  src={finchBotLogo} 
                  alt="FinchBot Logo" 
                  className="max-w-[70%] max-h-[70%] object-contain mb-4"
                />
          </div>
        </div>
      </section>
      
      <section className='container mx-auto px-6 py-16'>
        <div className='bg-[#0F1A30] rounded-3xl p-8 md:p-12 shadow-xl border border-blue-900/40'>
          <h2 className='font-bold text-3xl mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300'>
            Why FinchBot?
          </h2>
          <div className='grid md:grid-cols-3 gap-8 mt-8'>
            <div className='bg-gradient-to-br from-[#121E40] to-[#172442] p-6 rounded-xl shadow-lg border border-blue-800/30 hover:border-blue-600/50 transition-all duration-300'>
              <div className='bg-blue-600/20 w-12 h-12 rounded-lg mb-4 flex items-center justify-center'>
                <span className='text-blue-300 text-xl font-bold'>1</span>
              </div>
              <h3 className='text-xl font-semibold mb-3 text-blue-200'>Easy to Use</h3>
              <p className='text-blue-100/80'>Simple setup process to get your song requests up and running in minutes.</p>
            </div>
            <div className='bg-gradient-to-br from-[#121E40] to-[#172442] p-6 rounded-xl shadow-lg border border-blue-800/30 hover:border-blue-600/50 transition-all duration-300'>
              <div className='bg-blue-600/20 w-12 h-12 rounded-lg mb-4 flex items-center justify-center'>
                <span className='text-blue-300 text-xl font-bold'>2</span>
              </div>
              <h3 className='text-xl font-semibold mb-3 text-blue-200'>Open Source</h3>
              <p className='text-blue-100/80'>Fully open source so you can see exactly how it works or contribute to the project.</p>
            </div>
            <div className='bg-gradient-to-br from-[#121E40] to-[#172442] p-6 rounded-xl shadow-lg border border-blue-800/30 hover:border-blue-600/50 transition-all duration-300'>
              <div className='bg-blue-600/20 w-12 h-12 rounded-lg mb-4 flex items-center justify-center'>
                <span className='text-blue-300 text-xl font-bold'>3</span>
              </div>
              <h3 className='text-xl font-semibold mb-3 text-blue-200'>Free Forever</h3>
              <p className='text-blue-100/80'>No hidden fees or premium tiers. All features available to everyone.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}