import * as React from 'react';
import { Button } from '@mui/material';
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";
import { Navigate, NavLink } from 'react-router-dom';
import { Home } from './Home';

interface Auth {
    error?: string,
}


export const Login: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [displayName, setDisplayName] = useState('');
    axios.defaults.withCredentials = true;

    useEffect(() => {
        setLoading(true);
        axios.post('https://finchbot-backend-2ef58bf717e6.herokuapp.com/auth/twitch/validate').then((res) => {
            const login: Auth = res.data;
            console.log(login);
            console.log(res.data);
            if (!login.error) setIsLoggedIn(true);
        }).catch((err) => { /* console.log(err); */ })
        setTimeout(() => setLoading(false), 250);
    }, [])




    const onLogin = async () => {
        const authUri = `https://id.twitch.tv/oauth2/authorize` +
        `?response_type=code` +
        `&client_id=m6ydi41sdy1oqh52n8s1lnn2905q7q` +
        `&redirect_uri=https://finchbot.netlify.app/auth/callback` +
        `&scope=openid user_read channel:manage:broadcast&`
        const code = await getCode(authUri);
        setLoading(true);
        console.log(code);
        axios.post('https://finchbot-backend-2ef58bf717e6.herokuapp.com/auth/twitch', null, {
            params: {
                code: code,
            }
        }).then((res) => {
            const loginData: Auth = res.data;
            console.log(res.data, loginData);
            setIsLoggedIn(true);
            axios.get('https://finchbot-backend-2ef58bf717e6.herokuapp.com/twitch/user').then((res) => {
                const userData : Auth = res.data
                if (!userData.error) setDisplayName(res.data[0].display_name); console.log(displayName);
            }).catch((err) => { console.log(err); })
        }).catch((err) => console.log(err))
        setTimeout(() => setLoading(false), 1000);
    }

    const onLogout = async () => {
        setLoading(true)
        axios.post('https://finchbot-backend-2ef58bf717e6.herokuapp.com/auth/twitch/revoke').then((res) => {
            const logoutData: Auth = res.data;
            if (!logoutData.error) setIsLoggedIn(false); setLoading(false); console.log(res.data)
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
        {/* if the state (loading) is true then display the Spinner component. */}
        {loading ? <Spinner/>
        :
        <div className="flex h-screen items-center justify-center">
        {/* if the user isn't logged in then display the login page. */}
        {!isLoggedIn ? 
                    <div className="mb-20">
                    <div className='text-center font-bold text-4xl'>LouieBot</div>
                    <div className="mt-4 w-80 h-40 rounded-md bg-gray-900 text-center">
                        <div className="flex ml-8">
                            <div className="mt-4 text-md whitespace-pre-line">Welcome to LouieBot!      Login to get Started!</div>
                        </div>
                        <Button variant="contained" sx={{backgroundColor: '#772CE8', fontWeight: 'bold', mt: 1.5, ':hover': { backgroundColor: '#620be4' }} } onClick={onLogin}>Log in with Twitch</Button>
                    </div>
                </div>
        //   if the user IS logged in then navigate them to the index page.      
        : <Navigate to={'/'}/>
        }
    </div> 
        }
        </> 
    )
}
