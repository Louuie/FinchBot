import axios from "axios";

export const deleteSong = async (id: number | undefined, title: string | undefined) => {
    axios.get('http://localhost:3030/song-request-delete', {
        params: {
          channel: 'louiee_tv',
          id: id,
        }
      }).then((res) => console.log(res.data)).catch((err) => console.log(err));
  }

  export const promoteSong = async (title: string | undefined, pos1: number | undefined, pos2: number | undefined) => {
    console.log(pos1, pos2)
    axios.post('http://localhost:3030/promote-song', null, {
      params: {
        channel: 'louiee_tv',
        title: title,
        position1: pos1,
        position2: pos2,
      }
    }).then((res) => console.log(res.data)).catch((err) => console.log(err));
  }



  export const logout = async () => {
    axios.post('http://localhost:3030/auth/twitch/revoke', null, {withCredentials: true}).then((res) => console.log(res.data)).catch((err) => console.log(err))
  }