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
import AdbIcon from "@mui/icons-material/Adb";
import {
  AuthenticationStatusInterface,
  TwitchUserInfoInterface,
} from "../../interfaces/Auth";
import axios from "axios";
import { logout } from "../../api/api";

const pages = ["Dashboard", "Documentation", "About"];
const settings = ["Sign out"];

export const ResponsiveAppBar: React.FC<AuthenticationStatusInterface> = ({
  authenticated,
}) => {
  // state variable that sets the userData so that way we can use it
  const [userData, setUserData] = React.useState<TwitchUserInfoInterface>();

  // useEffect that checks if the user is Authenticated, if so fetch their displayName and avatar
  React.useEffect(() => {
    if (authenticated) {
      axios
        .get("http://localhost:3030/twitch/user", { withCredentials: true })
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
    <Toolbar disableGutters className="w-full bg-[#212121]">
      <AdbIcon className="sm:none md:flex mr-1 ml-1" />
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="/"
        className="mr-2 ml-2 hidden md:visible md:flex font-bold tracking-[0.3rem]"
      >
        FINCHBOT
      </Typography>

      <Box className="flex flex-1 sm:flex-none md:none">
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          className="sm:block md:flex-none"
        >
          {pages.map((page) => (
            <MenuItem key={page} onClick={handleCloseNavMenu}>
              <Typography textAlign="center">{page}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Box className="flex flex-1 sm:none md:flex">
        {pages.map((page) => (
          <Button
            key={page}
            onClick={handleCloseNavMenu}
            className="my-2 text-gray-200 block"
          >
            {page}
          </Button>
        ))}
      </Box>

      <Box className="flex mr-1">
        {authenticated ?
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
                  <Typography textAlign="center" >Sign out</Typography>
                </a>
              </MenuItem>
            </Menu>
          </div>
          :
          <Button variant="contained" className="mr-2 bg-[#127707] text-gray-100" href="/login">Login</Button>}
      </Box>
    </Toolbar>
  );
};
