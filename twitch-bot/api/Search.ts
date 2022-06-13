import axios from "axios";

export const SearchForSong = async (user: string | undefined, channel: string, song: string) => {
    try {
        const { data } = await axios.get('http://localhost:3000/youtube', {params: {
            q: song,
            user: user,
            channel: channel
        }})
        return data;
    } catch(err) { console.log(err); }
};