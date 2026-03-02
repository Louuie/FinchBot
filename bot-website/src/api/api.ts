import axios from "axios";

export const deleteSong = async (streamer: string, id: number | undefined, title: string | undefined) => {
    axios.get('https://api.finchbot.xyz/song-request-delete', {
        params: {
          channel: streamer,
          id: id,
        }
      }).then((res) => console.log(res.data)).catch((err) => console.log(err));
  }

  export const promoteSong = async (streamer: string, pos1: number) => {
    console.log(pos1)
    axios.post('https://api.finchbot.xyz/promote-song', null, {
      params: {
        channel: streamer,
        position: pos1,
      }
    }).then((res) => console.log(res.data)).catch((err) => console.log(err));
  }



  export const logout = async () => {
    axios.post('https://api.finchbot.xyz/auth/twitch/revoke', null, {withCredentials: true}).then((res) => console.log(res.data)).catch((err) => console.log(err))
  }


  

export const formatDuration = (duration: number) => {
  const minute = Math.floor(duration / 60);
  const secondsLeft = duration - minute * 60;
  return `0${minute}:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;
}


  // onEnd function that deletes the song/video that was playing that has "just ended".
  export const onSongEnd = (streamer: string, songID: number | undefined): void => {
    axios.get('https://api.finchbot.xyz/song-request-delete', {
      params: {
        channel: streamer,
        id: songID,
      }
    }).then((res) => (console.log(res.data))).catch((err) => console.log(err));
  }



// updates the settings menu
export const onSettingsUpdate = (channel: string, status: boolean, song_limit: number, user_limit: number) => {
  axios.post('https://api.finchbot.xyz/song-queue-settings', null, {
    params: {
      channel: channel + '_settings',
      status: status,
      song_limit: song_limit,
      user_limit: user_limit,
    }
  }).then((res) => console.log(res.data)).catch((err) => console.log(err));
}


export const fetchSongQueueSettings = async (channel : string) => {
  const { data } = await axios.get('https://api.finchbot.xyz/song-queue-settings', {
    params: {
      channel: channel
    }
  })
  return data;
}

export const joinChannel = async (channel?: string): Promise<boolean> => {
  try {
    const res = await axios.post('https://api.finchbot.xyz/join-channel', null, {
      params: { channel }
    });
    console.log(Boolean(res.data), res.data);
    return Boolean(res.data)
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const partChannel = async (channel?: string): Promise<boolean> => {
  try {
    const res = await axios.post('https://api.finchbot.xyz/part-channel', null, {
      params: { channel }
    });
    console.log(Boolean(res.data));
    return Boolean(res.data)
  } catch (err) {
    console.log(err);
    return false;
  }
};
