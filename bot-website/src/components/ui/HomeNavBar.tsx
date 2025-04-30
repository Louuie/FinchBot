import * as React from 'react';
import { Twitch, Discord, Github } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const Socials = {
  Twitch: {
    icon: Twitch,
    link: 'https://twitch.tv/DaCommunityBot',
    label: 'Twitch'
  },
  Discord: {
    icon: Discord,
    link: 'https://discord.gg',
    label: 'Discord'
  },
  Github: {
    icon: Github,
    link: 'https://github.com/Louuie/FinchBot',
    label: 'GitHub'
  },
}

export const HomeNavBar: React.FC = () => {
    return (
        <nav className="backdrop-blur-sm bg-[#0F1A30]/80 px-4 sm:px-6 py-4 rounded-2xl w-full max-w-7xl mx-auto mt-6 flex items-center border border-blue-900/40 shadow-lg">
          <div className="container flex justify-between items-center mx-auto">
            <div className="flex items-center">
              <Link to="/" className="flex items-center no-underline">
                <span className="self-center text-2xl font-bold text-gray-100 ml-2">FinchBot</span>
              </Link>
            </div>            
            <div className="flex items-center space-x-4">
              {Object.entries(Socials).map(([key, social]) => (
                <a 
                  key={key}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-blue-300 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>
        </nav>
    );
}