import { Box, CssBaseline, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import * as React from 'react'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import { ResponsiveAppBar } from '../mui/ResponsiveAppBar'
import { Dashboard as DashboardIcon, FormatListBulleted, QueueMusic } from '@mui/icons-material'

export const Commands: React.FC = () => {
    const drawerWidth = 240
    const params = useParams()
    const drawerItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: `/c/${params.streamer}/dashboard` },
        { text: 'Commands', icon: <FormatListBulleted />, path: `/c/${params.streamer}/commands` },
        { text: 'Song Requests', icon: <QueueMusic />, path: `/c/${params.streamer}/song-requests` },
    ];
    const location = useLocation()
    return (
        <div>
            <ResponsiveAppBar authenticated={false} />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: '#1e1e1e', // Dark background
                            color: '#fff',              // White text
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
                                        <ListItemText primary={text} sx={{ span: { fontWeight: 500, fontSize: 15, color: '#fff' } }} />
                                    </ListItemButton>
                                </ListItem>
                            </NavLink>
                        ))}
                    </List>

                </Drawer>

                <Box
                    component="main"
                    sx={{ flexGrow: 1, mt: 6 }}
                >
                    <Typography variant='h1'>Commands</Typography>
                    <Typography variant='body1' className='ml-4'>Commands coming soon!</Typography>
                </Box>
            </Box>
        </div>
    )
}