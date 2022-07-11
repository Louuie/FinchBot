import * as React from 'react';
import { Twitch, Discord, Github } from 'react-bootstrap-icons';

export const HomeNavBar: React.FC = () => {
    return (
        <nav className="bg-[#091126] px-2 sm:px-4 py-2.5 rounded-[25px] lg:w-[835px] h-[75px] w-full mx-auto mt-4 flex flex-1">
        <div className="container flex flex-row justify-between items-center mx-auto">
          <div className="flex flex-1 items-center">               
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">LouieBot</span>
          </div>
            <div className='hidden w-full md:block md:w-auto items-center ml-[28rem]'>
              <div className='flex flex-1 -ml-20'>
                <Twitch size={22}/>
                <Discord size={22} className='ml-4'/>
                <Github size={22} className='ml-4'/>
              </div> 
            </div>
        </div>
      </nav>
    );
}