import * as React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import finchBotLogo from '../../assets/FinchBot_logo.png';

interface Auth {
  error?: string;
}

export const Login: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true); // default to true during validation

  axios.defaults.withCredentials = true;

  React.useEffect(() => {
    axios.post('https://api.finchbot.xyz/auth/twitch/validate')
      .then((res) => {
        const login: Auth = res.data;
        if (!login.error) {
          setIsLoggedIn(true);
        }
      })
      .catch((err) => {
        console.error("Validation error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onLogin = () => {
    const authUri = `https://id.twitch.tv/oauth2/authorize` +
      `?response_type=code` +
      `&client_id=m6ydi41sdy1oqh52n8s1lnn2905q7q` +
      `&redirect_uri=https://finchbot.xyz/auth/callback` +
      `&scope=openid user_read channel:manage:broadcast`;

    window.location.href = authUri;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#0A1228] to-[#172442]">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#0A1228] to-[#172442]">
      <div className="bg-[#0F1A30]/90 border border-blue-900/40 shadow-2xl rounded-2xl px-8 py-10 flex flex-col items-center w-full max-w-sm">
        <img src={finchBotLogo} alt="FinchBot Logo" className="w-20 h-20 object-contain mb-4" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 mb-2">
          Welcome to FinchBot
        </h1>
        <p className="text-blue-100 mb-6 text-center">
          Log in with Twitch to get started and take your stream to the next level!
        </p>
        <Button
          variant="contained"
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
    </div>
  );
};
