import * as React from "react";
import { ResponsiveAppBar } from "../mui/ResponsiveAppBar";
import { Alert, AlertTitle, Collapse, IconButton, Card, Button, Box, Grid, TextField, Divider, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

export const Home: React.FC = () => {
    const [open, setOpen] = React.useState(true);
    return (
        <div>
            <ResponsiveAppBar authenticated={false} />
            <Box mx={20} my={4}>
            <Collapse in={open}>
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
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18, my:2 }}>
                            Bot Actions
                        </Typography>
                        <Divider/>
                        <Button variant="contained" sx={{width: '100%'}}>Join Channel</Button>
                    </Card>
                </Grid>
                <Grid size={3}>
                    <Card sx={{ my: 4, px: 4, py: 2, width: '100%' }}>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18 }}>
                            Stream Controls
                        </Typography>
                        <Divider/>
                        <Box className="my-2">
                        <TextField label="Stream Title" variant="outlined" focused sx={{my:2}}/>
                        <TextField label="Stream Game" variant="outlined" focused/>
                        </Box>
                        <Divider/>
                        <Button disabled>Reset</Button>
                        <Button disabled>Update</Button>
                    </Card>
                </Grid>
                <Grid size={7}>
                    <Card sx={{ my: 4, px: 4, py: 2, width: '100%' }}>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18 }}>
                            Audit Log
                        </Typography>
                        <Divider/>
                        <Button variant="contained">Join Channel</Button>
                    </Card>
                </Grid>
            </Grid>
            </Box>
        </div>
    )
}