import * as React from "react";
import { ResponsiveAppBar } from "../mui/ResponsiveAppBar";
import { Alert, AlertTitle, Collapse, IconButton, Card, Button, Box, Grid, TextField, Divider, Typography, CssBaseline, AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import { Close, FormatListBulleted, QueueMusic, Menu } from "@mui/icons-material";
import { Dashboard as DashboardIcon } from "@mui/icons-material";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { AuthenticationStatusInterface } from "../../interfaces/Auth";
import { joinChannel, partChannel } from "../../api/api";
import { Channel } from "../../interfaces/Channel";
import axios from "axios";

const drawerWidth = 240;

interface DashboardProps extends AuthenticationStatusInterface {
    channelInfo: Channel;
}

export const Dashboard: React.FC<DashboardProps> = ({authenticated, channelInfo}) => {
    let [isJoined, setIsJoined] = React.useState<boolean>(false)
    let [isParted, setIsParted] = React.useState<boolean>(false)
    const [mobileOpen, setMobileOpen] = React.useState(false);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const params = useParams<{ streamer?: string }>();
    const drawerItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: `/c/${params.streamer}/dashboard` },
        { text: 'Commands', icon: <FormatListBulleted />, path: `/c/${params.streamer}/commands` },
        { text: 'Song Requests', icon: <QueueMusic />, path: `/c/${params.streamer}/song-requests` },
    ];
    const location = useLocation()
    const [open, setOpen] = React.useState(true);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const joinTwitchChannel = async () => {
        const result = await joinChannel(params.streamer)
        setIsJoined(result)
    }
    
    const partTwitchChannel = async () => {
        const result = await partChannel(params.streamer)
        if(Boolean(result)) setIsJoined(false)
    }
    
    // useEffect that checks if the twitch-bot is in the streamers chatroom
    React.useEffect(() => {
        axios.get("https://api.finchbot.xyz/fetch-channels")
            .then((res) => {
                const channels = res.data.channels;
                if (channels && channels[params.streamer!.toLowerCase()]) {
                    setIsJoined(true);
                } else {
                    setIsJoined(false);
                }
            })
            .catch((err) => {
                console.error("Error checking bot status:", err);
            });
    }, [params.streamer]);

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
                                <ListItemText primary={text} sx={{ span: { fontWeight: 500, fontSize: 15, color: '#fff' } }} />
                            </ListItemButton>
                        </ListItem>
                    </NavLink>
                ))}
            </List>
        </>
    );
    
    return (
        <div>
            <ResponsiveAppBar authenticated={authenticated} />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                
                {/* Mobile Menu Button */}
                {isMobile && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ 
                            position: 'fixed', 
                            top: 80, // Adjust based on your AppBar height
                            left: 16, 
                            zIndex: 1200,
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            }
                        }}
                    >
                        <Menu />
                    </IconButton>
                )}

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
                        mt: isMobile ? 2 : 0, // Extra margin top on mobile for menu button
                    }}
                >
                    <Toolbar />
                    <div>
                        <Box 
                            sx={{ 
                                mx: { xs: 1, sm: 4, md: 8, lg: 20 }, // Responsive horizontal margins
                                my: { xs: 2, sm: 4 } // Responsive vertical margins
                            }}
                        >
                            <Collapse in={!isJoined}>
                                <Alert
                                    severity="error"
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setOpen(false);
                                            }}
                                        >
                                            <Close fontSize="inherit" />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    <AlertTitle>FinchBot is not joined to your channel!</AlertTitle>
                                    Join FinchBot to your channel to allow it to handle song-requests, respond to commands, moderate your chat and engage with your community.
                                </Alert>
                            </Collapse>
                            
                            <Grid container spacing={{ xs: 2, sm: 3 }}>
                                {/* Bot Actions Card */}
                                <Grid size={{ xs: 12, md: 4, lg: 2 }}>
                                    <Card sx={{ px: { xs: 2, sm: 4 }, py: 2, width: '100%' }} >
                                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18, my: 2 }}>
                                            Bot Actions
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        {
                                        isJoined ? 
                                            <Button 
                                                onClick={() => {partTwitchChannel()}} 
                                                variant="contained" 
                                                sx={{ width: '100%' }}
                                                color="error"
                                            >
                                                Leave Channel
                                            </Button>
                                           :
                                           <Button 
                                                onClick={() => {joinTwitchChannel()}} 
                                                variant="contained" 
                                                sx={{ width: '100%' }}
                                            >
                                                Join Channel
                                            </Button>
                                        }
                                    </Card>
                                </Grid>
                                
                                {/* Stream Controls Card */}
                                <Grid size={{ xs: 12, md: 8, lg: 3 }}>
                                    <Card sx={{ px: { xs: 2, sm: 4 }, py: 2, width: '100%' }}>
                                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18 }}>
                                            Stream Controls
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <TextField 
                                                label="Stream Title" 
                                                value={channelInfo.title} 
                                                variant="outlined" 
                                                focused 
                                                fullWidth
                                                size={isMobile ? "small" : "medium"}
                                            />
                                            <TextField 
                                                label="Stream Game" 
                                                value={channelInfo.category} 
                                                variant="outlined" 
                                                focused 
                                                fullWidth
                                                size={isMobile ? "small" : "medium"}
                                            />
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                                            <Button disabled variant="outlined" fullWidth={isMobile}>Reset</Button>
                                            <Button disabled variant="contained" fullWidth={isMobile}>Update</Button>
                                        </Box>
                                    </Card>
                                </Grid>
                                
                                {/* Audit Log Card */}
                                <Grid size={{ xs: 12, lg: 7 }}>
                                    <Card sx={{ px: { xs: 2, sm: 4 }, py: 2, width: '100%' }}>
                                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18 }}>
                                            Audit Log
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography color="text.secondary">
                                                No recent activity to display
                                            </Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </div>
                </Box>
            </Box>
        </div>
    )
}