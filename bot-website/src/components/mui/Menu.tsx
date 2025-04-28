import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { AuthenticationStatusInterface } from '../../interfaces/Auth';
import Spinner from '../spinner/Spinner';


export const MUIMenu: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const onLogout = async () => {
        axios.defaults.withCredentials = true;
        axios.post('https://api.finchbot.xyz/auth/twitch/revoke').then((res) => {
            const logoutData: AuthenticationStatusInterface = res.data;
            if (!logoutData.error) setAnchorEl(null); setIsLoading(true); console.log(res.data)
            setTimeout(() => setIsLoading(false), 400);
        }).catch((err) => { console.log(err) })
    }
    return (
        <div>
            {!isLoading ? 
            <div>          
                <IconButton
                children={<Avatar sx={{ width: 60, height: 60 }} src='https://i.imgur.com/uGSH8Ct.jpg' />}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                />
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                </Menu>
            </div>
                : <Spinner />}
        </div>
    );
}