import { 
    Box, CssBaseline, Divider, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery, useTheme
  } from '@mui/material';
  import * as React from 'react';
  import { NavLink, useLocation, useParams } from 'react-router-dom';
  import { ResponsiveAppBar } from '../mui/ResponsiveAppBar';
  import { Dashboard as DashboardIcon, FormatListBulleted, QueueMusic } from '@mui/icons-material';
  import { AuthenticationStatusInterface } from '../../interfaces/Auth';
  
  export const Commands: React.FC<AuthenticationStatusInterface> = ({ authenticated }) => {
    const drawerWidth = 240;
    const params = useParams();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
    const [mobileOpen, setMobileOpen] = React.useState(false);
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };
  
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
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname.startsWith(path)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#333',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: '#444',
                    },
                    '&:hover': {
                      backgroundColor: '#2a2a2a',
                    },
                    py: 1.5,
                    px: 2,
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
      <div>
        <ResponsiveAppBar 
          authenticated={authenticated}
          onDrawerToggle={handleDrawerToggle}
          showDrawerToggle={true}
        />
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          
          {/* Desktop Drawer */}
          {!isMobile && (
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
              {drawer}
            </Drawer>
          )}
  
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
            
            {/* Main Content with responsive spacing */}
            <Box sx={{ 
              mx: { xs: 1, sm: 2, md: 4 }, // Responsive horizontal margins
              my: { xs: 2, sm: 3 } // Responsive vertical margins
            }}>
              <Typography 
                variant={isMobile ? 'h4' : 'h1'} 
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } // Responsive font size
                }}
              >
                Commands
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  ml: { xs: 0, sm: 2 }, // Less left margin on mobile
                  fontSize: { xs: '0.9rem', sm: '1rem' }, // Slightly smaller on mobile
                  color: 'text.secondary'
                }}
              >
                Commands coming soon!
              </Typography>
            </Box>
          </Box>
        </Box>
      </div>
    );
  };