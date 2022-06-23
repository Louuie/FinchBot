import { NextPage } from "next";
import { Button } from '@mui/material';
import axios from "axios";
import { useEffect, useState } from "react";

interface Auth {
    error?: string,
}


const Login: NextPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(true);
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3030/auth/twitch/validate').then((res) => {
            const login: Auth = res.data;
            if (!login.error) setIsLoggedIn(true);
            setDisplayName(res.data.display_name);
        }).catch((err) => {  })
        setLoading(false);
    }, [])




    const onLogin = async () => {
        const authUri = `https://id.twitch.tv/oauth2/authorize` +
        `?response_type=code` +
        `&client_id=wtaln1ogegdpmq0cw7x1mxw1nmwpsx` +
        `&redirect_uri=http://localhost:3000/auth/callback` +
        `&scope=openid user_read&`
        const code = await getCode(authUri);
        setLoading(true);
        axios.post('http://localhost:3030/auth/twitch', null, {
            params: {
                code: code,
            }
        }).then((res) => {
            const loginData: Auth = res.data;
            if (loginData.error) console.log(loginData.error);
            else {
                setIsLoggedIn(true);
                axios.get('http://localhost:3030/auth/twitch/user').then((res) => {
                    const userData : Auth = res.data
                    if (!userData.error) setDisplayName(res.data[0].display_name);
                }).catch((err) => {  })
                setLoading(false);
            }
        }).catch((err) => console.log(err))
    }

    const onLogout = async () => {
        setLoading(true)
        axios.post('http://localhost:3030/auth/twitch/revoke').then((res) => {
            const logoutData: Auth = res.data;
            if (!logoutData.error) setIsLoggedIn(false); console.log(res.data)
        }).catch((err) => { console.log(err) })
    }

    const getCode = (uri : string) => {
        return new Promise((resolve, reject) => {
            const authWindow = window.open(
                uri,
                "_blank_",
                "toolbar=yes,scrollbar=yes,resizable=yes,width=800,height=700"
            );
            let url : string | null;
            setInterval(async () => {
                try {
                  url = authWindow && authWindow.location && authWindow.location.search;
                } catch (e) {}  
                if (url) {
                  const url = authWindow?.location.search.substring(6);
                  const formattedCode = url?.slice(0, 30);
                  authWindow!.close();
                  resolve(formattedCode);
                }
              }, 500);
        })
    };

    return (
        <>
        {loading ? <div>Loading...</div> 
        :
        <div className="flex h-screen items-center justify-center">
        {!isLoggedIn ? 
                    <div className="mb-20">
                    <div className='text-center font-bold text-3xl'>DaCommunityBot</div>
                    <div className="mt-4 w-80 h-40 rounded-md bg-gray-900 text-center">
                        <div className="flex">
                            <div className="mt-4 text-md">Welcome to the DaCommunityBot! Please Login to get Started!</div>
                        </div>
                        <Button variant="contained" sx={{backgroundColor: '#772CE8', mt: 1.5, ':hover': { backgroundColor: '#620be4' }} } onClick={onLogin}>Log in with Twitch</Button>
                    </div>
                </div>
        : <div className="">
            <div>Hello, {displayName}!</div>
            <Button variant="contained" sx={{mt: 1}} fullWidth={true} onClick={onLogout} >Log out</Button>    
        </div>
        }
    </div> 
        }
        </> 
    )
}

export default Login