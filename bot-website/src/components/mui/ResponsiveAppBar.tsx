import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import FinchBot_logo from '../../assets/FinchBot_logo_large.png'
import {
  AuthenticationStatusInterface,
  TwitchUserInfoInterface,
} from "../../interfaces/Auth";
import axios from "axios";
import { logout } from "../../api/api";
import { AppBar } from "@mui/material";

const settings = ["Sign out"];

interface ResponsiveAppBarProps extends AuthenticationStatusInterface {
  onDrawerToggle?: () => void;
  showDrawerToggle?: boolean;
}

export const ResponsiveAppBar: React.FC<ResponsiveAppBarProps> = ({
  authenticated,
  onDrawerToggle,
  showDrawerToggle = false,
}) => {
  // state variable that sets the userData so that way we can use it
  const [userData, setUserData] = React.useState<TwitchUserInfoInterface>();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // useEffect that checks if the user is Authenticated, if so fetch their displayName and avatar
  React.useEffect(() => {
    if (authenticated) {
      axios
        .get("https://api.finchbot.xyz/twitch/user", { withCredentials: true })
        .then((res) => {
          const userData: TwitchUserInfoInterface = res.data[0];
          setUserData(userData);
        })
        .catch((err) => console.log(err));
    } else console.log("not authed for some reason!");
  }, [authenticated]);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" elevation={0} className="bg-[#212121]" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar disableGutters className="w-full">
        {/* Drawer Toggle Button - Only show on mobile when showDrawerToggle is true */}
        {showDrawerToggle && isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ ml: 1, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <img
          src={FinchBot_logo}
          alt="FinchBot Logo"
          className="h-12 w-12 ml-2 mr-2"
        />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          className="mr-2 ml-2 hidden md:visible md:flex font-bold tracking-[0.3rem] text-gray-100 no-underline"
        >
          FINCHBOT
        </Typography>

        <Box className="flex ml-auto mr-1 items-end">
          {authenticated ? (
            <div>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} className="p-2">
                  <Avatar alt={userData?.display_name} src={userData?.profile_image_url} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
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
                <MenuItem href="/" onClick={() => { setAnchorElUser(null); }}>
                  <a href="/" onClick={() => logout()}>
                    <Typography textAlign="center">Sign out</Typography>
                  </a>
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button variant="contained" className="mr-2 bg-[#127707] text-gray-100" href="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};