import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/pages/Home";
import { Login } from "./components/pages/Login";
import { Callback } from "./components/pages/Callback";
import { SongRequests } from "./components/pages/SongRequests";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import { AuthenticationStatusInterface } from "./interfaces/Auth";
import { Dashboard } from "./components/pages/Dashboard";
import { Commands } from "./components/pages/Commands";
import { Channel } from "./interfaces/Channel";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const exclusiveUsers = ["louiee_tv"];
export const App: React.FC = () => {
  // state variable for auth
  const [isAuthed, setIsAuthed] = React.useState(false);
  const [channelInfo, setChannelInfo] = React.useState<Channel>({
    broadcaster_id: '',
    broadcaster_login: '',
    broadcaster_name: '',
    broadcaster_language: '',
    game_id: '',
    game_name: '',
    title: '',
    delay: '',
  });

  // useEffect that fetches the users authentication status
  React.useEffect(() => {
    axios
      .post("https://api.finchbot.xyz/auth/twitch/validate", null, {
        withCredentials: true,
      })
      .then((res) => {
        const authData: AuthenticationStatusInterface = res.data;
        console.log(authData);
        setIsAuthed(Boolean(authData.authenticated));
        if(isAuthed) {
          axios.get('https://api.finchbot.xyz/auth/twitch/channel').then((res) => {
            const currentChannelInformation: Channel = res.data
            setChannelInfo(currentChannelInformation)
          })
        }
        // exclusiveUsers.map((exclusiveUser: string) => {
        //   console.log(exclusiveUser, authData.display_name);
        //   if (exclusiveUser === authData.display_name?.toLocaleLowerCase()) {
        //     axios
        //       .post("https://api.finchbot.xyz/song-queue-settings", null, {
        //         params: {
        //           channel: authData.display_name.toLowerCase(),
        //           song_queue_status: false,
        //           song_limit: 20,
        //           user_limit: 2,
        //         },
        //       })
        //       .then((res) => console.log(res.data))
        //       .catch((err) => console.log(err));
        //   }
        // });
      })
      .catch((err) => console.log(err));
  }, []);
  

  return (
    <ThemeProvider theme={darkTheme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<Callback />} />
        <Route path="/c/:streamer/dashboard" element={<Dashboard authenticated={isAuthed} channelInfo={channelInfo}/>} />
        <Route
          path="/c/:streamer/song-requests"
          element={<SongRequests authenticated={isAuthed} />}
        />
        <Route path="/c/:streamer/commands" element={<Commands authenticated={isAuthed}/>}/>
      </Routes>
    </ThemeProvider>
  );
};
