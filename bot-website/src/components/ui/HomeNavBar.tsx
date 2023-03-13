import * as React from 'react';
import { Twitch, Discord, Github } from 'react-bootstrap-icons';
const Socials = {
  Twitch: {
    icon: Twitch,
    link: 'https://twitch.tv/DaCommunityBot'
  },
  Discord: {
    icon: Discord,
    link: 'https://discord.gg'
  },
  Github: {
    icon: Github,
    link: 'https://github.com/Louuie/LouieBot'
  },
}

export const HomeNavBar: React.FC = () => {
    return (
        <nav className="bg-[#091126] px-2 sm:px-4 py-2.5 rounded-[25px] xxxl:w-[835px] h-[75px] w-full mx-auto mt-4 flex flex-1">
        <div className="container flex flex-row justify-between items-center mx-auto">
          <div className="flex flex-1 items-center">               
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">FinchBot</span>
          </div>
            <div className='hidden w-full md:block md:w-auto items-center ml-[28rem]'>
              <div className='flex flex-1 -ml-20'>
                <Socials.Twitch.icon size={22} className='hover:cursor-pointer' onClick={(() => window.open(Socials.Twitch.link))}/>
                <Socials.Discord.icon size={22} className='ml-4 hover:cursor-pointer' onClick={(() => window.open(Socials.Discord.link))}/>
                <Socials.Github.icon size={22} className='ml-4 hover:cursor-pointer' onClick={(() => window.open(Socials.Github.link))}/>
              </div> 
            </div>
        </div>
      </nav>
    );
}