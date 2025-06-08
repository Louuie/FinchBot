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
  ListItemIcon, ListItemText, Toolbar, useMediaQuery, useTheme
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [song, setSong] = React.useState<Songs>({
    Title: '', Artist: '', DurationInSeconds: 0, Videoid: '', Userid: '', Id: 0, Position: 0,
  });
  const [songs, setSongs] = React.useState<Songs[]>([]);
  const [songQueueSettings, setSongQueueSettings] = React.useState<Settings>({
    channel: params.streamer, status: false, song_limit: 20, user_limit: 2,
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: `/c/${params.streamer}/dashboard` },
    { text: 'Commands', icon: <FormatListBulleted />, path: `/c/${params.streamer}/commands` },
    { text: 'Song Requests', icon: <QueueMusic />, path: `/c/${params.streamer}/song-requests` },
  ];

  const drawer = (
    <>
      <Toolbar />
      <Divider sx={{ borderColor: '#333' }} />
      <List>
        {drawerItems.map(({ text, icon, path }) => (
          <NavLink
            key={text}
            to={path}
            style={{ textDecoration: 'none' }}
            onClick={() => setMobileOpen(false)}
          >
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname.startsWith(path)}
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
    </>
  );

  return (
    <div className="w-full min-h-screen">
      <ResponsiveAppBar 
        authenticated={authenticated} 
        onDrawerToggle={handleDrawerToggle}
        showDrawerToggle={true}
      />
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* Desktop Drawer */}
        <Drawer
          sx={{
            width: mobileOpen ? 0 : drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#1e1e1e',
              color: '#fff',
              borderRight: '1px solid #333',
              transform: mobileOpen ? 'translateX(-100%)' : 'translateX(0)',
              transition: 'transform 0.3s ease-in-out',
            },
          }}
          variant="persistent"
          anchor="left"
          open={!mobileOpen}
        >
          {drawer}
        </Drawer>

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: '#1e1e1e',
                color: '#fff',
                borderRight: '1px solid #333',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3 }, // Responsive padding
          }}
        >
          <Toolbar />
          
          {/* Form Dialog with responsive spacing */}
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <FormDialog
              Streamer={params.streamer as string}
              songs={songs}
              authenticated={authenticated}
              status={songQueueSettings.status}
              song_limit={songQueueSettings.song_limit}
              user_limit={songQueueSettings.user_limit}
            />
          </Box>

          {/* Song Player with responsive layout */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mb: { xs: 3, sm: 4 },
              px: { xs: 1, sm: 2 } // Add some horizontal padding on mobile
            }}
          >
            <SongPlayer
              Streamer={params.streamer as string}
              songs={songs}
              {...song}
            />
          </Box>

          {/* Song Table with responsive layout */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'start',
              color: 'text.secondary',
              px: { xs: 0, sm: 1 } // Minimal padding on mobile for table
            }}
          >
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