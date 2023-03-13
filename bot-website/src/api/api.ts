import axios from "axios";

export const deleteSong = async (streamer: string, id: number | undefined, title: string | undefined) => {
    axios.get('http://localhost:3030/song-request-delete', {
        params: {
          channel: streamer,
          id: id,
        }
      }).then((res) => console.log(res.data)).catch((err) => console.log(err));
  }

  export const promoteSong = async (streamer: string, title: string | undefined, pos1: number | undefined, pos2: number | undefined) => {
    console.log(pos1, pos2)
    axios.post('http://localhost:3030/promote-song', null, {
      params: {
        channel: streamer,
        title: title,
        position1: pos1,
        position2: pos2,
      }
    }).then((res) => console.log(res.data)).catch((err) => console.log(err));
  }



  export const logout = async () => {
    axios.post('http://localhost:3030/auth/twitch/revoke', null, {withCredentials: true}).then((res) => console.log(res.data)).catch((err) => console.log(err))
  }


  

export const formatDuration = (duration: number) => {
  const minute = Math.floor(duration / 60);
  const secondsLeft = duration - minute * 60;
  return `0${minute}:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;
}


  // onEnd function that deletes the song/video that was playing that has "just ended".
  export const onSongEnd = (streamer: string, songID: number | undefined): void => {
    axios.get('http://localhost:3030/song-request-delete', {
      params: {
        channel: 'Louiee_tv',
        id: songID,
      }
    }).then((res) => (console.log(res.data))).catch((err) => console.log(err));
  }