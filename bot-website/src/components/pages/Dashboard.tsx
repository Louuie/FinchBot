import * as React from "react";
import { ResponsiveAppBar } from "../mui/ResponsiveAppBar";
import { Alert, AlertTitle, Collapse, IconButton, Card, Button, Box, Grid, TextField, Divider, Typography, CssBaseline, AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Close, FormatListBulleted, QueueMusic } from "@mui/icons-material";
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
    const params = useParams()
    const drawerItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: `/c/${params.streamer}/dashboard` },
        { text: 'Commands', icon: <FormatListBulleted />, path: `/c/${params.streamer}/commands` },
        { text: 'Song Requests', icon: <QueueMusic />, path: `/c/${params.streamer}/song-requests` },
    ];
    const location = useLocation()
    const [open, setOpen] = React.useState(true);
    const joinTwitchChannel = async () => {
        const result = await joinChannel(params.streamer)
        setIsJoined(result)
        console.log(`isJoined: ${isJoined}`)
    }
    const partTwitchChannel = async () => {
        const result = await partChannel(params.streamer)
        if(Boolean(result)) setIsJoined(false)
        console.log(isJoined)
    }
    // useEffect that checks if the twitch-bot is in the streamers chatroom
    React.useEffect(() => {
        axios.post("https://api.finchbot.xyz/join-channel", null, {
            params: {
                channel: params.streamer,
            }
        }).then((res) => console.log(res))
    }, [params.streamer])
    return (
        <div>
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
                    sx={{ flexGrow: 1, p: 3 }}
                >
                    <Toolbar />
                    <div>
                        <Box mx={20} my={4}>
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
                                >
                                    <AlertTitle>FinchBot is not joined to your channel!</AlertTitle>
                                    Join FinchBot to your channel to allow it to handle song-requests, respond to commands, moderate your chat and engage with your community.
                                </Alert>
                            </Collapse>
                            <Grid container spacing={3}>
                                <Grid size={2}>
                                    <Card sx={{ my: 4, px: 4, py: 2, width: '100%' }} >
                                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18, my: 2 }}>
                                            Bot Actions
                                        </Typography>
                                        <Divider />
                                        {
                                        isJoined ? 
                                            <Button onClick={() => {partTwitchChannel()}} variant="contained" sx={{ width: '100%' }}>Leave Channel</Button>
                                           :
                                           <Button onClick={() => {joinTwitchChannel()}} variant="contained" sx={{ width: '100%' }}>Join Channel</Button>
                                        }
                                    </Card>
                                </Grid>
                                <Grid size={3}>
                                    <Card sx={{ my: 4, px: 4, py: 2, width: '100%' }}>
                                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18 }}>
                                            Stream Controls
                                        </Typography>
                                        <Divider />
                                        <Box className="my-2">
                                            <TextField label="Stream Title" value={channelInfo.title} variant="outlined" focused sx={{ my: 2 }} />
                                            <TextField label="Stream Game" value={channelInfo.category} variant="outlined" focused />
                                        </Box>
                                        <Divider />
                                        <Button disabled>Reset</Button>
                                        <Button disabled>Update</Button>
                                    </Card>
                                </Grid>
                                <Grid size={7}>
                                    <Card sx={{ my: 4, px: 4, py: 2, width: '100%' }}>
                                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18 }}>
                                            Audit Log
                                        </Typography>
                                        <Divider />
                                        <Button variant="contained">Join Channel</Button>
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