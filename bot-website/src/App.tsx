import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/pages/Home";
import { Login } from "./components/pages/Login";
import { Callback } from "./components/pages/Callback";
import { SongRequests } from "./components/pages/SongRequests";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import { AuthenticationStatusInterface } from "./interfaces/Auth";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const exclusiveUsers = ["louiee_tv"];
export const App: React.FC = () => {
  // state variable for auth
  const [isAuthed, setIsAuthed] = React.useState(false);

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
        console.log("auth status", isAuthed);
        exclusiveUsers.map((exclusiveUser: string) => {
          console.log(exclusiveUser, authData.display_name);
          if (exclusiveUser === authData.display_name?.toLocaleLowerCase()) {
            console.log("YOOOOOOO!!!!!!!!");
            axios
              .post("https://api.finchbot.xyz/song-queue-settings", null, {
                params: {
                  channel: authData.display_name.toLowerCase(),
                  song_queue_status: false,
                  song_limit: 20,
                  user_limit: 2,
                },
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err));
          }
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<Callback />} />
        <Route
          path="/dashboard/:streamer"
          element={<SongRequests authenticated={isAuthed} />}
        />
      </Routes>
    </ThemeProvider>
  );
};
