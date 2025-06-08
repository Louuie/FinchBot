import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) return;

    axios.post('https://api.finchbot.xyz/auth/twitch', null, {
      params: { code }
    }).then(() => {
      navigate("/"); //Go back to home/dashboard
    }).catch((err) => {
      console.error("OAuth error:", err);
    });
  }, []);

  return (
    <div className="text-white text-center mt-10">
      Authenticating with Twitch...
    </div>
  );
};
