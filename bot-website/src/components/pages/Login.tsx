import * as React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
// import your logo if you want to display it
import finchBotLogo from '../../assets/FinchBot_logo.png';
import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";
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
        axios.post('https://api.finchbot.xyz/auth/twitch/validate').then((res) => {
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
        `&redirect_uri=https://finchbot.xyz/auth/callback` +
        `&scope=openid user_read channel:manage:broadcast&`
        const code = await getCode(authUri);
        setLoading(true);
        console.log(code);
        axios.post('https://api.finchbot.xyz/auth/twitch', null, {
            params: {
                code: code,
            }
        }).then((res) => {
            const loginData: Auth = res.data;
            console.log(res.data, loginData);
            setIsLoggedIn(true);
            axios.get('https://api.finchbot.xyz/twitch/user').then((res) => {
                const userData : Auth = res.data
                if (!userData.error) setDisplayName(res.data[0].display_name); console.log(displayName);
            }).catch((err) => { console.log(err); })
        }).catch((err) => console.log(err))
        setTimeout(() => setLoading(false), 1000);
    }

    const onLogout = async () => {
        setLoading(true)
        axios.post('https://api.finchbot.xyz/auth/twitch/revoke').then((res) => {
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
        {loading ? (
            <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#0A1228] to-[#172442]">
                <CircularProgress color="secondary" />
            </div>
        ) : (
            <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#0A1228] to-[#172442]">
                {!isLoggedIn ? (
                    <div className="bg-[#0F1A30]/90 border border-blue-900/40 shadow-2xl rounded-2xl px-8 py-10 flex flex-col items-center w-full max-w-sm">
                        <img
                            src={finchBotLogo}
                            alt="FinchBot Logo"
                            className="w-20 h-20 object-contain mb-4"
                        />
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 mb-2">
                            Welcome to FinchBot
                        </h1>
                        <p className="text-blue-100 mb-6 text-center">
                            Log in with Twitch to get started and take your stream to the next level!
                        </p>
                        <Button
                            variant="contained"
                            className='text-gray-100'
                            fullWidth
                            sx={{
                                background: '#772CE8',
                                fontWeight: 'bold',
                                borderRadius: '9999px',
                                py: 1.5,
                                fontSize: '1rem',
                                boxShadow: '0 4px 24px 0 rgba(80, 70, 229, 0.15)',
                                ':hover': {
                                    background: 'linear-gradient(90deg, #620be4 0%, #3730a3 100%)',
                                },
                            }}
                            onClick={onLogin}
                        >
                            Log in with Twitch
                        </Button>
                    </div>
                ) : (
                    <Navigate to="/" />
                )}
            </div>
        )}
        </>
    );
};
