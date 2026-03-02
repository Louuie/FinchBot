import * as React from 'react';
import { useParams, useLocation, NavLink } from 'react-router-dom';
import axios from 'axios';

import { ResponsiveAppBar } from '../mui/ResponsiveAppBar';
import { FormDialog } from '../mui/FormDialog';
import { SongTable } from '../SongTable';
import { SongPlayer } from '../SongPlayer';

import { Songs } from '../../interfaces/Songs';
import { AuthenticationStatusInterface } from '../../interfaces/Auth';
import { Settings } from '../../interfaces/Settings';

import {
  Box, CssBaseline, Divider, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar
} from '@mui/material';

import {
  Dashboard as DashboardIcon,
  FormatListBulleted,
  QueueMusic
} from '@mui/icons-material';

const drawerWidth = 240;

export const SongRequests: React.FC<AuthenticationStatusInterface> = ({ authenticated }) => {
  const params = useParams();
  const location = useLocation();

  const [song, setSong] = React.useState<Songs>({
    Title: '', Artist: '', DurationInSeconds: 0, Videoid: '', Userid: '', Id: 0, Position: 0,
  });
  const [songs, setSongs] = React.useState<Songs[]>([]);
  const [songQueueSettings, setSongQueueSettings] = React.useState<Settings>({
    channel: params.streamer, status: false, song_limit: 20, user_limit: 2,
  });

  // Fetch songs
  React.useEffect(() => {
    let isMounted = true;
  
    const fetchSongs = async () => {
      try {
        const res = await axios.get('https://api.finchbot.xyz/songs', {
          params: { channel: params.streamer }
        });
        if (isMounted) {
          const songData = res.data.songs;
          setSongs(songData);
          if (songData.length > 0) {
            setSong(songData[0]);
          } else {
            setSong({  // clear current song when queue is empty
              Title: '',
              Artist: '',
              DurationInSeconds: 0,
              Videoid: '',
              Userid: '',
              Id: 0,
              Position: 0
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
  
      if (isMounted) {
        setTimeout(fetchSongs, 3000); // Schedule next fetch
      }
    };
  
    fetchSongs(); // Initial call
  
    return () => {
      isMounted = false;
    };
  }, [params.streamer]);
  

  // Fetch settings
  // React.useEffect(() => {
  //   let isMounted = true;
  
  //   const fetchSettings = async () => {
  //     try {
  //       const res = await axios.get('https://api.finchbot.xyz/song-queue-settings', {
  //         params: { channel: params.streamer + '_settings' }
  //       });
  //       if (isMounted) {
  //         setSongQueueSettings(res.data.settings[0]);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  
  //     if (isMounted) {
  //       setTimeout(fetchSettings, 3000);
  //     }
  //   };
  
  //   fetchSettings();
  
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [params.streamer]);
  

  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: `/c/${params.streamer}/dashboard` },
    { text: 'Commands', icon: <FormatListBulleted />, path: `/c/${params.streamer}/commands` },
    { text: 'Song Requests', icon: <QueueMusic />, path: `/c/${params.streamer}/song-requests` },
  ];

  return (
    <div className="w-full min-h-screen">
      <ResponsiveAppBar authenticated={authenticated} />
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#1e1e1e',
              color: '#fff',
              borderRight: '1px solid #333',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider sx={{ borderColor: '#333' }} />
          <List>
            {drawerItems.map(({ text, icon, path }) => (
              <NavLink
                key={text}
                to={path}
                style={{ textDecoration: 'none' }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === path}
                    sx={{
                      '&.Mui-selected': { backgroundColor: '#333' },
                      '&.Mui-selected:hover': { backgroundColor: '#444' },
                      '&:hover': { backgroundColor: '#2a2a2a' },
                      py: 1.5, px: 2,
                    }}
                  >
                    <ListItemIcon sx={{ color: '#aaa' }}>{icon}</ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ span: { fontWeight: 500, fontSize: 15, color: '#fff' } }}
                    />
                  </ListItemButton>
                </ListItem>
              </NavLink>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <FormDialog
            Streamer={params.streamer as string}
            songs={songs}
            authenticated={authenticated}
            status={songQueueSettings.status}
            song_limit={songQueueSettings.song_limit}
            user_limit={songQueueSettings.user_limit}
          />
          <Box className="flex justify-center items-center">
            <SongPlayer
              Streamer={params.streamer as string}
              songs={songs}
              {...song}
            />
          </Box>
          <Box className="flex flex-col items-start text-gray-300 mt-4">
            <SongTable
              Streamer={params.streamer as string}
              songs={songs}
              authenticated={authenticated}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
};
