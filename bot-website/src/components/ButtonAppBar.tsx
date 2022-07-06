import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";

export default function ButtonAppBar() {
    return (
      <Box sx={{ flex: 1 }}>
        <AppBar position="static" sx={{backgroundColor: '#091126'}}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              News
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }