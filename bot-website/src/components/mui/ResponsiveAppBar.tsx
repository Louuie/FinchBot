import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export const ResponsiveAppBar: React.FC = () => {
  const pages = ["Dashboard", "Documentation", "About"];
  const settings = ["Sign out"];

  // State Variables that are Required for the ResponsiveAppBar to work correctly.
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  // Event Handler Functions that control the NavBar when it's opened
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);

  // Event Handler Functions that control the NavBar when it's closed
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* ICON/LOGO GOES HERE */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            className=" mr-2 md:flex font-bold tracking-[0.3rem]"
          >
            FINCHBOT
          </Typography>

          {/* Box used for Pages /*/}
          <Box className="flex flex-1 sm:flex-none md:flex-1">
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                className="mr-2 text-gray-200 block"
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Box used for Avatar Menu /*/}
          <Box className="grow-0">
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} className="p-0">
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              className="mt-[45px]"
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
