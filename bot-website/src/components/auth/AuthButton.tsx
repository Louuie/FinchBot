import { Button } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { Auth } from '../../auth/auth';

export const AuthButton: React.FC = () => {
    const onLogin = async () => {
        const authUri = `https://id.twitch.tv/oauth2/authorize` +
            `?response_type=code` +
            `&client_id=wtaln1ogegdpmq0cw7x1mxw1nmwpsx` +
            `&redirect_uri=http://localhost:3000/auth/callback` +
            `&scope=openid user_read&`
        const code = await getCode(authUri);
        axios.post('http://localhost:3030/auth/twitch', null, {
            params: {
                code: code,
            }
        }).then((res) => {
            const loginData: Auth = res.data;
            if (loginData.error) console.log(loginData.error);
            else {
                setIsSignedIn(true);
                // axios.get('http://localhost:3030/auth/twitch/user').then((res) => {
                //     const userData : Auth = res.data
                //     if (!userData.error) setDisplayName(res.data[0].display_name);
                // }).catch((err) => {  })
                ;
            }
        }).catch((err) => console.log(err))
    }

    const onLogout = async () => {
        axios.post('http://localhost:3030/auth/twitch/revoke').then((res) => {
            const logoutData: Auth = res.data;
            if (!logoutData.error) setIsSignedIn(false); console.log(res.data)
        }).catch((err) => { console.log(err) })
    }


    const getCode = (uri: string) => {
        return new Promise((resolve, reject) => {
            const authWindow = window.open(
                uri,
                "_blank_",
                "toolbar=yes,scrollbar=yes,resizable=yes,width=800,height=700"
            );
            let url: string | null;
            setInterval(async () => {
                try {
                    url = authWindow && authWindow.location && authWindow.location.search;
                } catch (e) { }
                if (url) {
                    const url = authWindow?.location.search.substring(6);
                    const formattedCode = url?.slice(0, 30);
                    authWindow!.close();
                    resolve(formattedCode);
                }
            }, 500);
        })
    };


    // TODO: grab whether the user is signed in through a prop that the MUIMenu component fetches from the server, this way if the user logs out the AuthButton component also updates with that state.
    const [isSignedIn, setIsSignedIn] = React.useState(false);
    React.useEffect(() => {
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3030/auth/twitch/validate').then((res) => {
            const auth: Auth = res.data;
            if (!auth.error) setIsSignedIn(true);
        })
    })

    if(!isSignedIn) return <Button variant="contained" sx={{ backgroundColor: '#772CE8', fontWeight: 'bold', mt: 1.5, ':hover': { backgroundColor: '#620be4' } }} onClick={onLogin}>Log in with Twitch</Button>
    else return <Button variant="contained" sx={{ backgroundColor: '#772CE8', fontWeight: 'bold', mt: 1.5, ':hover': { backgroundColor: '#620be4' } }} onClick={onLogout} >Log out</Button>
}